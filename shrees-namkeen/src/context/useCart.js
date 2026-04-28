import { useContext } from 'react';
import { CartContext } from './cartContext';

/**
 * useCart — Access the global cart/wishlist/notification context.
 * Must be used within a <CartProvider>.
 */
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};
