# Phase 4: Integration & Testing - Shree Namkeen E-Commerce
## Complete Frontend-Backend Integration & Quality Assurance

---

## 📋 Phase 4 Overview

**Duration:** 1 Week  
**Goal:** Connect frontend to backend, integrate payment gateway, comprehensive testing  
**Deliverable:** Fully functional e-commerce application end-to-end

---

## Day 1-2: API Integration

### Step 1: Configure API Client

**src/services/api.js:**
```javascript
import axios from 'axios';
import toast from 'react-hot-toast';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Request interceptor - Add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with error
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          // Unauthorized - clear auth and redirect to login
          localStorage.removeItem('authToken');
          localStorage.removeItem('userData');
          window.location.href = '/login';
          toast.error('Session expired. Please login again.');
          break;
          
        case 403:
          toast.error('You do not have permission to perform this action');
          break;
          
        case 404:
          toast.error('Resource not found');
          break;
          
        case 422:
          // Validation errors
          if (data.errors) {
            Object.values(data.errors).forEach(err => {
              toast.error(err[0]);
            });
          } else {
            toast.error(data.message || 'Validation failed');
          }
          break;
          
        case 500:
          toast.error('Server error. Please try again later.');
          break;
          
        default:
          toast.error(data.message || 'Something went wrong');
      }
    } else if (error.request) {
      // Request made but no response
      toast.error('Network error. Please check your connection.');
    } else {
      toast.error('Request failed. Please try again.');
    }
    
    return Promise.reject(error);
  }
);

export default api;
```

### Step 2: Payment Gateway Integration (Razorpay)

**src/services/paymentService.js:**
```javascript
import api from './api';

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export const initiatePayment = async (orderData) => {
  try {
    // Load Razorpay script
    const loaded = await loadRazorpayScript();
    if (!loaded) {
      throw new Error('Razorpay SDK failed to load');
    }

    // Create order on backend
    const { data } = await api.post('/payments/create-order', {
      amount: orderData.totalAmount,
      currency: 'INR',
      receipt: `order_${Date.now()}`,
      notes: {
        orderId: orderData.orderId,
      },
    });

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: data.order.amount,
      currency: data.order.currency,
      name: 'Shree Namkeen',
      description: `Order #${orderData.orderNumber}`,
      image: '/logo.png',
      order_id: data.order.id,
      handler: async (response) => {
        try {
          // Verify payment on backend
          const verifyData = await api.post('/payments/verify', {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            orderId: orderData.orderId,
          });

          return {
            success: true,
            data: verifyData.data,
          };
        } catch (error) {
          return {
            success: false,
            error: error.message,
          };
        }
      },
      prefill: {
        name: orderData.customerName,
        email: orderData.customerEmail,
        contact: orderData.customerPhone,
      },
      notes: {
        address: orderData.shippingAddress,
      },
      theme: {
        color: '#FF6B35',
      },
      modal: {
        ondismiss: () => {
          return {
            success: false,
            error: 'Payment cancelled by user',
          };
        },
      },
    };

    return new Promise((resolve) => {
      const razorpay = new window.Razorpay(options);
      
      razorpay.on('payment.failed', (response) => {
        resolve({
          success: false,
          error: response.error.description,
        });
      });

      razorpay.open();
    });
  } catch (error) {
    throw error;
  }
};
```

### Step 3: WhatsApp Integration

**Backend - src/services/whatsappService.js:**
```javascript
const twilio = require('twilio');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const whatsappNumber = process.env.TWILIO_WHATSAPP_NUMBER;

const client = twilio(accountSid, authToken);

exports.sendOrderConfirmation = async (orderData) => {
  try {
    const message = `
🎉 *Order Confirmed!*

Thank you for your order with Shree Namkeen!

*Order #${orderData.orderNumber}*
*Total: ₹${orderData.totalAmount}*

Items:
${orderData.items.map(item => `• ${item.productName} (${item.variantWeight}) x ${item.quantity}`).join('\n')}

Estimated delivery: ${orderData.estimatedDelivery}

Track your order: ${process.env.FRONTEND_URL}/track/${orderData.orderNumber}

Questions? Reply to this message!
    `.trim();

    await client.messages.create({
      from: `whatsapp:${whatsappNumber}`,
      to: `whatsapp:+91${orderData.customerPhone}`,
      body: message,
    });

    return { success: true };
  } catch (error) {
    console.error('WhatsApp error:', error);
    return { success: false, error: error.message };
  }
};

exports.sendOrderStatusUpdate = async (orderData, status) => {
  const statusMessages = {
    confirmed: '✅ Your order has been confirmed!',
    processing: '📦 Your order is being packed!',
    shipped: `🚚 Your order has been shipped!\n\nTracking: ${orderData.trackingNumber}\nCourier: ${orderData.courierName}`,
    delivered: '🎊 Your order has been delivered! Enjoy!',
    cancelled: '❌ Your order has been cancelled.',
  };

  try {
    const message = `
*Shree Namkeen*

${statusMessages[status]}

*Order #${orderData.orderNumber}*

Track: ${process.env.FRONTEND_URL}/track/${orderData.orderNumber}
    `.trim();

    await client.messages.create({
      from: `whatsapp:${whatsappNumber}`,
      to: `whatsapp:+91${orderData.customerPhone}`,
      body: message,
    });

    return { success: true };
  } catch (error) {
    console.error('WhatsApp error:', error);
    return { success: false, error: error.message };
  }
};
```

---

## Day 3-4: Comprehensive Testing

### Manual Testing Checklist

#### User Journey Testing

**1. Browse & Search**
- [ ] Homepage loads correctly
- [ ] All categories display properly
- [ ] Product search works
- [ ] Filters apply correctly
- [ ] Product cards show correct info
- [ ] Images load and are optimized

**2. Product Details**
- [ ] Product page loads with all details
- [ ] Image gallery works (zoom, navigation)
- [ ] Variant selection updates price
- [ ] Add to cart functionality works
- [ ] Related products display
- [ ] Reviews section loads

**3. Cart Management**
- [ ] Items added to cart appear correctly
- [ ] Quantity adjustment works
- [ ] Remove from cart works
- [ ] Cart persists on page refresh
- [ ] Cart total calculates correctly
- [ ] Shipping cost applies correctly (free above ₹999)

**4. Authentication**
- [ ] Registration form validates inputs
- [ ] Email verification works
- [ ] Login successful with correct credentials
- [ ] Login fails with wrong credentials
- [ ] Forgot password flow works
- [ ] Logout clears session

**5. Checkout Process**
- [ ] Guest checkout works
- [ ] Logged-in checkout works
- [ ] Address form validates
- [ ] Saved addresses load
- [ ] Payment methods display
- [ ] Order review shows correct details
- [ ] Order placement creates order

**6. Payment Testing**
- [ ] Razorpay modal opens
- [ ] Test UPI payment works
- [ ] Test card payment works
- [ ] COD order placement works
- [ ] Failed payment handles gracefully
- [ ] Payment verification works

**7. Order Management**
- [ ] Order confirmation page displays
- [ ] Email notification sent
- [ ] WhatsApp notification sent
- [ ] Order appears in user account
- [ ] Order tracking works
- [ ] Order details correct

**8. Reviews & Ratings**
- [ ] Review submission works
- [ ] Star rating updates
- [ ] Review appears after approval
- [ ] Review editing works
- [ ] Helpful button works

**9. Admin Panel**
- [ ] Admin login works
- [ ] Dashboard shows correct stats
- [ ] Product CRUD operations work
- [ ] Order status updates work
- [ ] Order status triggers notifications
- [ ] Review approval works
- [ ] Settings save correctly

---

## Day 5-6: Performance Optimization

### Frontend Optimization

**1. Code Splitting**
```javascript
// Lazy load routes
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage'));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));

// Use Suspense
<Suspense fallback={<LoadingSpinner />}>
  <ProductDetailPage />
</Suspense>
```

**2. Image Optimization**
```javascript
// Use next-gen formats
<picture>
  <source srcset="image.webp" type="image/webp" />
  <img src="image.jpg" alt="Product" loading="lazy" />
</picture>

// Lazy load images
import { LazyLoadImage } from 'react-lazy-load-image-component';

<LazyLoadImage
  src={product.imageUrl}
  alt={product.name}
  effect="blur"
/>
```

**3. React Query Caching**
```javascript
// Configure cache times
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      refetchOnWindowFocus: false,
    },
  },
});
```

### Backend Optimization

**1. Database Indexing**
```sql
-- Add indexes for frequently queried columns
CREATE INDEX idx_products_category_active ON products(category_id, is_active);
CREATE INDEX idx_orders_user_status ON orders(user_id, status);
CREATE INDEX idx_orders_created ON orders(created_at DESC);
```

**2. Query Optimization**
```javascript
// Use select to fetch only needed fields
const products = await prisma.product.findMany({
  select: {
    id: true,
    name: true,
    slug: true,
    imageUrl: true,
    basePrice: true,
    rating: true,
  },
  where: { isActive: true },
});

// Use pagination
const products = await prisma.product.findMany({
  skip: (page - 1) * limit,
  take: limit,
});
```

**3. Response Compression**
```javascript
// Add compression middleware
const compression = require('compression');
app.use(compression());
```

---

## Day 7: Pre-Deployment Testing

### Security Testing

**1. Authentication Security**
- [ ] Passwords hashed (not stored plain)
- [ ] JWT tokens expire correctly
- [ ] Protected routes require authentication
- [ ] Admin routes require admin role
- [ ] Session management works

**2. Input Validation**
- [ ] SQL injection prevented
- [ ] XSS attacks prevented
- [ ] CSRF protection enabled
- [ ] File upload validation
- [ ] Rate limiting works

**3. Payment Security**
- [ ] Payment signatures verified
- [ ] Sensitive data not logged
- [ ] HTTPS enforced in production
- [ ] API keys secured

### Cross-Browser Testing

Test on:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile browsers (Chrome, Safari iOS)

### Responsive Testing

Test on:
- [ ] Mobile (320px - 480px)
- [ ] Tablet (481px - 768px)
- [ ] Laptop (769px - 1024px)
- [ ] Desktop (1025px+)

### Accessibility Testing

- [ ] Keyboard navigation works
- [ ] Screen reader compatible
- [ ] ARIA labels present
- [ ] Color contrast sufficient
- [ ] Focus indicators visible

### Performance Testing

**Target Metrics:**
- [ ] First Contentful Paint < 1.5s
- [ ] Largest Contentful Paint < 2.5s
- [ ] Time to Interactive < 3.5s
- [ ] Lighthouse score > 90

**Tools:**
- Chrome DevTools Lighthouse
- PageSpeed Insights
- WebPageTest.org

---

## Integration Testing Scenarios

### Scenario 1: Complete Purchase Flow

```javascript
describe('Complete Purchase Flow', () => {
  test('User can browse, add to cart, and checkout', async () => {
    // 1. Browse products
    await page.goto('/products');
    expect(await page.title()).toBe('Products - Shree Namkeen');
    
    // 2. Add product to cart
    await page.click('[data-testid="product-card-1"]');
    await page.click('[data-testid="add-to-cart"]');
    expect(await page.textContent('[data-testid="cart-count"]')).toBe('1');
    
    // 3. Go to cart
    await page.click('[data-testid="cart-button"]');
    expect(await page.url()).toContain('/cart');
    
    // 4. Proceed to checkout
    await page.click('[data-testid="checkout-button"]');
    
    // 5. Fill shipping info
    await page.fill('[name="name"]', 'Test User');
    await page.fill('[name="phone"]', '9876543210');
    await page.fill('[name="address"]', '123 Test Street');
    await page.fill('[name="city"]', 'Mumbai');
    await page.fill('[name="pincode"]', '400001');
    
    // 6. Select COD
    await page.click('[data-testid="payment-cod"]');
    
    // 7. Place order
    await page.click('[data-testid="place-order"]');
    
    // 8. Verify confirmation
    expect(await page.url()).toContain('/order/confirmation');
    expect(await page.textContent('h1')).toContain('Order Confirmed');
  });
});
```

### Scenario 2: Product Review Flow

```javascript
describe('Product Review Flow', () => {
  test('User can leave a review after purchase', async () => {
    // 1. Login
    await login('test@example.com', 'password');
    
    // 2. Go to orders
    await page.goto('/account/orders');
    
    // 3. Click on completed order
    await page.click('[data-testid="order-item-completed"]');
    
    // 4. Click review button
    await page.click('[data-testid="write-review"]');
    
    // 5. Fill review form
    await page.click('[data-testid="star-5"]');
    await page.fill('[name="title"]', 'Great product!');
    await page.fill('[name="comment"]', 'Very tasty and fresh.');
    
    // 6. Submit
    await page.click('[data-testid="submit-review"]');
    
    // 7. Verify success
    expect(await page.textContent('.toast')).toContain('Review submitted');
  });
});
```

---

## Bug Tracking & Resolution

### Common Issues & Fixes

**Issue 1: Cart not persisting**
```javascript
// Fix: Ensure localStorage is updated
useEffect(() => {
  localStorage.setItem('cart', JSON.stringify(cart));
}, [cart]);
```

**Issue 2: Payment modal not opening**
```javascript
// Fix: Ensure Razorpay script loaded
const loadScript = async () => {
  const script = document.createElement('script');
  script.src = 'https://checkout.razorpay.com/v1/checkout.js';
  await new Promise((resolve) => {
    script.onload = resolve;
    document.body.appendChild(script);
  });
};
```

**Issue 3: Images not loading**
```javascript
// Fix: Use Cloudinary transformations
const getOptimizedImageUrl = (url) => {
  return url.replace('/upload/', '/upload/w_800,q_auto,f_auto/');
};
```

---

## Phase 4 Completion Checklist

### Integration
- [ ] Frontend connected to backend API
- [ ] Authentication flow working
- [ ] Product catalog loads from database
- [ ] Cart syncs with backend (if logged in)
- [ ] Orders created in database
- [ ] Payment gateway integrated
- [ ] Email notifications working
- [ ] WhatsApp notifications working

### Testing
- [ ] All user journeys tested
- [ ] Cross-browser compatibility verified
- [ ] Responsive design verified
- [ ] Security vulnerabilities checked
- [ ] Performance optimized
- [ ] Accessibility standards met
- [ ] Error handling tested

### Documentation
- [ ] API documentation complete
- [ ] Environment variables documented
- [ ] Setup instructions written
- [ ] Known issues documented
- [ ] Troubleshooting guide created

### Ready for Deployment
- [ ] All tests passing
- [ ] No critical bugs
- [ ] Performance targets met
- [ ] Security audit passed
- [ ] User acceptance testing complete

---

**Next Phase:** Deployment & Launch (Phase 5)
