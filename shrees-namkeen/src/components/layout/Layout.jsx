import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../Header';
import Footer from '../Footer';
import CartSidebar from '../CartSidebar';
import Notification from '../Notification';

/**
 * Layout — Shared shell rendered around every page via react-router's <Outlet>.
 *
 * Composes the persistent chrome (Notification, Header, CartSidebar, Footer)
 * that wraps all page-level content. All context is consumed by the child
 * components directly — no prop-drilling through Layout.
 */
const Layout = () => {
  return (
    <div
      className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50"
      style={{ fontFamily: "'Playfair Display', 'Georgia', serif" }}
    >
      <Notification />
      <Header />

      {/* Page content renders here */}
      <Outlet />

      <CartSidebar />
      <Footer />
    </div>
  );
};

export default Layout;
