const prisma = require('../config/database');
const { generateOrderNumber, calculateShipping, estimateDelivery } = require('../utils/helpers');
const { ORDER_STATUS } = require('../utils/constants');
const { sendOrderConfirmation } = require('../services/emailService');

// ── Create Order ─────────────────────────────────────────────────────────────
const createOrder = async (req, res, next) => {
  try {
    const { addressId, items, paymentMethod = 'COD', notes } = req.body;
    const userId = req.user.id;

    // Validate items and fetch variant prices
    const variantIds = items.map((i) => i.variantId);
    const variants = await prisma.productVariant.findMany({
      where: { id: { in: variantIds }, isActive: true },
      include: { product: { select: { id: true, name: true, images: true } } },
    });

    if (variants.length !== items.length) {
      return res.status(400).json({ success: false, message: 'One or more items are unavailable.' });
    }

    // Check stock
    for (const item of items) {
      const variant = variants.find((v) => v.id === item.variantId);
      if (!variant || variant.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${variant?.product?.name || 'a product'}.`,
        });
      }
    }

    // Build order items and calculate totals
    const orderItems = items.map((item) => {
      const variant = variants.find((v) => v.id === item.variantId);
      return {
        productId: variant.product.id,
        variantId: variant.id,
        quantity: item.quantity,
        price: variant.price,
        total: variant.price * item.quantity,
      };
    });

    const subtotal = orderItems.reduce((sum, i) => sum + i.total, 0);
    const shippingCharge = calculateShipping(subtotal);
    const total = subtotal + shippingCharge;

    // Create order in a transaction
    const order = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          orderNumber: generateOrderNumber(),
          userId,
          addressId,
          paymentMethod,
          notes,
          subtotal,
          shippingCharge,
          total,
          estimatedDelivery: estimateDelivery(),
          items: { create: orderItems },
          statusHistory: {
            create: { status: ORDER_STATUS.PENDING, note: 'Order placed' },
          },
        },
        include: {
          items: {
            include: {
              product: { select: { name: true, images: true } },
              variant: { select: { weight: true } },
            },
          },
          address: true,
          user: { select: { name: true, email: true } },
        },
      });

      // Decrement stock
      for (const item of items) {
        await tx.productVariant.update({
          where: { id: item.variantId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      return newOrder;
    });

    // Send confirmation email (non-blocking)
    sendOrderConfirmation(order).catch((err) =>
      console.warn('[Email] Failed to send order confirmation:', err.message)
    );

    res.status(201).json({ success: true, message: 'Order placed successfully.', order });
  } catch (err) {
    next(err);
  }
};

// ── Get Current User's Orders ─────────────────────────────────────────────────
const getUserOrders = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where: { userId: req.user.id },
        orderBy: { createdAt: 'desc' },
        skip,
        take: parseInt(limit),
        include: {
          items: {
            include: {
              product: { select: { name: true, images: true } },
              variant: { select: { weight: true } },
            },
          },
        },
      }),
      prisma.order.count({ where: { userId: req.user.id } }),
    ]);

    res.json({
      success: true, orders,
      pagination: { page: parseInt(page), limit: parseInt(limit), total },
    });
  } catch (err) {
    next(err);
  }
};

// ── Get Single Order ──────────────────────────────────────────────────────────
const getOrder = async (req, res, next) => {
  try {
    const order = await prisma.order.findUnique({
      where: { orderNumber: req.params.orderNumber },
      include: {
        items: {
          include: {
            product: { select: { name: true, images: true, slug: true } },
            variant: { select: { weight: true, price: true } },
          },
        },
        address: true,
        statusHistory: { orderBy: { createdAt: 'asc' } },
        user: { select: { name: true, email: true } },
      },
    });

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    // Only the owner or admin can view
    if (order.userId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ success: false, message: 'Access denied.' });
    }

    res.json({ success: true, order });
  } catch (err) {
    next(err);
  }
};

// ── Get All Orders (Admin) ────────────────────────────────────────────────────
const getAllOrders = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const where = status ? { status } : {};

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        skip,
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { name: true, email: true, phone: true } },
          address: true,
          items: {
            include: {
              product: { select: { name: true } },
              variant: { select: { weight: true } },
            },
          },
        },
      }),
      prisma.order.count({ where }),
    ]);

    res.json({
      success: true, orders,
      pagination: { page: parseInt(page), limit: parseInt(limit), total },
    });
  } catch (err) {
    next(err);
  }
};

// ── Update Order Status (Admin) ───────────────────────────────────────────────
const updateOrderStatus = async (req, res, next) => {
  try {
    const { status, note } = req.body;

    const order = await prisma.order.update({
      where: { id: req.params.id },
      data: {
        status,
        statusHistory: { create: { status, note } },
      },
    });

    res.json({ success: true, message: `Order status updated to ${status}.`, order });
  } catch (err) {
    next(err);
  }
};

module.exports = { createOrder, getUserOrders, getOrder, getAllOrders, updateOrderStatus };
