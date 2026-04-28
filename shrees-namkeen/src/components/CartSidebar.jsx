import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, X, Plus, Minus } from 'lucide-react';
import { useCart } from '../context/useCart';

/**
 * CartSidebar — Slide-in cart drawer.
 *
 * Consumes all state from CartContext. Uses useNavigate for
 * "Start Shopping" and "Proceed to Checkout" actions.
 * updateQuantity uses absolute quantity (roadmap API).
 */
const CartSidebar = () => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    cartCount,
    cartTotal,
    shippingCost,
    finalTotal,
    updateQuantity,
    removeFromCart,
  } = useCart();

  const navigate = useNavigate();

  return (
    <>
      {/* ── Cart Drawer ── */}
      <div
        className={`fixed top-0 right-0 h-full w-full md:w-96 bg-white shadow-2xl z-50 transform transition-transform duration-300 ${
          isCartOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-orange-600 to-red-600 text-white">
            <h2 className="text-2xl font-bold">
              Shopping Cart ({cartCount})
            </h2>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Items */}
          <div className="flex-1 overflow-y-auto p-6">
            {cart.length === 0 ? (
              <div className="text-center py-16">
                <ShoppingCart
                  size={64}
                  className="mx-auto mb-4 text-gray-300"
                />
                <p className="text-xl text-gray-500 mb-2">
                  Your cart is empty
                </p>
                <p className="text-sm text-gray-400 mb-6">
                  Add some delicious namkeen!
                </p>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    navigate('/products');
                  }}
                  className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-all"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {cart.map((item) => (
                  <div
                    key={item.cartId}
                    className="flex gap-4 bg-orange-50 p-4 rounded-xl"
                  >
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-bold text-orange-900">
                        {item.product.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {item.variant.weight}
                      </p>
                      <p className="text-lg font-bold text-orange-600 mt-1">
                        ₹{item.variant.price}
                      </p>

                      <div className="flex items-center gap-3 mt-2">
                        <button
                          onClick={() =>
                            updateQuantity(item.cartId, item.quantity - 1)
                          }
                          className="p-1 bg-orange-200 rounded hover:bg-orange-300 transition-colors"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="font-bold">{item.quantity}</span>
                        <button
                          onClick={() =>
                            updateQuantity(item.cartId, item.quantity + 1)
                          }
                          className="p-1 bg-orange-200 rounded hover:bg-orange-300 transition-colors"
                        >
                          <Plus size={16} />
                        </button>
                        <button
                          onClick={() => removeFromCart(item.cartId)}
                          className="ml-auto text-red-600 hover:text-red-700 text-sm font-semibold"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Totals & Checkout */}
          {cart.length > 0 && (
            <div className="border-t p-6 bg-gradient-to-br from-orange-50 to-red-50">
              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-lg">
                  <span className="text-gray-700">Subtotal:</span>
                  <span className="font-bold text-orange-900">
                    ₹{cartTotal}
                  </span>
                </div>
                <div className="flex justify-between text-lg">
                  <span className="text-gray-700">Shipping:</span>
                  <span
                    className={`font-bold ${
                      shippingCost === 0 ? 'text-green-600' : 'text-orange-900'
                    }`}
                  >
                    {shippingCost === 0 ? 'FREE' : `₹${shippingCost}`}
                  </span>
                </div>
                {cartTotal < 999 && (
                  <p className="text-sm text-orange-600 bg-orange-100 p-2 rounded-lg">
                    Add ₹{999 - cartTotal} more for free shipping!
                  </p>
                )}
                <div className="flex justify-between text-2xl border-t pt-3">
                  <span className="font-bold text-orange-900">Total:</span>
                  <span className="font-bold text-orange-600">
                    ₹{finalTotal}
                  </span>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  navigate('/checkout');
                }}
                className="w-full bg-gradient-to-r from-orange-600 to-red-600 text-white py-4 rounded-xl font-bold text-lg hover:from-orange-700 hover:to-red-700 transition-all hover:shadow-xl transform hover:scale-105"
              >
                Proceed to Checkout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── Backdrop Overlay ── */}
      {isCartOpen && (
        <div
          onClick={() => setIsCartOpen(false)}
          className="fixed inset-0 bg-black/50 z-40"
        />
      )}
    </>
  );
};

export default CartSidebar;
