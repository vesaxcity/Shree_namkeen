const crypto = require('crypto');
const razorpay = require('../config/razorpay');
const prisma = require('../config/database');

// ── Create Razorpay Order ─────────────────────────────────────────────────────
const createRazorpayOrder = async (req, res, next) => {
  try {
    const { amount, orderNumber } = req.body; // amount in rupees

    const options = {
      amount: Math.round(amount * 100), // convert to paise
      currency: 'INR',
      receipt: orderNumber,
      notes: { orderNumber },
    };

    const rzpOrder = await razorpay.orders.create(options);

    // Store Razorpay order id against our order
    await prisma.order.update({
      where: { orderNumber },
      data: { razorpayOrderId: rzpOrder.id },
    });

    res.json({
      success: true,
      razorpayOrderId: rzpOrder.id,
      amount: rzpOrder.amount,
      currency: rzpOrder.currency,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    next(err);
  }
};

// ── Verify Razorpay Payment ───────────────────────────────────────────────────
const verifyPayment = async (req, res, next) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderNumber } = req.body;

    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: 'Payment verification failed. Invalid signature.' });
    }

    // Mark order as paid
    await prisma.order.update({
      where: { orderNumber },
      data: {
        paymentStatus: 'PAID',
        paymentMethod: 'RAZORPAY',
        razorpayPaymentId: razorpay_payment_id,
        status: 'CONFIRMED',
        statusHistory: {
          create: { status: 'CONFIRMED', note: `Payment verified. Payment ID: ${razorpay_payment_id}` },
        },
      },
    });

    res.json({ success: true, message: 'Payment verified successfully.' });
  } catch (err) {
    next(err);
  }
};

module.exports = { createRazorpayOrder, verifyPayment };
