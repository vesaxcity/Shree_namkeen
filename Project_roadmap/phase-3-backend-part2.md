# Phase 3: Backend Development - Part 2
## Controllers, Routes, Services & Server Setup

---

## Controllers

### Authentication Controller

**src/controllers/authController.js:**
```javascript
const bcrypt = require('bcrypt');
const prisma = require('../config/database');
const { generateToken, generateRefreshToken } = require('../utils/helpers');

// Register new user
exports.register = async (req, res, next) => {
  try {
    const { email, password, name, phone } = req.body;

    // Check if user exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered',
      });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        name,
        phone,
      },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
      },
    });

    // Generate tokens
    const token = generateToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      data: {
        user,
        token,
        refreshToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Login user
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Generate tokens
    const token = generateToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          phone: user.phone,
          role: user.role,
        },
        token,
        refreshToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get current user
exports.getMe = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        isVerified: true,
        createdAt: true,
      },
    });

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// Update profile
exports.updateProfile = async (req, res, next) => {
  try {
    const { name, phone } = req.body;

    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: { name, phone },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
      },
    });

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// Change password
exports.changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await prisma.user.findUnique({ where: { id: req.user.id } });

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect',
      });
    }

    // Hash new password
    const passwordHash = await bcrypt.hash(newPassword, 12);

    await prisma.user.update({
      where: { id: req.user.id },
      data: { passwordHash },
    });

    res.json({
      success: true,
      message: 'Password changed successfully',
    });
  } catch (error) {
    next(error);
  }
};
```

### Product Controller

**src/controllers/productController.js:**
```javascript
const prisma = require('../config/database');
const { slugify } = require('../utils/helpers');

// Get all products
exports.getAllProducts = async (req, res, next) => {
  try {
    const { 
      category, 
      search, 
      minPrice, 
      maxPrice, 
      isBestseller,
      isFeatured,
      page = 1, 
      limit = 12,
      sortBy = 'createdAt',
      order = 'desc',
    } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    // Build where clause
    const where = {
      isActive: true,
    };

    if (category) {
      where.category = { slug: category };
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (minPrice || maxPrice) {
      where.basePrice = {};
      if (minPrice) where.basePrice.gte = parseFloat(minPrice);
      if (maxPrice) where.basePrice.lte = parseFloat(maxPrice);
    }

    if (isBestseller === 'true') {
      where.isBestseller = true;
    }

    if (isFeatured === 'true') {
      where.isFeatured = true;
    }

    // Get products
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: {
            select: { id: true, name: true, slug: true },
          },
          variants: {
            select: {
              id: true,
              weight: true,
              price: true,
              compareAtPrice: true,
              stockQuantity: true,
              isAvailable: true,
            },
          },
        },
        skip,
        take,
        orderBy: { [sortBy]: order },
      }),
      prisma.product.count({ where }),
    ]);

    res.json({
      success: true,
      data: {
        products,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit)),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get single product
exports.getProduct = async (req, res, next) => {
  try {
    const { slug } = req.params;

    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
        variants: true,
        reviews: {
          where: { isApproved: true },
          include: {
            user: {
              select: { id: true, name: true },
            },
          },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });

    if (!product || !product.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    res.json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

// Create product (Admin only)
exports.createProduct = async (req, res, next) => {
  try {
    const { 
      name, 
      description, 
      categoryId, 
      basePrice, 
      imageUrl,
      ingredients,
      shelfLife,
      variants,
      isFeatured,
      isBestseller,
    } = req.body;

    const slug = slugify(name);

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description,
        categoryId: parseInt(categoryId),
        basePrice,
        imageUrl,
        ingredients,
        shelfLife,
        isFeatured,
        isBestseller,
        variants: {
          create: variants.map(v => ({
            weight: v.weight,
            price: v.price,
            compareAtPrice: v.compareAtPrice,
            stockQuantity: v.stockQuantity,
            sku: v.sku,
          })),
        },
      },
      include: {
        category: true,
        variants: true,
      },
    });

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

// Update product (Admin only)
exports.updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (updateData.name) {
      updateData.slug = slugify(updateData.name);
    }

    const product = await prisma.product.update({
      where: { id: parseInt(id) },
      data: updateData,
      include: {
        category: true,
        variants: true,
      },
    });

    res.json({
      success: true,
      message: 'Product updated successfully',
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

// Delete product (Admin only)
exports.deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    await prisma.product.delete({
      where: { id: parseInt(id) },
    });

    res.json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
```

### Order Controller

**src/controllers/orderController.js:**
```javascript
const prisma = require('../config/database');
const { generateOrderNumber, calculateShipping, estimateDelivery } = require('../utils/helpers');
const { sendOrderConfirmation } = require('../services/emailService');
const { ORDER_STATUS, PAYMENT_STATUS } = require('../utils/constants');

// Create order
exports.createOrder = async (req, res, next) => {
  try {
    const {
      items,
      shippingAddress,
      paymentMethod,
      customerNotes,
    } = req.body;

    // Calculate totals
    let subtotal = 0;
    for (const item of items) {
      const variant = await prisma.productVariant.findUnique({
        where: { id: item.variantId },
      });
      subtotal += variant.price * item.quantity;
    }

    const shippingCost = calculateShipping(subtotal);
    const totalAmount = subtotal + shippingCost;

    // Generate order number
    const orderNumber = generateOrderNumber();

    // Create order
    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId: req.user?.id,
        customerName: shippingAddress.fullName,
        customerEmail: req.user?.email || shippingAddress.email,
        customerPhone: shippingAddress.phone,
        shippingAddressSnapshot: shippingAddress,
        subtotal,
        shippingCost,
        totalAmount,
        paymentMethod,
        paymentStatus: paymentMethod === 'COD' ? PAYMENT_STATUS.PENDING : PAYMENT_STATUS.PENDING,
        status: ORDER_STATUS.PENDING,
        estimatedDelivery: estimateDelivery(),
        customerNotes,
        items: {
          create: items.map(item => ({
            productId: item.productId,
            productVariantId: item.variantId,
            productName: item.productName,
            variantWeight: item.weight,
            priceAtPurchase: item.price,
            quantity: item.quantity,
            subtotal: item.price * item.quantity,
          })),
        },
        statusHistory: {
          create: {
            status: ORDER_STATUS.PENDING,
            notes: 'Order created',
          },
        },
      },
      include: {
        items: {
          include: {
            product: true,
            variant: true,
          },
        },
      },
    });

    // Send confirmation email
    if (req.user?.email) {
      await sendOrderConfirmation(order, req.user);
    }

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

// Get user orders
exports.getUserOrders = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where: { userId: req.user.id },
        include: {
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  imageUrl: true,
                },
              },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: parseInt(limit),
      }),
      prisma.order.count({ where: { userId: req.user.id } }),
    ]);

    res.json({
      success: true,
      data: {
        orders,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit)),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get single order
exports.getOrder = async (req, res, next) => {
  try {
    const { orderNumber } = req.params;

    const order = await prisma.order.findUnique({
      where: { orderNumber },
      include: {
        items: {
          include: {
            product: true,
            variant: true,
          },
        },
        statusHistory: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    // Check authorization
    if (order.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this order',
      });
    }

    res.json({
      success: true,
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

// Update order status (Admin only)
exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, notes, trackingNumber, courierName } = req.body;

    const updateData = { status };

    if (status === ORDER_STATUS.CONFIRMED) {
      updateData.confirmedAt = new Date();
    } else if (status === ORDER_STATUS.SHIPPED) {
      updateData.shippedAt = new Date();
      if (trackingNumber) updateData.trackingNumber = trackingNumber;
      if (courierName) updateData.courierName = courierName;
    } else if (status === ORDER_STATUS.DELIVERED) {
      updateData.deliveredAt = new Date();
    } else if (status === ORDER_STATUS.CANCELLED) {
      updateData.cancelledAt = new Date();
      if (notes) updateData.cancellationReason = notes;
    }

    const order = await prisma.order.update({
      where: { id: parseInt(id) },
      data: {
        ...updateData,
        statusHistory: {
          create: {
            status,
            notes,
            createdBy: req.user.id,
          },
        },
      },
      include: {
        items: true,
      },
    });

    res.json({
      success: true,
      message: 'Order status updated successfully',
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

// Get all orders (Admin only)
exports.getAllOrders = async (req, res, next) => {
  try {
    const { 
      status, 
      paymentStatus,
      page = 1, 
      limit = 20,
      sortBy = 'createdAt',
      order = 'desc',
    } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const where = {};

    if (status) where.status = status;
    if (paymentStatus) where.paymentStatus = paymentStatus;

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          user: {
            select: { id: true, name: true, email: true },
          },
          items: {
            include: {
              product: {
                select: { id: true, name: true },
              },
            },
          },
        },
        orderBy: { [sortBy]: order },
        skip,
        take: parseInt(limit),
      }),
      prisma.order.count({ where }),
    ]);

    res.json({
      success: true,
      data: {
        orders,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit)),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};
```

### Payment Controller

**src/controllers/paymentController.js:**
```javascript
const crypto = require('crypto');
const razorpay = require('../config/razorpay');
const prisma = require('../config/database');
const { PAYMENT_STATUS, ORDER_STATUS } = require('../utils/constants');

// Create Razorpay order
exports.createRazorpayOrder = async (req, res, next) => {
  try {
    const { orderId, amount } = req.body;

    // Create Razorpay order
    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(amount * 100), // Convert to paise
      currency: 'INR',
      receipt: `order_${orderId}`,
      notes: {
        orderId,
      },
    });

    // Update order with Razorpay order ID
    await prisma.order.update({
      where: { id: parseInt(orderId) },
      data: {
        razorpayOrderId: razorpayOrder.id,
      },
    });

    res.json({
      success: true,
      data: {
        orderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Verify Razorpay payment
exports.verifyPayment = async (req, res, next) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderId,
    } = req.body;

    // Create signature
    const sign = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest('hex');

    // Verify signature
    if (razorpay_signature === expectedSign) {
      // Payment successful
      const order = await prisma.order.update({
        where: { id: parseInt(orderId) },
        data: {
          paymentStatus: PAYMENT_STATUS.PAID,
          paymentId: razorpay_payment_id,
          razorpaySignature: razorpay_signature,
          status: ORDER_STATUS.CONFIRMED,
          confirmedAt: new Date(),
          statusHistory: {
            create: {
              status: ORDER_STATUS.CONFIRMED,
              notes: 'Payment verified and order confirmed',
            },
          },
        },
      });

      res.json({
        success: true,
        message: 'Payment verified successfully',
        data: order,
      });
    } else {
      // Payment verification failed
      await prisma.order.update({
        where: { id: parseInt(orderId) },
        data: {
          paymentStatus: PAYMENT_STATUS.FAILED,
        },
      });

      res.status(400).json({
        success: false,
        message: 'Payment verification failed',
      });
    }
  } catch (error) {
    next(error);
  }
};
```

---

## Routes

**src/routes/auth.js:**
```javascript
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/me', protect, authController.getMe);
router.put('/profile', protect, authController.updateProfile);
router.put('/password', protect, authController.changePassword);

module.exports = router;
```

**src/routes/products.js:**
```javascript
const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { protect } = require('../middleware/auth');
const { requireAdmin } = require('../middleware/admin');

router.get('/', productController.getAllProducts);
router.get('/:slug', productController.getProduct);
router.post('/', protect, requireAdmin, productController.createProduct);
router.put('/:id', protect, requireAdmin, productController.updateProduct);
router.delete('/:id', protect, requireAdmin, productController.deleteProduct);

module.exports = router;
```

**src/routes/orders.js:**
```javascript
const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { protect, optionalAuth } = require('../middleware/auth');
const { requireAdmin } = require('../middleware/admin');

router.post('/', optionalAuth, orderController.createOrder);
router.get('/my-orders', protect, orderController.getUserOrders);
router.get('/all', protect, requireAdmin, orderController.getAllOrders);
router.get('/:orderNumber', protect, orderController.getOrder);
router.put('/:id/status', protect, requireAdmin, orderController.updateOrderStatus);

module.exports = router;
```

**src/routes/payments.js:**
```javascript
const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { optionalAuth } = require('../middleware/auth');

router.post('/create-order', optionalAuth, paymentController.createRazorpayOrder);
router.post('/verify', optionalAuth, paymentController.verifyPayment);

module.exports = router;
```

**src/routes/categories.js:**
```javascript
const express = require('express');
const router = express.Router();
const prisma = require('../config/database');

// Get all categories
router.get('/', async (req, res, next) => {
  try {
    const categories = await prisma.category.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: 'asc' },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });

    res.json({
      success: true,
      data: categories,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
```

---

## Services

**src/services/emailService.js:**
```javascript
const nodemailer = require('nodemailer');
const config = require('../config/config');

// Create transporter
const transporter = nodemailer.createTransporter({
  host: config.email.host,
  port: config.email.port,
  secure: false,
  auth: {
    user: config.email.user,
    pass: config.email.password,
  },
});

// Send order confirmation email
exports.sendOrderConfirmation = async (order, user) => {
  try {
    const itemsList = order.items
      .map(item => `- ${item.productName} (${item.variantWeight}) x ${item.quantity} = ₹${item.subtotal}`)
      .join('\n');

    const mailOptions = {
      from: config.email.from,
      to: user.email,
      subject: `Order Confirmation - ${order.orderNumber}`,
      html: `
        <h1>Order Confirmed!</h1>
        <p>Dear ${user.name},</p>
        <p>Thank you for your order with Shree's Namkeen!</p>
        
        <h2>Order Details</h2>
        <p><strong>Order Number:</strong> ${order.orderNumber}</p>
        <p><strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
        
        <h3>Items:</h3>
        <pre>${itemsList}</pre>
        
        <h3>Summary:</h3>
        <p>Subtotal: ₹${order.subtotal}</p>
        <p>Shipping: ₹${order.shippingCost}</p>
        <p><strong>Total: ₹${order.totalAmount}</strong></p>
        
        <p>Estimated Delivery: ${new Date(order.estimatedDelivery).toLocaleDateString()}</p>
        
        <p>Track your order: <a href="${process.env.FRONTEND_URL}/track/${order.orderNumber}">Click here</a></p>
        
        <p>Thank you for shopping with us!</p>
        <p>- Shree's Namkeen Team</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log('✅ Order confirmation email sent');
  } catch (error) {
    console.error('❌ Email send failed:', error);
  }
};
```

---

## Main Server File

**src/server.js:**
```javascript
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const config = require('./config/config');
const errorHandler = require('./middleware/errorHandler');

// Import routes
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const categoryRoutes = require('./routes/categories');
const orderRoutes = require('./routes/orders');
const paymentRoutes = require('./routes/payments');

// Create Express app
const app = express();

// Security middleware
app.use(helmet());
app.use(cors(config.cors));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});
app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Static files
app.use('/uploads', express.static('uploads'));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Error handler
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV}`);
  console.log(`🔗 API: http://localhost:${PORT}/api`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Rejection:', err);
  process.exit(1);
});
```

---

## Running the Backend

```bash
# 1. Setup database
npx prisma migrate dev --name init
npm run db:seed

# 2. Start development server
npm run dev

# 3. View database (optional)
npm run db:studio
```

---

## Testing the API

### Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "Test User",
    "phone": "9876543210"
  }'
```

### Get Products
```bash
curl http://localhost:5000/api/products
```

### Create Order
```bash
curl -X POST http://localhost:5000/api/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "items": [
      {
        "productId": 1,
        "variantId": 1,
        "productName": "Ratlami Sev",
        "weight": "250g",
        "price": 95,
        "quantity": 2
      }
    ],
    "shippingAddress": {
      "fullName": "Test User",
      "phone": "9876543210",
      "addressLine1": "123 Test St",
      "city": "Mumbai",
      "state": "Maharashtra",
      "pincode": "400001"
    },
    "paymentMethod": "COD"
  }'
```

---

## Phase 3 Complete! ✅

Your backend is now ready with:
- ✅ User authentication
- ✅ Product management
- ✅ Order processing
- ✅ Payment integration (Razorpay)
- ✅ Email notifications
- ✅ Admin capabilities
- ✅ Database with Prisma ORM

**Next:** Phase 4 - Integration & Testing
