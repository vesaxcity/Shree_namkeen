# Phase 5: Deployment & Launch - Shree Namkeen E-Commerce
## Complete Production Deployment Guide

---

## 📋 Phase 5 Overview

**Duration:** 1 Week  
**Goal:** Deploy application to production, configure domain, launch website  
**Deliverable:** Live, publicly accessible e-commerce website

---

## Day 1-2: Pre-Deployment Preparation

### Step 1: Environment Configuration

#### Production Environment Variables

**Frontend (.env.production):**
```bash
VITE_API_URL=https://api.shreenamkeen.com
VITE_RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxx
VITE_APP_NAME=Shree Namkeen
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_FRONTEND_URL=https://shreenamkeen.com
```

**Backend (.env for production):**
```bash
# Environment
NODE_ENV=production
PORT=5000

# Database
DATABASE_URL=postgresql://user:password@host:port/database?sslmode=require

# JWT
JWT_SECRET=your_super_long_random_secret_here_minimum_32_characters
JWT_EXPIRES_IN=24h
REFRESH_TOKEN_SECRET=another_super_long_random_secret
REFRESH_TOKEN_EXPIRES_IN=7d

# Razorpay
RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxx
RAZORPAY_SECRET=your_razorpay_secret

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email (Resend)
RESEND_API_KEY=re_xxxxxxxxxxxx
FROM_EMAIL=noreply@shreenamkeen.com

# WhatsApp (Twilio)
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_WHATSAPP_NUMBER=+14155238886

# Frontend URL
FRONTEND_URL=https://shreenamkeen.com

# CORS Origins
CORS_ORIGINS=https://shreenamkeen.com,https://www.shreenamkeen.com

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Step 2: Database Migration

**Create production database:**
```bash
# Using Railway PostgreSQL
# 1. Create new PostgreSQL database in Railway
# 2. Copy connection string
# 3. Update DATABASE_URL in .env

# Run migrations
npx prisma migrate deploy

# Seed initial data (categories, admin user)
npx prisma db seed
```

**Database Seed Script (prisma/seed.js):**
```javascript
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@shreenamkeen.com' },
    update: {},
    create: {
      email: 'admin@shreenamkeen.com',
      passwordHash: adminPassword,
      name: 'Admin',
      phone: '9876543210',
      role: 'admin',
      isVerified: true,
    },
  });

  console.log('Admin user created:', admin.email);

  // Create categories
  const categories = [
    { name: 'Sev Varieties', slug: 'sev-varieties', icon: '🌾', displayOrder: 1 },
    { name: 'Mixture & Namkeen', slug: 'mixture-namkeen', icon: '🥗', displayOrder: 2 },
    { name: 'Seasonal Specials', slug: 'seasonal-specials', icon: '⭐', displayOrder: 3 },
  ];

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: category,
    });
  }

  console.log('Categories created');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

### Step 3: Build Optimization

**Frontend Build:**
```bash
# Install dependencies
npm ci --production=false

# Build for production
npm run build

# Test production build locally
npm run preview
```

**Backend Optimization:**
```javascript
// Add production optimizations to server.js
if (process.env.NODE_ENV === 'production') {
  // Trust proxy
  app.set('trust proxy', 1);
  
  // Helmet for security headers
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", "fonts.googleapis.com"],
        fontSrc: ["'self'", "fonts.gstatic.com"],
        imgSrc: ["'self'", "data:", "https:", "res.cloudinary.com"],
        scriptSrc: ["'self'", "checkout.razorpay.com"],
      },
    },
  }));
  
  // Compression
  app.use(compression());
  
  // Rate limiting
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
  });
  app.use('/api/', limiter);
}
```

---

## Day 3-4: Deploy Backend (Railway)

### Step 1: Setup Railway Account

1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Verify email

### Step 2: Deploy Backend

**Option A: Deploy from GitHub**

1. **Push code to GitHub:**
```bash
cd shree-namkeen-backend
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/shree-namkeen-backend.git
git push -u origin main
```

2. **Deploy to Railway:**
- Click "New Project"
- Select "Deploy from GitHub repo"
- Choose your repository
- Railway auto-detects Node.js
- Click "Deploy"

3. **Add Environment Variables:**
- Go to project → Variables tab
- Add all production env variables
- Click "Deploy" to restart with new variables

4. **Add PostgreSQL Database:**
- Click "New" → "Database" → "PostgreSQL"
- Railway creates database automatically
- Copy `DATABASE_URL` to your backend variables

5. **Run Migrations:**
- Go to Settings → Deploy
- Add custom build command: `npx prisma migrate deploy && npm run build`
- Add custom start command: `npm start`

**Option B: Deploy using Railway CLI**

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Initialize project
railway init

# Link to project
railway link

# Deploy
railway up

# Add PostgreSQL
railway add --plugin postgresql

# View logs
railway logs
```

### Step 3: Configure Domain for Backend

1. Go to Settings → Networking
2. Click "Generate Domain" (gets you a railway.app subdomain)
3. Or add custom domain:
   - Add CNAME record: `api.shreenamkeen.com` → `xxx.railway.app`
   - Add domain in Railway
   - SSL auto-configured

---

## Day 5-6: Deploy Frontend (Vercel)

### Step 1: Setup Vercel Account

1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Verify email

### Step 2: Deploy Frontend

**Option A: Deploy from GitHub**

1. **Push code to GitHub:**
```bash
cd shree-namkeen-frontend
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/shree-namkeen-frontend.git
git push -u origin main
```

2. **Import to Vercel:**
- Click "Add New Project"
- Import from GitHub
- Select repository
- Framework Preset: Vite
- Root Directory: `./`
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`

3. **Add Environment Variables:**
- Add all VITE_* variables
- Click "Deploy"

4. **Configure Domain:**
- Go to Project Settings → Domains
- Add `shreenamkeen.com`
- Add DNS records:
  ```
  A     @     76.76.21.21
  CNAME www   cname.vercel-dns.com
  ```
- Vercel auto-configures SSL

**Option B: Deploy using Vercel CLI**

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy to preview
vercel

# Deploy to production
vercel --prod

# Add environment variables
vercel env add VITE_API_URL
# Enter value when prompted
```

### Step 3: Configure PWA

**Verify PWA working:**
1. Visit site on mobile
2. Look for "Install app" prompt
3. Test offline functionality
4. Check service worker in DevTools

**Generate PWA Icons:**
Use [realfavicongenerator.net](https://realfavicongenerator.net)

Upload your logo and download:
- favicon.ico
- apple-touch-icon.png
- pwa-192x192.png
- pwa-512x512.png

Place in `public/` folder.

---

## Day 7: Domain Configuration & SSL

### Step 1: Purchase Domain

**Recommended Registrars:**
- Namecheap: ~₹700/year
- GoDaddy: ~₹900/year
- Google Domains: ~₹1000/year

**Purchase Steps:**
1. Search for `shreenamkeen.com`
2. Add to cart
3. Checkout (1-2 years recommended)
4. Enable domain privacy (usually free)

### Step 2: Configure DNS

**Add DNS Records:**

```
Record Type | Name | Value                          | TTL
------------|------|--------------------------------|------
A           | @    | 76.76.21.21 (Vercel IP)       | Auto
CNAME       | www  | cname.vercel-dns.com          | Auto
CNAME       | api  | shree-namkeen-backend.railway.app | Auto
```

**Propagation:**
- DNS changes take 1-48 hours
- Check status: [dnschecker.org](https://dnschecker.org)

### Step 3: SSL Configuration

**Vercel:**
- SSL auto-configured ✅
- Force HTTPS in project settings

**Railway:**
- SSL auto-configured ✅
- Automatic renewal

**Verify SSL:**
- Visit https://shreenamkeen.com
- Check for padlock icon
- Test on [ssllabs.com](https://www.ssllabs.com/ssltest/)

---

## Post-Deployment Configuration

### Step 1: Google Services

**Google Analytics 4:**
```html
<!-- Add to index.html -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

**Google Search Console:**
1. Go to [search.google.com/search-console](https://search.google.com/search-console)
2. Add property: `shreenamkeen.com`
3. Verify ownership (HTML tag method)
4. Submit sitemap: `https://shreenamkeen.com/sitemap.xml`

**Google My Business:**
1. Create business profile
2. Add location, hours, photos
3. Link to website
4. Verify business

### Step 2: Social Media Setup

**Facebook Page:**
1. Create business page
2. Add cover photo, profile picture
3. Add website link
4. Post initial content

**Instagram Business:**
1. Create business account
2. Add bio with website link
3. Post product photos
4. Use hashtags: #namkeen #indiansnacks

### Step 3: Payment Gateway Live Mode

**Razorpay Activation:**
1. Complete KYC verification
2. Add bank account
3. Submit business documents
4. Switch to live mode
5. Update API keys in production

**Test Live Payments:**
- Make real ₹1 transaction
- Verify webhook delivery
- Check settlement
- Refund test payment

### Step 4: Email Configuration

**Custom Email:**
1. Setup email forwarding (Cloudflare, Zoho)
2. Configure `noreply@shreenamkeen.com`
3. Test email delivery
4. Check spam score: [mail-tester.com](https://www.mail-tester.com)

**Email Templates:**
- Order confirmation
- Shipping notification
- Delivery confirmation
- Welcome email
- Password reset

---

## Monitoring & Maintenance

### Step 1: Error Tracking (Sentry)

**Setup Sentry:**
```bash
npm install @sentry/react @sentry/tracing
```

**Configure:**
```javascript
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "your-sentry-dsn",
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
});
```

### Step 2: Uptime Monitoring

**Free Options:**
- UptimeRobot: 50 monitors free
- Pingdom: Free trial
- StatusCake: 10 monitors free

**Setup:**
1. Add monitor for `https://shreenamkeen.com`
2. Add monitor for `https://api.shreenamkeen.com/health`
3. Configure alerts (email/SMS)
4. Set check interval: 5 minutes

### Step 3: Backup Strategy

**Database Backups:**
```bash
# Railway automatic backups (if on paid plan)
# Or manual backups:

# Backup
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d).sql

# Restore
psql $DATABASE_URL < backup_20240101.sql
```

**Automated Backups:**
```bash
# Cron job (daily at 2 AM)
0 2 * * * pg_dump $DATABASE_URL > /backups/backup_$(date +\%Y\%m\%d).sql
```

### Step 4: Performance Monitoring

**Tools:**
- Google PageSpeed Insights
- Lighthouse CI
- Web Vitals monitoring

**Set Targets:**
- Performance Score: > 90
- Accessibility: > 95
- Best Practices: > 95
- SEO: 100

---

## Launch Checklist

### Pre-Launch (Final Checks)

**Technical:**
- [ ] All pages load correctly
- [ ] No console errors
- [ ] All images optimized
- [ ] SSL working (https://)
- [ ] Redirects working (www → non-www or vice versa)
- [ ] PWA installable
- [ ] Mobile responsive
- [ ] Cross-browser tested

**Content:**
- [ ] All products added (50+)
- [ ] Product images uploaded
- [ ] Descriptions complete
- [ ] Prices verified
- [ ] Categories organized
- [ ] Legal pages complete (Terms, Privacy, etc.)
- [ ] Contact info correct
- [ ] About Us page complete

**Functionality:**
- [ ] User registration works
- [ ] Login/logout works
- [ ] Product search works
- [ ] Cart functionality works
- [ ] Checkout process works
- [ ] Payment gateway live
- [ ] Order emails sending
- [ ] WhatsApp notifications working
- [ ] Admin panel accessible
- [ ] Order management works

**SEO:**
- [ ] Meta titles unique
- [ ] Meta descriptions complete
- [ ] Sitemap submitted
- [ ] Robots.txt configured
- [ ] Google Analytics installed
- [ ] Schema markup added
- [ ] Social media cards configured

**Security:**
- [ ] HTTPS enforced
- [ ] Security headers configured
- [ ] Rate limiting active
- [ ] Input validation working
- [ ] Authentication secure
- [ ] Admin area protected

**Performance:**
- [ ] Lighthouse score > 90
- [ ] Load time < 3s
- [ ] Images lazy loaded
- [ ] Code minified
- [ ] Caching configured

### Launch Day

**Morning:**
1. Final production deployment
2. Clear all test data
3. Verify all services running
4. Test complete purchase flow
5. Check email/WhatsApp notifications

**Afternoon:**
6. Announce on social media
7. Send email to existing customers (if any)
8. Update Google My Business
9. Share with friends/family
10. Monitor for errors

**Evening:**
11. Check analytics setup
12. Monitor server resources
13. Review first orders
14. Respond to customer queries
15. Document any issues

---

## Post-Launch (Week 1)

### Daily Tasks
- [ ] Check orders
- [ ] Process payments
- [ ] Update order statuses
- [ ] Respond to customer queries
- [ ] Monitor server health
- [ ] Review analytics

### Weekly Tasks
- [ ] Review sales data
- [ ] Update product inventory
- [ ] Add new products
- [ ] Create social media content
- [ ] Optimize based on user feedback
- [ ] Backup database

---

## Troubleshooting Guide

### Common Issues

**Issue 1: "Site can't be reached"**
- Check DNS propagation
- Verify domain pointing to correct IP
- Check Vercel/Railway deployment status

**Issue 2: "Mixed content error"**
- Ensure all resources use HTTPS
- Update image URLs to HTTPS
- Check third-party scripts

**Issue 3: Payment not working**
- Verify Razorpay live keys
- Check webhook URL configured
- Test with different payment methods

**Issue 4: Emails not sending**
- Check Resend API key
- Verify sender email
- Check spam folder
- Review email template syntax

**Issue 5: WhatsApp not sending**
- Verify Twilio credentials
- Check WhatsApp template approval
- Verify phone number format (+91...)

---

## Marketing & Growth

### Week 1-2: Soft Launch
- Share with close network
- Collect feedback
- Fix critical issues
- Optimize based on usage

### Week 3-4: Public Launch
- Social media announcement
- Local listings (Google, Justdial)
- Facebook/Instagram ads (₹1000 budget)
- Influencer partnerships (micro-influencers)

### Month 2-3: Growth
- Email marketing
- Referral program
- Seasonal promotions
- Content marketing (recipes, blogs)
- WhatsApp catalog

---

## Cost Summary (First Month)

| Item | Cost (₹) |
|------|----------|
| Domain | 75 (₹900/year) |
| Vercel | 0 (Free tier) |
| Railway | 0-400 (Free tier + overages) |
| Cloudinary | 0 (Free tier) |
| Razorpay | 2% per transaction |
| Resend (Email) | 0 (3000/month free) |
| Twilio (WhatsApp) | ~100 (₹0.50-1/msg) |
| **Total** | **₹175-575** |

*Plus Razorpay fees on sales (₹2 per ₹100 sold)*

---

## Success Metrics (Month 1)

**Traffic:**
- Target: 500-1000 unique visitors
- Bounce rate: < 50%
- Avg. session: > 3 minutes

**Conversions:**
- Target: 50-100 orders
- Conversion rate: > 2%
- Average order value: ₹500-800

**Revenue:**
- Target: ₹25,000-80,000
- Customer acquisition cost: < ₹100
- Customer lifetime value: > ₹1000

---

## Phase 5 Complete! 🎉

Your Shree Namkeen e-commerce website is now LIVE!

**What's Next:**
1. Monitor daily operations
2. Gather customer feedback
3. Iterate and improve
4. Add new features
5. Scale marketing efforts

**Support Resources:**
- Railway Docs: https://docs.railway.app
- Vercel Docs: https://vercel.com/docs
- Razorpay Docs: https://razorpay.com/docs

**Congratulations on launching your e-commerce business!** 🚀
