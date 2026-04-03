# Shree's Namkeen E-Commerce Platform

![Shree's Namkeen Hero](https://images.pexels.com/photos/101533/pexels-photo-101533.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2)

Welcome to **Shree's Namkeen**, an authentic Indian snacks e-commerce platform built with modern web technologies. This application provides a seamless, fast, and beautiful shopping experience for customers looking to buy traditional namkeen, sweets, and snacks.

## ✨ Features

- **Modern Shopping Experience:** Browse a curated selection of authentic snacks with beautiful imagery and detailed descriptions.
- **Robust Cart & Checkout:** Add to cart, adjust quantities, see instant subtotals, and proceed to a mock checkout.
- **Wishlist:** Save your favorite items for later.
- **Authentication:** Mock login and registration flows.
- **Responsive Design:** Optimized for mobile, tablet, and desktop viewing.
- **Progressive Web App (PWA):** Installable on devices for a native-like experience with offline caching.
- **Search & Filtering:** Debounced search and category filtering to quickly find products.

## 🛠️ Tech Stack

- **Framework:** React 19 + Vite
- **Routing:** React Router v6 (`createBrowserRouter`)
- **Styling:** Tailwind CSS v4 + Vanilla CSS (for custom keyframes/fonts)
- **Icons:** Lucide React
- **State Management:** React Context API (`CartContext`, `AuthContext`)
- **Data Fetching/Caching:** TanStack React Query v5
- **Notifications:** React Hot Toast
- **PWA:** `vite-plugin-pwa` (Workbox)

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

1. **Clone the repository** (if applicable) or navigate to the project directory:
   ```bash
   cd shrees-namkeen
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to `http://localhost:5173` to view the application.

## 📦 Build for Production

To create an optimized production build:

```bash
npm run build
```

You can preview the production build locally using:
```bash
npm run preview
```

## 🏗️ Project Structure Highlights

- **`/src/components`**: Reusable UI elements (Header, Footer, ProductCard, CartSidebar).
- **`/src/pages`**: View-level components mapped to specific routes (Home, Products, ProductDetail, Checkout, etc.).
- **`/src/context`**: Global state management providers.
- **`/src/data`**: Mock database / static data (products, categories).

## 📄 Documentation

For a deep dive into the frontend architecture, state flows, and component organization, please refer to the [FRONTEND_DOCUMENTATION.md](./FRONTEND_DOCUMENTATION.md) file.
