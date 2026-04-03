import { createBrowserRouter } from 'react-router-dom';
import Layout from './components/layout/Layout';

// Pages
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CheckoutPage from './pages/CheckoutPage';

/**
 * Application router using createBrowserRouter (data router API).
 *
 * All routes are nested under <Layout> which provides the shared
 * Header, Footer, CartSidebar, and Notification chrome.
 *
 * Route map:
 *   /              → Home page
 *   /products      → Product listing (?category= & ?q= params)
 *   /products/:id  → Single product detail
 *   /login         → Login form
 *   /register      → Registration form
 *   /checkout      → Checkout with delivery address
 *   *              → 404 fallback
 */
export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'products', element: <Products /> },
      { path: 'products/:id', element: <ProductDetail /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <RegisterPage /> },
      { path: 'checkout', element: <CheckoutPage /> },
      {
        path: '*',
        element: (
          <div className="py-32 text-center">
            <h1 className="text-5xl font-bold text-orange-900 mb-4">404</h1>
            <p className="text-xl text-gray-600 mb-8">Page not found</p>
            <a href="/" className="text-orange-600 hover:text-orange-700 font-semibold">
              ← Go Home
            </a>
          </div>
        ),
      },
    ],
  },
]);
