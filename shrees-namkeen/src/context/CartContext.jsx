import { useState, useEffect, useCallback, useRef } from 'react';
import { CartContext } from './cartContext';

// ── localStorage helpers ──

const CART_KEY = 'shreesNamkeen_cart';
const WISHLIST_KEY = 'shreesNamkeen_wishlist';

const readStorage = (key, fallback) => {
  try {
    const stored = localStorage.getItem(key);
    return stored !== null ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
};

/**
 * CartProvider — Global provider for cart, wishlist, and notification state.
 *
 * Merges the logic previously split across useCart, useWishlist, and
 * useNotification hooks into a single context so any component in the
 * tree can consume cart/wishlist without prop-drilling.
 *
 * Both cart and wishlist are persisted to localStorage and will survive
 * page refreshes. When you're ready for MongoDB, replace the localStorage
 * reads/writes with API calls.
 */
export const CartProvider = ({ children }) => {
  // ═══════════ Cart State ═══════════
  const [cart, setCart] = useState(() => readStorage(CART_KEY, []));
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const timerRef = useRef(null);

  const showNotificationMessage = useCallback((message) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setNotificationMessage(message);
    setShowNotification(true);
    timerRef.current = setTimeout(() => {
      setShowNotification(false);
      timerRef.current = null;
    }, 2000);
  }, []);

  // Persist cart to localStorage on every change
  useEffect(() => {
    try { localStorage.setItem(CART_KEY, JSON.stringify(cart)); }
    catch (e) { console.warn('CartProvider: localStorage write failed', e); }
  }, [cart]);

  /**
   * Adds a product + variant to the cart.
   * Upserts: if the combination already exists, quantity increases by 1.
   */
  const addToCart = useCallback((product, variant, quantity = 1) => {
    const cartId = `${product.id}-${variant.id}`;
    setCart((prev) => {
      const existing = prev.find((item) => item.cartId === cartId);
      if (existing) {
        showNotificationMessage('Quantity updated in cart!');
        return prev.map((item) =>
          item.cartId === cartId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      showNotificationMessage('Added to cart!');
      return [...prev, { cartId, product, variant, quantity }];
    });
  }, [showNotificationMessage]);

  /** Removes an item from the cart entirely. */
  const removeFromCart = useCallback((cartId) => {
    setCart((prev) => prev.filter((item) => item.cartId !== cartId));
    showNotificationMessage('Removed from cart');
  }, [showNotificationMessage]);

  /**
   * Sets the quantity of a cart item to an absolute value.
   * If newQuantity ≤ 0 the item is removed.
   */
  const updateQuantity = useCallback((cartId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(cartId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.cartId === cartId ? { ...item, quantity: newQuantity } : item
      )
    );
  }, [removeFromCart]);

  /** Empties the entire cart. */
  const clearCart = useCallback(() => {
    setCart([]);
    showNotificationMessage('Cart cleared');
  }, [showNotificationMessage]);

  // ── Derived totals ──
  const cartTotal = cart.reduce((s, i) => s + i.variant.price * i.quantity, 0);
  const cartCount = cart.reduce((s, i) => s + i.quantity, 0);
  const shippingCost = cartTotal >= 999 ? 0 : 50;
  const finalTotal = cartTotal + shippingCost;

  // ═══════════ Wishlist State ═══════════
  const [wishlist, setWishlist] = useState(() => readStorage(WISHLIST_KEY, []));

  useEffect(() => {
    try { localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist)); }
    catch (e) { console.warn('CartProvider: wishlist localStorage write failed', e); }
  }, [wishlist]);

  /** Toggles a product in/out of the wishlist. */
  const toggleWishlist = useCallback((productId) => {
    setWishlist((prev) => {
      if (prev.includes(productId)) {
        showNotificationMessage('Removed from wishlist');
        return prev.filter((id) => id !== productId);
      }
      showNotificationMessage('Added to wishlist!');
      return [...prev, productId];
    });
  }, [showNotificationMessage]);

  // ═══════════ Value ═══════════
  const value = {
    // Cart
    cart,
    isCartOpen,
    setIsCartOpen,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartTotal,
    cartCount,
    shippingCost,
    finalTotal,
    // Wishlist
    wishlist,
    toggleWishlist,
    // Notifications
    showNotification,
    notificationMessage,
    showNotificationMessage,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
