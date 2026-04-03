# Phase 1: Planning & Design - Shree Namkeen E-Commerce
## Complete Strategy Document

---

## 📊 Project Overview

**Business Name:** Shree Namkeen  
**Type:** Regional Snacks & Savouries E-Commerce  
**Timeline:** 6-8 weeks to launch  
**Budget:** ₹0-2,000/month (utilizing free tiers)  
**Development Approach:** AI-assisted full-stack development  

---

## 🎯 Project Goals & Scope

### Primary Goals
1. Full e-commerce website with online payments
2. Automated order management system
3. Progressive Web App (PWA) - installable on mobile
4. Regional delivery (within state)
5. Support 50+ products across 3 categories

### Must-Have Features for Launch
- ✅ Product catalog with 50+ items
- ✅ Shopping cart & checkout
- ✅ UPI, COD, and Net Banking payments
- ✅ Order tracking system
- ✅ Email notifications
- ✅ WhatsApp order updates
- ✅ Customer reviews & ratings
- ✅ Admin panel for product/order management
- ✅ PWA functionality (installable app)

### Future Enhancements (Post-Launch)
- Loyalty program
- Subscription boxes
- Referral system
- Multi-language support
- Analytics dashboard

---

## 🛠️ Technology Stack (Free Tier Optimized)

### Frontend
```
Framework:        React 18 + Vite
Styling:          Tailwind CSS
State Management: React Context + React Query
Routing:          React Router v6
PWA:              Vite PWA Plugin
Icons:            Lucide React
Notifications:    React Hot Toast
Forms:            React Hook Form
```

### Backend
```
Runtime:          Node.js 18+
Framework:        Express.js
Database:         PostgreSQL 15
ORM:              Prisma (modern, type-safe)
Authentication:   JWT + bcrypt
File Upload:      Multer + Cloudinary (free tier)
Validation:       Zod
Email:            Resend (free tier - 3,000/month)
WhatsApp:         Twilio WhatsApp API (pay-per-use)
```

### Payment Integration
```
Primary:          Razorpay (2% transaction fee)
Methods:          UPI, Cards, Net Banking, COD
Test Mode:        Free sandbox environment
```

### Hosting & Deployment (₹0-500/month)
```
Frontend:         Vercel (Free tier - perfect for React)
Backend:          Railway.app (Free tier - $5 credit/month)
Database:         Railway PostgreSQL (Free tier)
Images:           Cloudinary (Free tier - 25GB storage, 25GB bandwidth)
Domain:           Namecheap/GoDaddy (~₹100-150/month for .com)
SSL:              Free (Auto-configured by Vercel/Railway)
```

**Total Monthly Cost Breakdown:**
- Domain: ₹100-150
- Railway (if exceeding free tier): ₹0-300
- Razorpay: 2% per transaction
- **Estimated Total: ₹100-500/month initially**

### Development Tools (All Free)
```
Code Editor:      VS Code
Version Control:  Git + GitHub
API Testing:      Thunder Client (VS Code) / Postman
Database GUI:     TablePlus / pgAdmin
Design:           Figma (free tier)
AI Assistant:     Claude.ai, ChatGPT (for coding help)
```

---

## 📁 Database Schema Design

### Core Tables

```sql
-- Users Table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    role VARCHAR(20) DEFAULT 'customer', -- customer, admin
    is_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Categories Table
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    icon VARCHAR(10), -- emoji
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products Table
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
    base_price DECIMAL(10, 2) NOT NULL,
    image_url VARCHAR(500),
    additional_images TEXT[], -- Array of image URLs
    is_active BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    is_bestseller BOOLEAN DEFAULT false,
    rating DECIMAL(3, 2) DEFAULT 0,
    review_count INTEGER DEFAULT 0,
    total_sold INTEGER DEFAULT 0,
    meta_title VARCHAR(255),
    meta_description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Product Variants (Different weights/sizes)
CREATE TABLE product_variants (
    id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
    weight VARCHAR(50) NOT NULL, -- 250g, 500g, 1kg
    price DECIMAL(10, 2) NOT NULL,
    compare_at_price DECIMAL(10, 2), -- Original price for discount display
    sku VARCHAR(100) UNIQUE,
    stock_quantity INTEGER DEFAULT 0,
    low_stock_threshold INTEGER DEFAULT 10,
    is_available BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Addresses Table
CREATE TABLE addresses (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    address_line1 VARCHAR(500) NOT NULL,
    address_line2 VARCHAR(500),
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    pincode VARCHAR(10) NOT NULL,
    landmark VARCHAR(255),
    address_type VARCHAR(20) DEFAULT 'home', -- home, work, other
    is_default BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Orders Table
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    order_number VARCHAR(50) UNIQUE NOT NULL, -- ORD-2024-001
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    
    -- Contact Info (saved at order time)
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(20) NOT NULL,
    
    -- Shipping Info
    shipping_address_id INTEGER REFERENCES addresses(id) ON DELETE SET NULL,
    shipping_address_snapshot JSONB, -- Save full address at order time
    
    -- Pricing
    subtotal DECIMAL(10, 2) NOT NULL,
    shipping_cost DECIMAL(10, 2) DEFAULT 0,
    discount_amount DECIMAL(10, 2) DEFAULT 0,
    total_amount DECIMAL(10, 2) NOT NULL,
    
    -- Payment
    payment_method VARCHAR(50) NOT NULL, -- UPI, COD, Net Banking
    payment_status VARCHAR(50) DEFAULT 'pending', -- pending, paid, failed, refunded
    payment_id VARCHAR(255), -- Razorpay payment ID
    razorpay_order_id VARCHAR(255),
    razorpay_signature VARCHAR(255),
    
    -- Order Status
    status VARCHAR(50) DEFAULT 'pending', -- pending, confirmed, processing, shipped, delivered, cancelled
    
    -- Tracking
    tracking_number VARCHAR(100),
    courier_name VARCHAR(100),
    estimated_delivery DATE,
    
    -- Timestamps for status changes
    confirmed_at TIMESTAMP,
    shipped_at TIMESTAMP,
    delivered_at TIMESTAMP,
    cancelled_at TIMESTAMP,
    cancellation_reason TEXT,
    
    -- Notes
    customer_notes TEXT,
    admin_notes TEXT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Order Items Table
CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES products(id) ON DELETE SET NULL,
    product_variant_id INTEGER REFERENCES product_variants(id) ON DELETE SET NULL,
    
    -- Snapshot data (saved at order time)
    product_name VARCHAR(255) NOT NULL,
    variant_weight VARCHAR(50) NOT NULL,
    price_at_purchase DECIMAL(10, 2) NOT NULL,
    quantity INTEGER NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Reviews & Ratings Table
CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    order_id INTEGER REFERENCES orders(id) ON DELETE SET NULL,
    
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(255),
    comment TEXT,
    is_verified_purchase BOOLEAN DEFAULT false,
    is_approved BOOLEAN DEFAULT false,
    
    helpful_count INTEGER DEFAULT 0,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(product_id, user_id, order_id) -- One review per product per order
);

-- Cart Table (Optional - can use localStorage)
CREATE TABLE cart_items (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    product_variant_id INTEGER REFERENCES product_variants(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(user_id, product_variant_id)
);

-- Coupons/Discount Codes (Future enhancement)
CREATE TABLE coupons (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    discount_type VARCHAR(20) NOT NULL, -- percentage, fixed
    discount_value DECIMAL(10, 2) NOT NULL,
    min_order_value DECIMAL(10, 2),
    max_discount_amount DECIMAL(10, 2),
    usage_limit INTEGER,
    used_count INTEGER DEFAULT 0,
    valid_from TIMESTAMP,
    valid_until TIMESTAMP,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Order Status History (For tracking)
CREATE TABLE order_status_history (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
    status VARCHAR(50) NOT NULL,
    notes TEXT,
    created_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Wishlist Table
CREATE TABLE wishlist (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(user_id, product_id)
);

-- Notifications Table
CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL, -- order_confirmed, order_shipped, etc.
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    link VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_active ON products(is_active);
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created ON orders(created_at DESC);
CREATE INDEX idx_reviews_product ON reviews(product_id);
CREATE INDEX idx_reviews_approved ON reviews(is_approved);
```

---

## 📋 Product Catalog Structure (50+ Products)

### Category 1: Sev Varieties (15-18 products)
```
1. Ratlami Sev (Regular) - 250g, 500g, 1kg
2. Ratlami Sev (Extra Spicy) - 250g, 500g, 1kg
3. Aloo Bhujia - 250g, 500g, 1kg
4. Palak Sev - 250g, 500g
5. Laung Sev - 250g, 500g, 1kg
6. Ujjaini Sev - 250g, 500g, 1kg
7. Poha Sev - 250g, 500g
8. Nylon Sev - 250g, 500g
9. Thick Sev - 250g, 500g, 1kg
10. Masala Sev - 250g, 500g
11. Hing Sev - 250g, 500g
12. Besan Sev - 250g, 500g, 1kg
```

### Category 2: Mixture & Namkeen (20-25 products)
```
1. Khatta Meetha Mix - 250g, 500g, 1kg
2. Punjabi Tadka Mix - 250g, 500g, 1kg
3. Gujarati Mix - 250g, 500g
4. Navratan Mix - 250g, 500g, 1kg
5. Moong Dal - 250g, 500g, 1kg
6. Chana Dal - 250g, 500g, 1kg
7. Masala Peanuts - 250g, 500g, 1kg
8. Boondi (Salted) - 250g, 500g
9. Boondi (Masala) - 250g, 500g
10. Chakli (Original) - 200g, 400g
11. Chakli (Spicy) - 200g, 400g
12. Mathri (Plain) - 250g, 500g
13. Mathri (Methi) - 250g, 500g
14. Gathiya - 250g, 500g
15. Sev Mamra - 250g, 500g
16. Roasted Chana - 250g, 500g, 1kg
17. Kaju Mixture - 250g, 500g
18. Banana Chips (Salted) - 250g, 500g
19. Banana Chips (Spicy) - 250g, 500g
20. Aloo Chips - 250g, 500g
```

### Category 3: Seasonal Specials & Gift Hampers (15-20 products)
```
1. Diwali Special Box - Small (500g assorted)
2. Diwali Special Box - Medium (1kg assorted)
3. Diwali Special Box - Large (2kg assorted)
4. Diwali Premium Hamper (3kg + sweets)
5. Festival Combo Pack A - 1.5kg (Sev varieties)
6. Festival Combo Pack B - 1.5kg (Mixture varieties)
7. Wedding Gift Box - 2kg
8. Corporate Gift Hamper - 3kg
9. Holi Special Mix - 500g, 1kg
10. Rakhi Special Box - 1kg
11. New Year Celebration Pack - 2kg
12. Birthday Party Pack - 1.5kg
13. Family Pack Combo - 2.5kg
14. Budget Friendly Box - 500g
15. Premium Tasting Box - 800g (all bestsellers)
```

---

## 🎨 Brand Identity Design

Since you need complete brand identity, here's what we'll create:

### Color Palette
**Primary Colors:**
- **Orange/Saffron**: `#FF6B35` - Energy, tradition, appetite
- **Deep Red**: `#C1121F` - Passion, spice, excitement
- **Warm Yellow**: `#FFC857` - Joy, freshness, warmth

**Secondary Colors:**
- **Cream/Beige**: `#FFF8F0` - Natural, wholesome
- **Dark Brown**: `#3E2723` - Earthiness, authenticity
- **Sage Green**: `#95B46A` - Fresh, healthy

**Accent Colors:**
- **Gold**: `#FFD700` - Premium, celebration
- **Burnt Orange**: `#D4691E` - Warmth, comfort

### Typography
**Primary Font (Headings):**
- Playfair Display (Elegant, traditional yet modern)
- Weights: Bold (700), Black (900)

**Secondary Font (Body):**
- Montserrat (Clean, readable)
- Weights: Regular (400), Semibold (600), Bold (700)

**Accent Font (Special elements):**
- Pacifico (Handwritten feel for special offers)

### Logo Concept
**Style:** Modern traditional fusion
**Elements:**
- Text: "SHREE NAMKEEN" in Playfair Display Bold
- Icon: Stylized wheat/grain or traditional Indian pattern
- Color: Orange gradient with yellow highlights
- Shape: Circular badge or rectangular with decorative borders

**Variations Needed:**
1. Full logo (horizontal)
2. Stacked logo (vertical)
3. Icon only (for favicon, app icon)
4. Monochrome version (for watermarks)

### Design System

**Spacing Scale:**
```
4px, 8px, 12px, 16px, 24px, 32px, 48px, 64px
```

**Border Radius:**
```
Small: 8px (buttons, inputs)
Medium: 16px (cards)
Large: 24px (containers)
Round: 999px (pills, badges)
```

**Shadows:**
```
Small: 0 2px 8px rgba(0,0,0,0.1)
Medium: 0 4px 16px rgba(0,0,0,0.15)
Large: 0 8px 32px rgba(0,0,0,0.2)
```

**Animation Timing:**
```
Fast: 150ms
Normal: 300ms
Slow: 500ms
Easing: cubic-bezier(0.4, 0, 0.2, 1)
```

---

## 🗺️ Site Map & Page Structure

### Customer-Facing Pages

**1. Home Page**
- Hero section with CTA
- Featured categories
- Bestsellers grid
- Seasonal specials banner
- Customer testimonials
- Why choose us (features)
- Newsletter signup
- Footer

**2. Products Page** (`/products`)
- Category filters (sidebar + mobile drawer)
- Search bar
- Sort options (price, popularity, newest)
- Product grid with cards
- Pagination
- Applied filters display
- Empty state for no results

**3. Product Detail Page** (`/products/:slug`)
- Image gallery with zoom
- Product name and rating
- Price and discount
- Weight/variant selector
- Quantity picker
- Add to cart / Buy now
- Product description
- Ingredients & nutritional info
- Reviews section
- Related products
- Breadcrumbs navigation

**4. Category Page** (`/category/:slug`)
- Same as products page but filtered by category
- Category banner image
- Category description

**5. Cart Page** (`/cart`)
- Cart items list with images
- Quantity adjustment
- Remove item option
- Subtotal calculation
- Shipping estimate
- Coupon code input
- Continue shopping link
- Proceed to checkout button
- Empty cart state

**6. Checkout Page** (`/checkout`)
- Multi-step process:
  - Step 1: Login/Guest checkout
  - Step 2: Shipping address
  - Step 3: Delivery method
  - Step 4: Payment method
  - Step 5: Review order
- Order summary sidebar
- Security badges
- Progress indicator

**7. Order Confirmation** (`/order/confirmation/:id`)
- Order number
- Thank you message
- Order details
- Estimated delivery
- Track order button
- Continue shopping link
- Share order option

**8. My Account** (`/account`)
- Dashboard
- My Orders (list + detail view)
- Saved Addresses
- Profile Settings
- Wishlist
- Notifications
- Logout

**9. Order Tracking** (`/track/:orderNumber`)
- Current status
- Status timeline
- Delivery person info (if available)
- Estimated delivery
- Support contact

**10. About Us** (`/about`)
- Brand story
- Our values
- Quality promise
- Team (optional)
- Awards/certifications

**11. Contact Us** (`/contact`)
- Contact form
- Phone, email, address
- WhatsApp link
- Map (optional)
- Business hours
- FAQ link

**12. FAQ** (`/faq`)
- Accordion-style Q&A
- Categories: Orders, Shipping, Returns, Payments

**13. Legal Pages**
- Terms & Conditions (`/terms`)
- Privacy Policy (`/privacy`)
- Shipping Policy (`/shipping-policy`)
- Return & Refund Policy (`/return-policy`)

### Admin Pages

**Admin Dashboard** (`/admin`)
- Sales overview
- Recent orders
- Low stock alerts
- Top products
- Quick actions

**Products Management** (`/admin/products`)
- Product list (table view)
- Add new product
- Edit product
- Bulk actions
- Import/Export CSV

**Orders Management** (`/admin/orders`)
- Order list (filterable)
- Order detail view
- Status update
- Print invoice
- Send notifications

**Customers** (`/admin/customers`)
- Customer list
- Customer details
- Order history

**Reviews** (`/admin/reviews`)
- Pending reviews
- Approve/Reject
- Reply to reviews

**Settings** (`/admin/settings`)
- General settings
- Shipping zones & rates
- Payment methods
- Email templates
- WhatsApp settings

---

## 🏗️ Project Structure

### Frontend Structure
```
shree-namkeen-frontend/
├── public/
│   ├── manifest.json
│   ├── robots.txt
│   └── icons/
│       ├── icon-192x192.png
│       └── icon-512x512.png
├── src/
│   ├── assets/
│   │   ├── images/
│   │   └── fonts/
│   ├── components/
│   │   ├── common/
│   │   │   ├── Header.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Button.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── LoadingSpinner.jsx
│   │   │   ├── ErrorBoundary.jsx
│   │   │   └── SEO.jsx
│   │   ├── home/
│   │   │   ├── Hero.jsx
│   │   │   ├── FeaturedCategories.jsx
│   │   │   ├── BestSellers.jsx
│   │   │   ├── Testimonials.jsx
│   │   │   └── Features.jsx
│   │   ├── products/
│   │   │   ├── ProductCard.jsx
│   │   │   ├── ProductGrid.jsx
│   │   │   ├── ProductFilters.jsx
│   │   │   ├── ProductSort.jsx
│   │   │   ├── ProductDetail.jsx
│   │   │   ├── ImageGallery.jsx
│   │   │   ├── VariantSelector.jsx
│   │   │   └── RelatedProducts.jsx
│   │   ├── cart/
│   │   │   ├── CartItem.jsx
│   │   │   ├── CartSidebar.jsx
│   │   │   ├── CartSummary.jsx
│   │   │   └── EmptyCart.jsx
│   │   ├── checkout/
│   │   │   ├── CheckoutSteps.jsx
│   │   │   ├── ShippingForm.jsx
│   │   │   ├── PaymentOptions.jsx
│   │   │   ├── OrderReview.jsx
│   │   │   └── OrderSummary.jsx
│   │   ├── account/
│   │   │   ├── AccountSidebar.jsx
│   │   │   ├── OrderList.jsx
│   │   │   ├── OrderDetail.jsx
│   │   │   ├── AddressList.jsx
│   │   │   ├── AddressForm.jsx
│   │   │   └── ProfileForm.jsx
│   │   ├── reviews/
│   │   │   ├── ReviewCard.jsx
│   │   │   ├── ReviewForm.jsx
│   │   │   └── ReviewList.jsx
│   │   └── admin/
│   │       ├── AdminSidebar.jsx
│   │       ├── Dashboard.jsx
│   │       ├── ProductForm.jsx
│   │       ├── OrderManagement.jsx
│   │       └── Settings.jsx
│   ├── pages/
│   │   ├── HomePage.jsx
│   │   ├── ProductsPage.jsx
│   │   ├── ProductDetailPage.jsx
│   │   ├── CategoryPage.jsx
│   │   ├── CartPage.jsx
│   │   ├── CheckoutPage.jsx
│   │   ├── OrderConfirmationPage.jsx
│   │   ├── OrderTrackingPage.jsx
│   │   ├── AccountPage.jsx
│   │   ├── LoginPage.jsx
│   │   ├── RegisterPage.jsx
│   │   ├── AboutPage.jsx
│   │   ├── ContactPage.jsx
│   │   ├── FAQPage.jsx
│   │   └── NotFoundPage.jsx
│   ├── context/
│   │   ├── AuthContext.jsx
│   │   ├── CartContext.jsx
│   │   └── NotificationContext.jsx
│   ├── hooks/
│   │   ├── useAuth.js
│   │   ├── useCart.js
│   │   ├── useProducts.js
│   │   ├── useOrders.js
│   │   └── useLocalStorage.js
│   ├── services/
│   │   ├── api.js
│   │   ├── authService.js
│   │   ├── productService.js
│   │   ├── orderService.js
│   │   ├── paymentService.js
│   │   └── reviewService.js
│   ├── utils/
│   │   ├── constants.js
│   │   ├── helpers.js
│   │   ├── validators.js
│   │   └── formatters.js
│   ├── styles/
│   │   └── globals.css
│   ├── App.jsx
│   ├── main.jsx
│   └── routes.jsx
├── .env.example
├── .env.local
├── package.json
├── vite.config.js
├── tailwind.config.js
└── README.md
```

### Backend Structure
```
shree-namkeen-backend/
├── src/
│   ├── config/
│   │   ├── database.js
│   │   ├── cloudinary.js
│   │   ├── razorpay.js
│   │   └── config.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── productController.js
│   │   ├── categoryController.js
│   │   ├── orderController.js
│   │   ├── reviewController.js
│   │   ├── paymentController.js
│   │   ├── addressController.js
│   │   └── adminController.js
│   ├── models/
│   │   └── (if using ORM like Prisma, schema.prisma)
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   ├── adminMiddleware.js
│   │   ├── errorHandler.js
│   │   ├── uploadMiddleware.js
│   │   └── validationMiddleware.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── userRoutes.js
│   │   ├── productRoutes.js
│   │   ├── categoryRoutes.js
│   │   ├── orderRoutes.js
│   │   ├── reviewRoutes.js
│   │   ├── paymentRoutes.js
│   │   ├── addressRoutes.js
│   │   └── adminRoutes.js
│   ├── services/
│   │   ├── emailService.js
│   │   ├── whatsappService.js
│   │   ├── smsService.js
│   │   └── notificationService.js
│   ├── utils/
│   │   ├── validators.js
│   │   ├── helpers.js
│   │   └── constants.js
│   ├── scripts/
│   │   ├── seed.js
│   │   └── migrate.js
│   └── server.js
├── uploads/
├── .env.example
├── .env
├── package.json
├── prisma/
│   └── schema.prisma
└── README.md
```

---

## 🔐 Security Considerations

### Authentication & Authorization
- JWT tokens with 24-hour expiry
- Refresh tokens for extended sessions
- Password hashing with bcrypt (12 rounds)
- Rate limiting on login attempts
- Email verification for new accounts
- Password reset via email

### Data Protection
- Input validation on all endpoints (Zod schema)
- SQL injection prevention (Prisma ORM)
- XSS protection (sanitize inputs)
- CORS configuration (whitelist frontend domain)
- HTTPS only in production
- Secure cookie flags

### Payment Security
- Never store card details (Razorpay handles it)
- Verify payment signatures
- Log all payment attempts
- Handle failed payments gracefully
- Refund process documentation

### API Security
- Rate limiting (express-rate-limit)
- Request size limits
- API key rotation strategy
- Error messages without sensitive info
- Logging and monitoring

---

## 📈 SEO Strategy

### On-Page SEO
- Unique title tags for each page
- Meta descriptions (150-160 characters)
- H1, H2, H3 hierarchy
- Image alt texts
- Schema markup (Product, Organization, BreadcrumbList)
- Canonical URLs
- Open Graph tags for social sharing
- XML sitemap
- Robots.txt

### Technical SEO
- Fast loading (< 3 seconds)
- Mobile-responsive
- PWA capabilities
- Clean URL structure (`/products/ratlami-sev` not `/product?id=123`)
- Internal linking
- 404 error handling
- SSL certificate

### Content SEO
- Product descriptions (unique, 150+ words)
- Blog section (future): recipes, festivals, snack pairings
- FAQ page
- About Us story

### Local SEO
- Google My Business listing
- Local schema markup
- Location-based keywords
- Customer reviews

---

## 📊 Analytics & Tracking

### Essential Metrics
- **Traffic:** Daily visitors, page views, bounce rate
- **Conversions:** Cart additions, checkout starts, orders completed
- **Products:** Most viewed, most added to cart, bestsellers
- **Revenue:** Daily/monthly sales, average order value
- **User Behavior:** Time on site, pages per session

### Tools to Implement
1. **Google Analytics 4** (Free)
   - E-commerce tracking
   - Conversion funnel
   - User demographics

2. **Google Search Console** (Free)
   - Search performance
   - Index coverage
   - Mobile usability

3. **Meta Pixel** (Facebook/Instagram ads - optional)
   - Retargeting
   - Custom audiences

4. **Custom Dashboard** (Admin panel)
   - Real-time sales
   - Low stock alerts
   - Recent orders

---

## 🎯 Performance Targets

### Load Time
- First Contentful Paint: < 1.5s
- Largest Contentful Paint: < 2.5s
- Time to Interactive: < 3.5s
- Overall load time: < 3s

### Optimization Strategies
- Image optimization (WebP format, lazy loading)
- Code splitting (React.lazy)
- CDN for static assets (Cloudinary)
- Minification (Vite handles automatically)
- Caching headers
- Database query optimization
- API response caching (Redis - future)

### Lighthouse Scores Target
- Performance: 90+
- Accessibility: 95+
- Best Practices: 95+
- SEO: 100

---

## 📱 PWA Features

### Installation
- Add to Home Screen prompt
- Custom app icon
- Splash screen
- Standalone mode (no browser UI)

### Offline Functionality
- Service Worker
- Cache product images
- Show offline page
- Queue orders when offline (sync when online)

### Push Notifications (Future)
- Order status updates
- New product alerts
- Special offers

### App-Like Experience
- Fast navigation
- Smooth animations
- Native-like interactions
- Bottom navigation (mobile)

---

## 🚀 Development Roadmap

### Week 1: Setup & Design
**Days 1-2:** Environment Setup
- Install Node.js, VS Code, Git
- Create GitHub repositories
- Setup Figma for design
- Create basic logo concept
- Define color palette & fonts

**Days 3-5:** Database & API Design
- Setup PostgreSQL locally
- Create database schema
- Design API endpoints (documentation)
- Setup Prisma ORM
- Test database connections

**Days 6-7:** Frontend Scaffolding
- Create React + Vite project
- Setup Tailwind CSS
- Create folder structure
- Setup routing
- Create reusable components (Button, Input, etc.)

### Week 2-3: Frontend Development
**Week 2 Focus:**
- Home page with hero
- Product listing page
- Product card component
- Category filtering
- Search functionality
- Product detail page
- Image gallery
- Cart sidebar

**Week 3 Focus:**
- Checkout flow (multi-step)
- User authentication (Login/Register)
- Account pages (Orders, Profile)
- Reviews section
- Responsive design polish
- PWA setup

### Week 4-5: Backend Development
**Week 4 Focus:**
- User authentication APIs
- Product APIs (CRUD)
- Category APIs
- Order APIs
- Payment integration (Razorpay)
- Email service setup

**Week 5 Focus:**
- Review APIs
- Admin APIs
- Image upload (Cloudinary)
- WhatsApp integration
- Order tracking
- Database seeding

### Week 6: Integration & Testing
- Connect frontend to backend
- Replace mock data with API calls
- Test all user flows
- Fix bugs
- Cross-browser testing
- Mobile testing
- Performance optimization

### Week 7: Admin Panel & Polish
- Admin dashboard
- Product management
- Order management
- Settings page
- Final UI polish
- SEO optimization
- Documentation

### Week 8: Deployment & Launch
- Setup Vercel (frontend)
- Setup Railway (backend)
- Configure domain
- SSL setup
- Test in production
- Create launch checklist
- Soft launch (limited users)
- Monitor & fix issues
- Full launch!

---

## 📝 Pre-Development Checklist

Before starting Week 1, ensure you have:

### Business Assets
- [ ] Final business name confirmation: "Shree Namkeen"
- [ ] Contact information (phone, email, address)
- [ ] Business registration documents (if needed for payment gateway)
- [ ] Bank account for payments
- [ ] GST number (if applicable)

### Content Preparation
- [ ] Product list (50+ items with names)
- [ ] Product images (or plan to use placeholder initially)
- [ ] Product descriptions
- [ ] Pricing information
- [ ] Weight/size variants
- [ ] About Us content
- [ ] Terms & Conditions
- [ ] Privacy Policy
- [ ] Shipping Policy
- [ ] Return Policy

### Technical Setup
- [ ] Buy domain name
- [ ] Create accounts:
  - [ ] GitHub
  - [ ] Vercel
  - [ ] Railway
  - [ ] Cloudinary
  - [ ] Razorpay
  - [ ] Resend (email)
  - [ ] Twilio (WhatsApp)
- [ ] Install software:
  - [ ] Node.js 18+
  - [ ] VS Code
  - [ ] Git
  - [ ] PostgreSQL (local)

### Design Preparation
- [ ] Logo design (can use AI tools initially)
- [ ] Color palette approval
- [ ] Font selection
- [ ] Basic wireframes/sketches

---

## 💡 Domain Name Recommendations

Since you need guidance on domain:

### Domain Name Ideas
1. **shreenamkeen.com** ⭐ (Best option - clear and brandable)
2. **shreenamkeens.com** (plural variation)
3. **shreesnacks.com**
4. **shreeoriginal.com**
5. **shreeflavors.com**
6. **namkeenshree.com**
7. **shreefresh.com**
8. **shreetraditional.com**
9. **shreekitchen.com**
10. **shreemunchies.com**

### Where to Buy (Ranked by recommendation)
1. **Namecheap** - ₹700-900/year, easy to use, good support
2. **GoDaddy** - ₹900-1200/year, widely known
3. **Google Domains** - ₹1000/year, clean interface (now Squarespace)
4. **Hostinger** - ₹600-800/year, budget-friendly

### Buying Process
1. Search for domain availability
2. Check all extensions (.com, .in, .co.in)
3. **.com is preferred** (international, trusted)
4. Buy for at least 1-2 years (slight discount)
5. Add privacy protection (usually included free)
6. Skip extra services (hosting, email) - we have free solutions

### Domain Cost Estimate
- .com domain: ₹700-1200/year
- .in domain: ₹400-700/year
- .co.in domain: ₹300-600/year

**Recommendation:** Get shreenamkeen.com if available (₹900/year from Namecheap)

---

## 💰 Detailed Cost Breakdown (First Year)

### One-Time Costs
| Item | Cost | Notes |
|------|------|-------|
| Domain (.com) | ₹900 | Annual |
| Logo Design | ₹0-2000 | Use AI tools (free) or Fiverr |
| **Total One-Time** | **₹900-2900** | |

### Monthly Recurring Costs
| Service | Free Tier | If Exceeding Free | Notes |
|---------|-----------|-------------------|-------|
| Vercel (Frontend) | ✅ Unlimited | ₹1500/month | Unlikely to need paid plan initially |
| Railway (Backend+DB) | $5 credit/month | ₹400-800/month | Monitor usage |
| Cloudinary (Images) | 25GB storage | ₹0 | Sufficient for 50+ products |
| Resend (Email) | 3000 emails/month | ₹400/month | Plenty for < 100 orders |
| Twilio WhatsApp | Pay per message | ₹0.50-1/msg | ~₹50-100/month |
| Razorpay | Transaction fee only | 2% per order | Revenue-based |
| **Total Monthly** | **₹50-200** | **₹2500-3500** | Start with free tiers |

### Annual Estimate
- **Year 1 (Free tier usage):** ₹1500-3500
- **Year 1 (Exceeding free tier):** ₹15,000-25,000
- **Most likely scenario:** ₹3000-8000 (domain + occasional paid overages)

---

## 🎨 Brand Assets to Create

### Logo Variations Needed
1. **Full Logo** (horizontal)
   - Size: 2400x800px
   - Format: PNG with transparency + SVG
   - Usage: Website header, email signatures

2. **Logo Icon** (square)
   - Size: 512x512px
   - Format: PNG + SVG
   - Usage: Favicon, app icon, social media profile

3. **Logo Stacked** (vertical)
   - Size: 800x1200px
   - Format: PNG + SVG
   - Usage: Mobile header, print materials

4. **Monochrome** (single color)
   - Color: Black and White versions
   - Usage: Watermarks, packaging stamps

### Product Images Requirements
- **Format:** JPG or WebP
- **Size:** 1200x1200px (square)
- **Background:** White or transparent
- **Angle:** Front view + optional side/top views
- **Quality:** High resolution but optimized (< 200KB per image)

### Banner Images
- **Home Hero:** 1920x800px
- **Category Banners:** 1920x400px
- **Promotional Banners:** 1200x600px

### Social Media Assets
- **Facebook Cover:** 820x312px
- **Instagram Posts:** 1080x1080px
- **Instagram Stories:** 1080x1920px

---

## 🎯 Success Metrics (6-Month Goals)

### Traffic Metrics
- Unique visitors: 500-1000/month
- Page views: 2000-5000/month
- Bounce rate: < 50%
- Average session: > 3 minutes

### Conversion Metrics
- Cart conversion: 15-25%
- Checkout completion: 60-75%
- Overall conversion: 2-5%

### Revenue Metrics
- Monthly orders: 50-100
- Average order value: ₹500-800
- Monthly revenue: ₹25,000-80,000
- Customer repeat rate: 20-30%

### Customer Satisfaction
- Product ratings: > 4.5/5
- Delivery time: 2-5 days
- Customer support response: < 24 hours
- Return rate: < 5%

---

## 📋 Next Steps - Action Items

### Immediate Actions (This Week)
1. **Domain Purchase**
   - Research and select domain name
   - Buy from Namecheap/GoDaddy
   - Configure DNS (will connect later)

2. **Account Creation**
   - GitHub account (for code hosting)
   - Vercel account (for frontend hosting)
   - Railway account (for backend)
   - Cloudinary account (for images)

3. **Logo Creation**
   - Use AI tools (Midjourney, DALL-E) to generate concepts
   - Or hire on Fiverr (₹500-2000)
   - Get 4 variations (full, icon, stacked, mono)

4. **Product Catalog**
   - Finalize product list (50+ items)
   - Collect/create basic product descriptions
   - Source or create placeholder images

5. **Local Development Setup**
   - Install Node.js (v18 or later)
   - Install VS Code
   - Install Git
   - Install PostgreSQL locally

### Week 1 Tasks
- Complete all "Immediate Actions"
- Setup development environment
- Create basic brand guidelines document
- Start database schema implementation
- Begin frontend scaffolding

---

## 📞 Support & Resources

### When You Get Stuck
1. **AI Assistants:** Claude, ChatGPT (for code help)
2. **Documentation:** Official docs for React, Express, PostgreSQL
3. **Community:** Stack Overflow, Reddit (r/reactjs, r/node)
4. **Video Tutorials:** YouTube channels (Traversy Media, Web Dev Simplified)

### Useful Links
- **React Docs:** https://react.dev
- **Tailwind CSS:** https://tailwindcss.com
- **Vite:** https://vitejs.dev
- **Express:** https://expressjs.com
- **Prisma:** https://www.prisma.io
- **Razorpay Docs:** https://razorpay.com/docs
- **Vercel:** https://vercel.com/docs
- **Railway:** https://docs.railway.app

---

## ✅ Phase 1 Completion Checklist

Mark these off as you complete them:

### Planning
- [ ] Project goals documented
- [ ] Tech stack finalized
- [ ] Database schema designed
- [ ] Site map created
- [ ] User flows mapped

### Design
- [ ] Brand colors selected
- [ ] Typography chosen
- [ ] Logo created (all 4 variations)
- [ ] Basic wireframes/mockups done

### Setup
- [ ] Domain purchased
- [ ] All accounts created
- [ ] Development environment ready
- [ ] GitHub repository created
- [ ] Initial project structure setup

### Content
- [ ] Product list finalized (50+ items)
- [ ] Product images collected/planned
- [ ] Legal pages drafted (Terms, Privacy, etc.)
- [ ] About Us content written

### Ready for Phase 2
- [ ] All Phase 1 items completed
- [ ] Confidence in technology choices
- [ ] Development roadmap reviewed
- [ ] Ready to start coding!

---

## 🎉 Conclusion

You now have a **complete roadmap** for Phase 1! This document serves as your blueprint for the Shree Namkeen e-commerce platform.

### Key Takeaways
1. ✅ **Full e-commerce** with payments, order management, and PWA
2. ✅ **Budget-friendly** - Start with ₹900-2000, scale as you grow
3. ✅ **Modern tech stack** - React, Node.js, PostgreSQL
4. ✅ **6-8 week timeline** - Achievable with focused development
5. ✅ **Scalable architecture** - Start small, grow organically

### What's Next?
Once you complete the checklist above and gather necessary assets, we'll move to:
- **Phase 2:** Frontend Development (React UI)
- **Phase 3:** Backend Development (APIs & Database)
- **Phase 4:** Integration & Testing
- **Phase 5:** Deployment & Launch

---

**Remember:** Building a successful e-commerce platform is a marathon, not a sprint. Take it step by step, test thoroughly, and iterate based on real user feedback. You've got this! 🚀

**Questions?** Keep this document handy and refer to it throughout the development process. When you're ready to start Phase 2, we'll dive into actual code!
