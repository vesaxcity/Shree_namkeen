# Shree's Namkeen Website Project Context Report

Generated on: 2026-04-28

## Executive Summary

The Shree's Namkeen project has two main application areas:

- `shrees-namkeen`: React/Vite storefront frontend.
- `shrees-namkeen-backend`: Express/Prisma/PostgreSQL API backend.

The frontend is the most complete part of the website. It has a working e-commerce storefront experience using mock product data, localStorage-backed cart and wishlist state, mock authentication, checkout UI, responsive routing, PWA configuration, and polished product browsing screens.

The backend is substantially scaffolded and now boots successfully, including auth, product, category, order, payment, upload, email, and Prisma infrastructure. However, the live database still needs schema creation and seeding before DB-backed API routes can return products/orders correctly.

## Current Run Status

Verified locally:

- Frontend dev server responds successfully at `http://127.0.0.1:5173/`.
- Backend server responds successfully at `http://127.0.0.1:5000/health`.
- Frontend lint passes with `npm run lint`.
- Frontend production build passes with `npm run build`.
- Prisma Client generation passes with `npm exec prisma generate`.

Known current blocker:

- `GET /api/products` currently returns `500` because the configured PostgreSQL database does not yet contain the Prisma tables. The specific missing table is `public.Product`.

## Technology Stack Implemented

Frontend:

- React 19.
- Vite 8.
- Tailwind CSS 4 via `@tailwindcss/vite`.
- React Router DOM 6 using `createBrowserRouter`.
- TanStack React Query 5 configured at the app root.
- React Hot Toast for notifications.
- Lucide React for icons.
- `vite-plugin-pwa` with app manifest and Pexels image runtime caching.

Backend:

- Node.js and Express 5.
- Prisma 7 with PostgreSQL.
- `@prisma/adapter-pg` and `pg` for Prisma 7 direct database access.
- JWT authentication.
- Bcrypt password hashing.
- Express Validator.
- Helmet, CORS, Morgan, Cookie Parser, and rate limiting.
- Multer and Cloudinary configuration for image upload support.
- Razorpay configuration and payment verification controller.
- Nodemailer email service.

## Frontend Work Completed

### Routing and App Shell

Implemented route map:

- `/` - Home page.
- `/products` - Product listing page.
- `/products/:id` - Product detail page.
- `/login` - Login form.
- `/register` - Registration form.
- `/checkout` - Checkout page.
- `*` - 404 fallback.

The shared layout includes:

- Sticky header.
- Footer.
- Cart sidebar.
- Notification surface.

The app root composes:

- `QueryClientProvider`.
- `AuthProvider`.
- `CartProvider`.
- `RouterProvider`.
- `Toaster`.

### Storefront Pages

Completed pages:

- Home page with hero, feature strip, category cards, and bestseller products.
- Product listing with category and search filtering driven by URL query params.
- Product detail page with product image, rating, discount display, variants, ingredients, shelf life, cart action, and wishlist action.
- Checkout page with contact details, delivery address, payment option UI, order summary, empty cart state, and mock order placement flow.
- Login page with form validation, password visibility toggle, mock login, toast feedback, and redirect.
- Registration page with local validation, password confirmation, mock registration, toast feedback, and redirect.

### Product Data

The frontend currently uses static mock data in `src/data/products.js`.

Implemented product data includes:

- Categories: all products, sev varieties, mixture, seasonal specials.
- Product catalog entries with name, category, current price, original price, image URL, description, rating, review count, variants, bestseller/new flags, ingredients, and shelf life.
- Product variants with weight, price, and stock.

### Cart, Wishlist, and Notifications

Implemented via `CartContext`:

- Add to cart.
- Increment existing item quantity.
- Remove item from cart.
- Update quantity by absolute value.
- Clear cart.
- Derived totals: item count, subtotal, shipping cost, final total.
- Free shipping threshold logic in frontend cart.
- Wishlist toggle.
- Cart and wishlist persistence in `localStorage`.
- Temporary notification messages.

### Authentication Frontend

Implemented via `AuthContext`:

- Mock login.
- Mock register.
- Logout.
- Session persistence in `localStorage`.
- `isAuthenticated` and `isAdmin` derived flags.

Important note:

- Frontend auth is not connected to the backend yet. It uses mock tokens and mock user state.

### PWA and Styling

Completed:

- PWA manifest with app name, short name, theme/background colors, display mode, start URL, and icon declarations.
- Workbox runtime caching for Pexels images.
- Tailwind-based responsive UI.
- Global Google font imports for Playfair Display and Montserrat.
- Custom slide-in animation and line clamp utility.

## Backend Work Completed

### Server and Middleware

Implemented Express server features:

- Environment loading through dotenv.
- Helmet security headers.
- CORS using configured frontend origin.
- Rate limiting: 200 requests per 15 minutes.
- JSON and URL-encoded body parsing.
- Cookie parsing.
- Morgan request logging.
- Static `/uploads` serving.
- `/health` endpoint.
- 404 handler.
- Central error handler.

Mounted API routes:

- `/api/auth`.
- `/api/products`.
- `/api/categories`.
- `/api/orders`.
- `/api/payments`.

### Prisma and Database Model

Implemented Prisma schema includes:

- User.
- Category.
- Product.
- ProductVariant.
- Address.
- Order.
- OrderItem.
- OrderStatusHistory.
- Review.
- CartItem.
- Wishlist.
- Notification.

Enums implemented:

- Role.
- OrderStatus.
- PaymentStatus.
- PaymentMethod.

Prisma 7 compatibility work completed:

- Removed datasource URL from `schema.prisma`.
- Added `prisma.config.ts`.
- Added PostgreSQL adapter dependency.
- Wired `PrismaPg` adapter into the shared Prisma singleton.
- Prisma Client generation succeeds.

### Authentication API

Implemented routes:

- `POST /api/auth/register`.
- `POST /api/auth/login`.
- `GET /api/auth/me`.
- `PUT /api/auth/profile`.
- `PUT /api/auth/password`.
- `POST /api/auth/logout`.

Implemented behavior:

- Registration with duplicate email check.
- Password hashing.
- Login with bcrypt comparison.
- JWT generation.
- Refresh token cookie on login.
- Protected route middleware.
- Optional auth middleware for public routes that can use a user if present.
- Account active checks.

### Product API

Implemented routes:

- `GET /api/products`.
- `GET /api/products/:slug`.
- `POST /api/products` for admins.
- `PUT /api/products/:id` for admins.
- `DELETE /api/products/:id` for admins.

Implemented behavior:

- Product listing with pagination.
- Category filtering.
- Text search.
- Featured filtering.
- Min/max price filtering through variants.
- Sorting by allowed fields.
- Product detail by slug.
- Approved review inclusion.
- Average rating calculation.
- Admin product creation with variants.
- Admin product update.
- Soft delete through `isActive: false`.
- Upload middleware for product images.

Current limitation:

- These routes are implemented, but they cannot return data until the database schema is pushed/migrated and seeded.

### Category API

Implemented routes:

- Category listing.
- Category detail lookup.

Category routes use Prisma and are subject to the same database schema requirement.

### Order API

Implemented routes:

- `POST /api/orders`.
- `GET /api/orders/my-orders`.
- `GET /api/orders/all` for admins.
- `GET /api/orders/:orderNumber`.
- `PUT /api/orders/:id/status` for admins.

Implemented behavior:

- Protected order creation.
- Item validation.
- Variant lookup.
- Stock checks.
- Subtotal calculation.
- Shipping calculation.
- Order number generation.
- Estimated delivery calculation.
- Transactional order creation.
- Stock decrement after order creation.
- Order status history creation.
- Non-blocking order confirmation email attempt.
- User order listing.
- Admin order listing.
- Owner/admin access control for order detail.
- Admin order status update.

### Payment API

Implemented Razorpay behavior:

- Create Razorpay order.
- Store Razorpay order id against internal order.
- Verify Razorpay signature.
- Mark payment as paid.
- Mark order as confirmed.
- Store Razorpay payment id.
- Add status history entry after payment verification.

### Seed Data

Seed script exists and includes:

- Admin user: `admin@shreesnamkeen.com`.
- Three backend categories.
- Three backend products with variants.

Important note:

- The seed script has not been run successfully against the current configured database in this session because the database schema has not yet been applied.

## Assets Completed

The repository includes brand logo assets:

- SVG logos in `project asssets/svg_logos`.
- PNG logos in `project asssets/png_logos`.
- Frontend public assets include favicon and icons.

## Documentation Completed

Existing planning and documentation files include:

- Master website development roadmap.
- Phase 1 planning notes.
- Phase 2 frontend development guide.
- Frontend architecture documentation.
- Phase 3 backend completion guide.
- Phase 3 backend part 2 controller/routes guide.
- Phase 4 integration/testing roadmap.
- Phase 5 deployment/launch roadmap.

## What Is Done So Far

Completed or mostly completed:

- Project roadmap and phased planning.
- React storefront application scaffold.
- Responsive shared layout.
- Home page.
- Product listing page.
- Product detail page.
- Cart sidebar.
- Wishlist behavior.
- Checkout UI.
- Login UI.
- Registration UI.
- Mock frontend auth.
- Mock product catalog.
- localStorage-backed cart/wishlist/auth persistence.
- PWA configuration.
- Frontend lint/build health.
- Express backend scaffold.
- Backend security and core middleware.
- Auth API code.
- Product API code.
- Category API code.
- Order API code.
- Payment API code.
- Prisma schema.
- Prisma seed script.
- Prisma 7 compatibility setup.
- Backend boot health.

Partially done:

- Frontend/backend integration. The frontend still reads mock data and uses mock auth/order flows.
- Database setup. Prisma schema exists, but the active database does not have tables yet.
- Razorpay flow. Backend verification code exists, but frontend checkout does not call it yet.
- Email flow. Backend service and order confirmation hook exist, but end-to-end validation depends on real env credentials and database data.
- Admin product management. Backend endpoints exist, but no admin frontend dashboard exists.

Not done yet:

- Applying database schema/migrations to the configured database.
- Running seed data against the configured database.
- Connecting frontend product listing/detail to backend APIs.
- Connecting frontend login/register to backend auth APIs.
- Connecting checkout to backend order creation.
- Connecting Razorpay client-side payment flow.
- Building user account and my orders pages.
- Building admin dashboard/product/order management UI.
- Full integration tests.
- Production deployment configuration.
- Final image/content replacement with real product photography.
- Audit and resolution of npm security warnings.

## Immediate Next Steps

Recommended order:

1. Confirm the configured `DATABASE_URL` points to a safe development database.
2. Apply the Prisma schema with `prisma db push` or migrations.
3. Run the seed script.
4. Re-test `GET /api/products`.
5. Create frontend API service layer.
6. Replace mock product data with React Query calls.
7. Replace mock auth with backend login/register.
8. Replace mock checkout with order creation and Razorpay flow.
9. Add my orders and admin screens.
10. Add integration tests for auth, products, checkout, and payment verification.

## Current Project Health

Overall status: frontend prototype complete, backend API scaffold bootable, integration pending.

The website is at the transition point between Phase 3 and Phase 4:

- Phase 2 frontend work is substantially complete as a mock-data storefront.
- Phase 3 backend code is substantially written and starts successfully.
- Phase 4 integration has not truly started because the frontend still uses mock data and the database schema is not yet applied.

