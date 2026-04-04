# Phase 3: Backend Development - Shree's Namkeen E-Commerce
## Complete Node.js + Express + PostgreSQL Implementation

---

## 📋 Phase 3 Overview

**Duration:** 2-3 Weeks  
**Goal:** Build complete RESTful API with authentication, payments, and notifications  
**Deliverable:** Production-ready backend with database, ready to connect to frontend

---

## Week 4: Backend Foundation

### Day 1-2: Project Setup

#### Step 1: Initialize Backend Project

```bash
# Create backend directory
mkdir shrees-namkeen-backend
cd shrees-namkeen-backend

# Initialize package.json
npm init -y

# Install core dependencies
npm install express cors dotenv
npm install @prisma/client
npm install bcrypt jsonwebtoken
npm install express-validator
npm install helmet express-rate-limit
npm install morgan cookie-parser

# Install additional services
npm install nodemailer
npm install razorpay
npm install cloudinary
npm install multer

# Install dev dependencies
npm install -D nodemon prisma

# Initialize Prisma
npx prisma init
```

#### Step 2: Project Structure

```
shrees-namkeen-backend/
├── prisma/
│   ├── schema.prisma
│   └── seed.js
├── src/
│   ├── config/
│   │   ├── database.js
│   │   ├── cloudinary.js
│   │   ├── razorpay.js
│   │   └── config.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── productController.js
│   │   ├── categoryController.js
│   │   ├── orderController.js
│   │   ├── reviewController.js
│   │   ├── paymentController.js
│   │   ├── addressController.js
│   │   └── userController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── admin.js
│   │   ├── errorHandler.js
│   │   ├── validator.js
│   │   └── upload.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── products.js
│   │   ├── categories.js
│   │   ├── orders.js
│   │   ├── reviews.js
│   │   ├── payments.js
│   │   ├── addresses.js
│   │   └── users.js
│   ├── services/
│   │   ├── emailService.js
│   │   ├── whatsappService.js
│   │   └── notificationService.js
│   ├── utils/
│   │   ├── validators.js
│   │   ├── helpers.js
│   │   └── constants.js
│   └── server.js
├── uploads/
├── .env
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

#### Step 3: Environment Configuration

**.env.example:**
```env
# Server
NODE_ENV=development
PORT=5000

# Database
DATABASE_URL="postgresql://user:password@localhost:5432/shrees_namkeen?schema=public"

# JWT
JWT_SECRET=your_super_secret_jwt_key_here_minimum_32_characters
JWT_EXPIRES_IN=7d
REFRESH_TOKEN_SECRET=your_refresh_token_secret_here
REFRESH_TOKEN_EXPIRES_IN=30d

# CORS
CORS_ORIGIN=http://localhost:3000

# Razorpay
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_razorpay_secret_here

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email (using Gmail)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_specific_password
EMAIL_FROM="Shree's Namkeen <noreply@shreesnamkeen.com>"

# WhatsApp (Optional - Twilio)
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_WHATSAPP_NUMBER=+14155238886

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

**.gitignore:**
```
node_modules/
.env
uploads/*
!uploads/.gitkeep
*.log
.DS_Store
```

#### Step 4: Prisma Schema (Complete)

**prisma/schema.prisma:**
```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id            Int       @id @default(autoincrement())
  email         String    @unique
  passwordHash  String    @map("password_hash")
  name          String
  phone         String
  role          String    @default("customer")
  isVerified    Boolean   @default(false) @map("is_verified")
  createdAt     DateTime  @default(now()) @map("created_at")
  updatedAt     DateTime  @updatedAt @map("updated_at")
  
  addresses     Address[]
  orders        Order[]
  reviews       Review[]
  cartItems     CartItem[]
  wishlist      Wishlist[]
  notifications Notification[]
  
  @@map("users")
}

model Category {
  id           Int       @id @default(autoincrement())
  name         String
  slug         String    @unique
  description  String?
  icon         String?
  displayOrder Int       @default(0) @map("display_order")
  isActive     Boolean   @default(true) @map("is_active")
  createdAt    DateTime  @default(now()) @map("created_at")
  
  products     Product[]
  
  @@map("categories")
}

model Product {
  id              Int       @id @default(autoincrement())
  name            String
  slug            String    @unique
  description     String?
  categoryId      Int       @map("category_id")
  basePrice       Decimal   @map("base_price") @db.Decimal(10, 2)
  imageUrl        String?   @map("image_url")
  additionalImages String[] @map("additional_images")
  isActive        Boolean   @default(true) @map("is_active")
  isFeatured      Boolean   @default(false) @map("is_featured")
  isBestseller    Boolean   @default(false) @map("is_bestseller")
  rating          Decimal   @default(0) @db.Decimal(3, 2)
  reviewCount     Int       @default(0) @map("review_count")
  totalSold       Int       @default(0) @map("total_sold")
  ingredients     String?
  shelfLife       String?   @map("shelf_life")
  metaTitle       String?   @map("meta_title")
  metaDescription String?   @map("meta_description")
  createdAt       DateTime  @default(now()) @map("created_at")
  updatedAt       DateTime  @updatedAt @map("updated_at")
  
  category        Category  @relation(fields: [categoryId], references: [id])
  variants        ProductVariant[]
  reviews         Review[]
  orderItems      OrderItem[]
  cartItems       CartItem[]
  wishlist        Wishlist[]
  
  @@map("products")
}

model ProductVariant {
  id               Int       @id @default(autoincrement())
  productId        Int       @map("product_id")
  weight           String
  price            Decimal   @db.Decimal(10, 2)
  compareAtPrice   Decimal?  @map("compare_at_price") @db.Decimal(10, 2)
  sku              String?   @unique
  stockQuantity    Int       @default(0) @map("stock_quantity")
  lowStockThreshold Int      @default(10) @map("low_stock_threshold")
  isAvailable      Boolean   @default(true) @map("is_available")
  createdAt        DateTime  @default(now()) @map("created_at")
  
  product          Product   @relation(fields: [productId], references: [id], onDelete: Cascade)
  orderItems       OrderItem[]
  cartItems        CartItem[]
  
  @@map("product_variants")
}

model Address {
  id           Int       @id @default(autoincrement())
  userId       Int       @map("user_id")
  fullName     String    @map("full_name")
  phone        String
  addressLine1 String    @map("address_line1")
  addressLine2 String?   @map("address_line2")
  city         String
  state        String
  pincode      String
  landmark     String?
  addressType  String    @default("home") @map("address_type")
  isDefault    Boolean   @default(false) @map("is_default")
  createdAt    DateTime  @default(now()) @map("created_at")
  
  user         User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  orders       Order[]
  
  @@map("addresses")
}

model Order {
  id                      Int       @id @default(autoincrement())
  orderNumber             String    @unique @map("order_number")
  userId                  Int?      @map("user_id")
  
  customerName            String    @map("customer_name")
  customerEmail           String    @map("customer_email")
  customerPhone           String    @map("customer_phone")
  
  shippingAddressId       Int?      @map("shipping_address_id")
  shippingAddressSnapshot Json?     @map("shipping_address_snapshot")
  
  subtotal                Decimal   @db.Decimal(10, 2)
  shippingCost            Decimal   @default(0) @map("shipping_cost") @db.Decimal(10, 2)
  discountAmount          Decimal   @default(0) @map("discount_amount") @db.Decimal(10, 2)
  totalAmount             Decimal   @map("total_amount") @db.Decimal(10, 2)
  
  paymentMethod           String    @map("payment_method")
  paymentStatus           String    @default("pending") @map("payment_status")
  paymentId               String?   @map("payment_id")
  razorpayOrderId         String?   @map("razorpay_order_id")
  razorpaySignature       String?   @map("razorpay_signature")
  
  status                  String    @default("pending")
  
  trackingNumber          String?   @map("tracking_number")
  courierName             String?   @map("courier_name")
  estimatedDelivery       DateTime? @map("estimated_delivery")
  
  confirmedAt             DateTime? @map("confirmed_at")
  shippedAt               DateTime? @map("shipped_at")
  deliveredAt             DateTime? @map("delivered_at")
  cancelledAt             DateTime? @map("cancelled_at")
  cancellationReason      String?   @map("cancellation_reason")
  
  customerNotes           String?   @map("customer_notes")
  adminNotes              String?   @map("admin_notes")
  
  createdAt               DateTime  @default(now()) @map("created_at")
  updatedAt               DateTime  @updatedAt @map("updated_at")
  
  user                    User?     @relation(fields: [userId], references: [id])
  shippingAddress         Address?  @relation(fields: [shippingAddressId], references: [id])
  items                   OrderItem[]
  statusHistory           OrderStatusHistory[]
  
  @@map("orders")
}

model OrderItem {
  id                Int       @id @default(autoincrement())
  orderId           Int       @map("order_id")
  productId         Int?      @map("product_id")
  productVariantId  Int?      @map("product_variant_id")
  
  productName       String    @map("product_name")
  variantWeight     String    @map("variant_weight")
  priceAtPurchase   Decimal   @map("price_at_purchase") @db.Decimal(10, 2)
  quantity          Int
  subtotal          Decimal   @db.Decimal(10, 2)
  
  createdAt         DateTime  @default(now()) @map("created_at")
  
  order             Order     @relation(fields: [orderId], references: [id], onDelete: Cascade)
  product           Product?  @relation(fields: [productId], references: [id])
  variant           ProductVariant? @relation(fields: [productVariantId], references: [id])
  
  @@map("order_items")
}

model Review {
  id                 Int       @id @default(autoincrement())
  productId          Int       @map("product_id")
  userId             Int       @map("user_id")
  orderId            Int?      @map("order_id")
  
  rating             Int
  title              String?
  comment            String?
  isVerifiedPurchase Boolean   @default(false) @map("is_verified_purchase")
  isApproved         Boolean   @default(false) @map("is_approved")
  helpfulCount       Int       @default(0) @map("helpful_count")
  
  createdAt          DateTime  @default(now()) @map("created_at")
  updatedAt          DateTime  @updatedAt @map("updated_at")
  
  product            Product   @relation(fields: [productId], references: [id], onDelete: Cascade)
  user               User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@unique([productId, userId, orderId])
  @@map("reviews")
}

model CartItem {
  id               Int       @id @default(autoincrement())
  userId           Int       @map("user_id")
  productId        Int       @map("product_id")
  productVariantId Int       @map("product_variant_id")
  quantity         Int       @default(1)
  createdAt        DateTime  @default(now()) @map("created_at")
  updatedAt        DateTime  @updatedAt @map("updated_at")
  
  user             User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  product          Product   @relation(fields: [productId], references: [id])
  variant          ProductVariant @relation(fields: [productVariantId], references: [id], onDelete: Cascade)
  
  @@unique([userId, productVariantId])
  @@map("cart_items")
}

model Wishlist {
  id        Int       @id @default(autoincrement())
  userId    Int       @map("user_id")
  productId Int       @map("product_id")
  createdAt DateTime  @default(now()) @map("created_at")
  
  user      User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  product   Product   @relation(fields: [productId], references: [id], onDelete: Cascade)
  
  @@unique([userId, productId])
  @@map("wishlist")
}

model OrderStatusHistory {
  id        Int       @id @default(autoincrement())
  orderId   Int       @map("order_id")
  status    String
  notes     String?
  createdBy Int?      @map("created_by")
  createdAt DateTime  @default(now()) @map("created_at")
  
  order     Order     @relation(fields: [orderId], references: [id], onDelete: Cascade)
  
  @@map("order_status_history")
}

model Notification {
  id        Int       @id @default(autoincrement())
  userId    Int       @map("user_id")
  type      String
  title     String
  message   String
  isRead    Boolean   @default(false) @map("is_read")
  link      String?
  createdAt DateTime  @default(now()) @map("created_at")
  
  user      User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@map("notifications")
}
```

#### Step 5: Database Seed File

**prisma/seed.js:**
```javascript
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@shreesnamkeen.com' },
    update: {},
    create: {
      email: 'admin@shreesnamkeen.com',
      passwordHash: adminPassword,
      name: 'Admin User',
      phone: '9876543210',
      role: 'admin',
      isVerified: true,
    },
  });
  console.log('✅ Admin user created:', admin.email);

  // Create categories
  const categories = [
    { 
      name: 'Sev Varieties', 
      slug: 'sev-varieties', 
      icon: '🌾', 
      displayOrder: 1,
      description: 'Traditional and spicy sev varieties'
    },
    { 
      name: 'Mixture & Namkeen', 
      slug: 'mixture-namkeen', 
      icon: '🥗', 
      displayOrder: 2,
      description: 'Delicious mixture and namkeen assortments'
    },
    { 
      name: 'Seasonal Specials', 
      slug: 'seasonal-specials', 
      icon: '⭐', 
      displayOrder: 3,
      description: 'Limited edition festive collections'
    },
  ];

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: category,
    });
  }
  console.log('✅ Categories created');

  // Get category IDs
  const sevCategory = await prisma.category.findUnique({ where: { slug: 'sev-varieties' } });
  const mixtureCategory = await prisma.category.findUnique({ where: { slug: 'mixture-namkeen' } });
  const seasonalCategory = await prisma.category.findUnique({ where: { slug: 'seasonal-specials' } });

  // Create sample products
  const products = [
    {
      name: 'Ratlami Sev',
      slug: 'ratlami-sev',
      description: 'Authentic spicy sev with traditional Ratlami flavors, made fresh daily',
      categoryId: sevCategory.id,
      basePrice: 95,
      imageUrl: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg',
      isBestseller: true,
      rating: 4.8,
      reviewCount: 124,
      ingredients: 'Gram flour, Edible oil, Spices',
      shelfLife: '60 days',
      variants: {
        create: [
          { weight: '250g', price: 95, compareAtPrice: 120, stockQuantity: 50, sku: 'RS-250' },
          { weight: '500g', price: 190, compareAtPrice: 240, stockQuantity: 30, sku: 'RS-500' },
          { weight: '1kg', price: 370, compareAtPrice: 470, stockQuantity: 20, sku: 'RS-1KG' },
        ]
      }
    },
    {
      name: 'Khatta Meetha',
      slug: 'khatta-meetha',
      description: 'Perfect balance of sweet and tangy flavors in every bite',
      categoryId: mixtureCategory.id,
      basePrice: 110,
      imageUrl: 'https://images.pexels.com/photos/1893556/pexels-photo-1893556.jpeg',
      isBestseller: true,
      rating: 4.9,
      reviewCount: 156,
      ingredients: 'Mixed lentils, Sugar, Spices, Raisins',
      shelfLife: '90 days',
      variants: {
        create: [
          { weight: '250g', price: 110, compareAtPrice: 140, stockQuantity: 40, sku: 'KM-250' },
          { weight: '500g', price: 220, compareAtPrice: 280, stockQuantity: 28, sku: 'KM-500' },
          { weight: '1kg', price: 425, compareAtPrice: 550, stockQuantity: 18, sku: 'KM-1KG' },
        ]
      }
    },
    {
      name: 'Festival Special Box',
      slug: 'festival-special-box',
      description: 'Limited edition festive assortment perfect for celebrations',
      categoryId: seasonalCategory.id,
      basePrice: 135,
      imageUrl: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg',
      isBestseller: true,
      isFeatured: true,
      rating: 4.9,
      reviewCount: 134,
      ingredients: 'Assorted namkeen varieties',
      shelfLife: '60 days',
      variants: {
        create: [
          { weight: '500g', price: 135, compareAtPrice: 160, stockQuantity: 25, sku: 'FSB-500' },
          { weight: '1kg', price: 265, compareAtPrice: 320, stockQuantity: 15, sku: 'FSB-1KG' },
        ]
      }
    },
  ];

  for (const productData of products) {
    await prisma.product.upsert({
      where: { slug: productData.slug },
      update: {},
      create: productData,
    });
  }
  console.log('✅ Sample products created');

  console.log('🎉 Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

**Update package.json:**
```json
{
  "name": "shrees-namkeen-backend",
  "version": "1.0.0",
  "description": "Backend API for Shree's Namkeen E-Commerce",
  "main": "src/server.js",
  "scripts": {
    "start": "node src/server.js",
    "dev": "nodemon src/server.js",
    "db:migrate": "prisma migrate dev",
    "db:seed": "node prisma/seed.js",
    "db:reset": "prisma migrate reset && npm run db:seed",
    "db:studio": "prisma studio"
  },
  "keywords": ["ecommerce", "namkeen", "api"],
  "author": "",
  "license": "MIT"
}
```

---

## Week 4-5: Core Implementation

### Configuration Files

**src/config/database.js:**
```javascript
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

// Test connection
prisma.$connect()
  .then(() => console.log('✅ Database connected'))
  .catch((err) => console.error('❌ Database connection failed:', err));

module.exports = prisma;
```

**src/config/cloudinary.js:**
```javascript
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

module.exports = cloudinary;
```

**src/config/razorpay.js:**
```javascript
const Razorpay = require('razorpay');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

module.exports = razorpay;
```

**src/config/config.js:**
```javascript
module.exports = {
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    refreshSecret: process.env.REFRESH_TOKEN_SECRET,
    refreshExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '30d',
  },
  email: {
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    user: process.env.EMAIL_USER,
    password: process.env.EMAIL_PASSWORD,
    from: process.env.EMAIL_FROM,
  },
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
  },
  upload: {
    maxFileSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
  },
};
```

### Middleware

**src/middleware/auth.js:**
```javascript
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const prisma = require('../config/database');

exports.protect = async (req, res, next) => {
  try {
    let token;

    // Check for token in header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route',
      });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, config.jwt.secret);

      // Get user from database
      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
        },
      });

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'User not found',
        });
      }

      req.user = user;
      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Token is invalid or expired',
      });
    }
  } catch (error) {
    next(error);
  }
};

// Optional authentication (doesn't fail if no token)
exports.optionalAuth = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (token) {
      try {
        const decoded = jwt.verify(token, config.jwt.secret);
        const user = await prisma.user.findUnique({
          where: { id: decoded.id },
          select: { id: true, email: true, name: true, role: true },
        });
        req.user = user;
      } catch (error) {
        // Token invalid, but continue anyway
      }
    }

    next();
  } catch (error) {
    next(error);
  }
};
```

**src/middleware/admin.js:**
```javascript
exports.requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required',
    });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Admin access required',
    });
  }

  next();
};
```

**src/middleware/errorHandler.js:**
```javascript
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Prisma errors
  if (err.code === 'P2002') {
    return res.status(400).json({
      success: false,
      message: 'Duplicate entry. This record already exists.',
    });
  }

  if (err.code === 'P2025') {
    return res.status(404).json({
      success: false,
      message: 'Record not found',
    });
  }

  // Validation errors
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: err.errors,
    });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Invalid token',
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Token expired',
    });
  }

  // Default error
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

module.exports = errorHandler;
```

**src/middleware/upload.js:**
```javascript
const multer = require('multer');
const path = require('path');
const config = require('../config/config');

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.original name));
  },
});

// File filter
const fileFilter = (req, file, cb) => {
  if (config.upload.allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, and WebP are allowed.'), false);
  }
};

// Create multer instance
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: config.upload.maxFileSize,
  },
});

module.exports = upload;
```

### Utilities

**src/utils/helpers.js:**
```javascript
const jwt = require('jsonwebtoken');
const config = require('../config/config');

exports.generateToken = (userId) => {
  return jwt.sign({ id: userId }, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
  });
};

exports.generateRefreshToken = (userId) => {
  return jwt.sign({ id: userId }, config.jwt.refreshSecret, {
    expiresIn: config.jwt.refreshExpiresIn,
  });
};

exports.generateOrderNumber = () => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000);
  return `ORD-${timestamp}-${random}`;
};

exports.slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
};

exports.calculateShipping = (subtotal) => {
  return subtotal >= 999 ? 0 : 50;
};

exports.estimateDelivery = (days = 5) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
};
```

**src/utils/constants.js:**
```javascript
module.exports = {
  ORDER_STATUS: {
    PENDING: 'pending',
    CONFIRMED: 'confirmed',
    PROCESSING: 'processing',
    SHIPPED: 'shipped',
    DELIVERED: 'delivered',
    CANCELLED: 'cancelled',
  },
  PAYMENT_STATUS: {
    PENDING: 'pending',
    PAID: 'paid',
    FAILED: 'failed',
    REFUNDED: 'refunded',
  },
  PAYMENT_METHOD: {
    UPI: 'UPI',
    CARD: 'Card',
    NET_BANKING: 'Net Banking',
    COD: 'COD',
  },
  USER_ROLE: {
    CUSTOMER: 'customer',
    ADMIN: 'admin',
  },
};
```

[Continuing in next message due to length...]
