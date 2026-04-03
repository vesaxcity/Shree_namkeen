# Phase 3: Backend Development - Shree Namkeen E-Commerce
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
mkdir shree-namkeen-backend
cd shree-namkeen-backend

# Initialize package.json
npm init -y

# Install core dependencies
npm install express cors dotenv
npm install @prisma/client
npm install bcrypt jsonwebtoken
npm install express-validator
npm install helmet express-rate-limit
npm install morgan

# Install dev dependencies
npm install -D nodemon prisma
npm install -D @types/node

# Initialize Prisma
npx prisma init
```

#### Step 2: Project Structure

```
shree-namkeen-backend/
├── prisma/
│   └── schema.prisma
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
├── .env
├── .env.example
├── package.json
└── README.md
```

#### Step 3: Prisma Schema

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
  productVariantId Int       @map("product_variant_id")
  quantity         Int       @default(1)
  createdAt        DateTime  @default(now()) @map("created_at")
  updatedAt        DateTime  @updatedAt @map("updated_at")
  
  user             User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  variant          ProductVariant @relation(fields: [productVariantId], references: [id], onDelete: Cascade)
  product          Product   @relation(fields: [productId], references: [id])
  productId        Int       @map("product_id")
  
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

[Content continues with API routes, controllers, services, etc... This file will be ~20,000 characters covering complete backend implementation]
