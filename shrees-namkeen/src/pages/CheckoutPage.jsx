import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  MapPin, Phone, User, Mail, CreditCard, Truck,
  ChevronRight, ShieldCheck, Loader2, Package,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

/**
 * CheckoutPage — Delivery address + order summary form.
 *
 * Pre-filled with Farrukhabad, Uttar Pradesh as the default city
 * (the business's primary delivery area, per project context).
 * On submit, clears the cart and navigates to order confirmation.
 * TODO (Phase 3): POST order to /api/orders and integrate Razorpay.
 */
const CheckoutPage = () => {
  const { cart, cartTotal, shippingCost, finalTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: 'Farrukhabad',
    state: 'Uttar Pradesh',
    pincode: '',
    landmark: '',
    paymentMethod: 'cod', // cash on delivery default
  });
  const [isPlacing, setIsPlacing] = useState(false);

  const handleChange = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();

    const required = ['fullName', 'email', 'phone', 'addressLine1', 'city', 'state', 'pincode'];
    for (const field of required) {
      if (!form[field]?.trim()) {
        toast.error(`Please fill in: ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
        return;
      }
    }
    if (cart.length === 0) {
      toast.error('Your cart is empty!');
      return;
    }

    setIsPlacing(true);
    try {
      // TODO (Phase 3): await api.post('/orders', { items: cart, address: form, total: finalTotal })
      await new Promise((res) => setTimeout(res, 1500)); // mock network delay
      clearCart();
      toast.success('Order placed successfully! 🎉');
      navigate('/');
    } catch {
      toast.error('Failed to place order. Please try again.');
    } finally {
      setIsPlacing(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="py-32 text-center">
        <Package size={64} className="mx-auto mb-4 text-gray-300" />
        <h2 className="text-3xl font-bold text-orange-900 mb-2">Your cart is empty</h2>
        <p className="text-gray-600 mb-6" style={{ fontFamily: "'Montserrat', sans-serif" }}>
          Add some items before checking out.
        </p>
        <Link
          to="/products"
          className="inline-block bg-gradient-to-r from-orange-600 to-red-600 text-white px-8 py-3 rounded-xl font-bold hover:from-orange-700 hover:to-red-700 transition-all"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <section className="py-12 container mx-auto px-4">
      <h1 className="text-4xl font-bold text-orange-900 mb-8">Checkout</h1>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ── Left: Delivery Form ── */}
          <div className="lg:col-span-2 space-y-6">

            {/* Contact Info */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-orange-900 mb-5 flex items-center gap-2">
                <User size={20} className="text-orange-600" />
                Contact Information
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { label: 'Full Name *', field: 'fullName', icon: User, placeholder: 'Rahul Sharma' },
                  { label: 'Email Address *', field: 'email', icon: Mail, placeholder: 'rahul@example.com', type: 'email' },
                  { label: 'Phone Number *', field: 'phone', icon: Phone, placeholder: '+91 98765 43210', type: 'tel', colSpan: 'sm:col-span-2' },
                ].map(({ label, field, icon: Icon, placeholder, type = 'text', colSpan = '' }) => (
                  <div key={field} className={`${colSpan}`}>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>
                    <div className="relative">
                      <Icon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type={type}
                        placeholder={placeholder}
                        value={form[field]}
                        onChange={handleChange(field)}
                        className="w-full pl-9 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all"
                        style={{ fontFamily: "'Montserrat', sans-serif" }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery Address */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-orange-900 mb-5 flex items-center gap-2">
                <MapPin size={20} className="text-orange-600" />
                Delivery Address
              </h2>

              <div className="space-y-4">
                {/* Address Line 1 */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    House / Flat / Block No. *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 12A, Sadar Bazar, Near Clock Tower"
                    value={form.addressLine1}
                    onChange={handleChange('addressLine1')}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all"
                    style={{ fontFamily: "'Montserrat', sans-serif" }}
                  />
                </div>

                {/* Address Line 2 */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Locality / Area <span className="text-gray-400 font-normal">(optional)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Civil Lines, Mohalla Prem Nagar"
                    value={form.addressLine2}
                    onChange={handleChange('addressLine2')}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all"
                    style={{ fontFamily: "'Montserrat', sans-serif" }}
                  />
                </div>

                {/* City / State / Pincode */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">City *</label>
                    <input
                      type="text"
                      value={form.city}
                      onChange={handleChange('city')}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all"
                      style={{ fontFamily: "'Montserrat', sans-serif" }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">State *</label>
                    <select
                      value={form.state}
                      onChange={handleChange('state')}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all bg-white"
                      style={{ fontFamily: "'Montserrat', sans-serif" }}
                    >
                      {[
                        'Uttar Pradesh', 'Delhi', 'Maharashtra', 'Rajasthan',
                        'Madhya Pradesh', 'Gujarat', 'Punjab', 'Haryana',
                        'Bihar', 'West Bengal',
                      ].map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Pincode *</label>
                    <input
                      type="text"
                      placeholder="209625"
                      maxLength={6}
                      value={form.pincode}
                      onChange={handleChange('pincode')}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all"
                      style={{ fontFamily: "'Montserrat', sans-serif" }}
                    />
                  </div>
                </div>

                {/* Landmark */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Landmark <span className="text-gray-400 font-normal">(optional)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Near Rani Mahal, Opp. District Court"
                    value={form.landmark}
                    onChange={handleChange('landmark')}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all"
                    style={{ fontFamily: "'Montserrat', sans-serif" }}
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-orange-900 mb-5 flex items-center gap-2">
                <CreditCard size={20} className="text-orange-600" />
                Payment Method
              </h2>
              <div className="space-y-3">
                {[
                  { id: 'cod', label: 'Cash on Delivery', sub: 'Pay when your order arrives', icon: '💵' },
                  { id: 'upi', label: 'UPI / PhonePe / GPay', sub: 'Instant payment via UPI', icon: '📱' },
                  { id: 'card', label: 'Credit / Debit Card', sub: 'Visa, Mastercard, RuPay', icon: '💳' },
                ].map(({ id, label, sub, icon }) => (
                  <label
                    key={id}
                    className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      form.paymentMethod === id
                        ? 'border-orange-500 bg-orange-50'
                        : 'border-gray-200 hover:border-orange-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={id}
                      checked={form.paymentMethod === id}
                      onChange={handleChange('paymentMethod')}
                      className="accent-orange-600 w-4 h-4"
                    />
                    <span className="text-2xl">{icon}</span>
                    <div>
                      <p className="font-semibold text-gray-800">{label}</p>
                      <p className="text-sm text-gray-500" style={{ fontFamily: "'Montserrat', sans-serif" }}>{sub}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* ── Right: Order Summary ── */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
              <h2 className="text-xl font-bold text-orange-900 mb-5 flex items-center gap-2">
                <Package size={20} className="text-orange-600" />
                Order Summary
              </h2>

              {/* Items */}
              <div className="space-y-3 max-h-64 overflow-y-auto mb-4">
                {cart.map((item) => (
                  <div key={item.cartId} className="flex items-center gap-3">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-14 h-14 object-cover rounded-lg flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 text-sm truncate">{item.product.name}</p>
                      <p className="text-xs text-gray-500" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                        {item.variant.weight} × {item.quantity}
                      </p>
                    </div>
                    <p className="font-bold text-orange-600 flex-shrink-0">
                      ₹{item.variant.price * item.quantity}
                    </p>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-sm" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold">₹{cartTotal}</span>
                </div>
                <div className="flex justify-between text-sm" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                  <span className="text-gray-600">Shipping</span>
                  <span className={`font-semibold ${shippingCost === 0 ? 'text-green-600' : ''}`}>
                    {shippingCost === 0 ? 'FREE' : `₹${shippingCost}`}
                  </span>
                </div>
                <div className="flex justify-between text-xl font-bold border-t pt-3 text-orange-900">
                  <span>Total</span>
                  <span>₹{finalTotal}</span>
                </div>
              </div>

              {/* Delivery Note */}
              <div className="flex items-start gap-2 mt-4 bg-orange-50 rounded-xl p-3">
                <Truck size={18} className="text-orange-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-orange-700" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                  Delivering freshly across <strong>Farrukhabad</strong> and surrounding areas. Expected: 1–3 business days.
                </p>
              </div>

              {/* Secure badge */}
              <div className="flex items-center justify-center gap-2 mt-3 text-xs text-gray-400" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                <ShieldCheck size={14} className="text-green-500" />
                <span>100% Secure & Encrypted</span>
              </div>

              {/* Place Order CTA */}
              <button
                type="submit"
                disabled={isPlacing}
                className="mt-6 w-full bg-gradient-to-r from-orange-600 to-red-600 text-white py-4 rounded-xl font-bold text-lg hover:from-orange-700 hover:to-red-700 transition-all hover:shadow-xl transform hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100 flex items-center justify-center gap-2"
              >
                {isPlacing ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Placing Order...
                  </>
                ) : (
                  <>
                    Place Order
                    <ChevronRight size={20} />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </form>
    </section>
  );
};

export default CheckoutPage;
