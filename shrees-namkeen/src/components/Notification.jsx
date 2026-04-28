import React from 'react';
import { useCart } from '../context/useCart';

/**
 * Notification — Fixed-position toast banner.
 * Consumes show/message from CartContext (no props).
 */
const Notification = () => {
  const { showNotification, notificationMessage } = useCart();

  if (!showNotification) return null;

  return (
    <div className="fixed top-24 right-4 z-50 bg-green-600 text-white px-6 py-3 rounded-lg shadow-2xl animate-slide-in">
      ✓ {notificationMessage}
    </div>
  );
};

export default Notification;
