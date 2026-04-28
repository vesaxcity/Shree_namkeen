import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, Phone, Loader2, ShoppingBag } from 'lucide-react';
import { useAuth } from '../context/useAuth';
import toast from 'react-hot-toast';

/**
 * RegisterPage — New account creation form.
 *
 * Collects name, email, phone, and password with confirmation.
 * Validates locally before calling AuthContext.register().
 */
const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (field) => (e) =>
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.password) {
      toast.error('Please fill in all required fields');
      return;
    }
    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setIsLoading(true);
    try {
      await register({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
      });
      toast.success("Account created! Welcome to Shree's Namkeen \uD83C\uDF89");
      navigate('/');
    } catch {
      toast.error('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Reusable labelled input helper
  const Field = ({ label, icon, type = 'text', field, placeholder, required = false, suffix }) => (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        {React.createElement(icon, {
          size: 18,
          className: 'absolute left-4 top-1/2 -translate-y-1/2 text-gray-400',
        })}
        <input
          type={type}
          placeholder={placeholder}
          value={formData[field]}
          onChange={handleChange(field)}
          required={required}
          className="w-full pl-11 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all"
          style={{ fontFamily: "'Montserrat', sans-serif" }}
        />
        {suffix && (
          <button
            type="button"
            onClick={suffix.toggle}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            {suffix.show ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center py-16 px-4">
      <div className="w-full max-w-md">

        {/* ── Card ── */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">

          {/* Header Banner */}
          <div className="bg-gradient-to-r from-orange-600 via-red-600 to-orange-700 p-8 text-white text-center">
            <div className="flex justify-center mb-3">
              <ShoppingBag size={48} className="text-yellow-300" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight">
              Create Account
            </h1>
            <p className="text-orange-100 mt-2" style={{ fontFamily: "'Montserrat', sans-serif" }}>
              Join Shree's Namkeen family today!
            </p>
          </div>

          {/* Form */}
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-5">

              <Field label="Full Name" icon={User} field="name" placeholder="Rahul Sharma" required />
              <Field label="Email Address" icon={Mail} type="email" field="email" placeholder="you@example.com" required />
              <Field label="Phone Number" icon={Phone} type="tel" field="phone" placeholder="+91 98765 43210" />

              <Field
                label="Password"
                icon={Lock}
                type={showPassword ? 'text' : 'password'}
                field="password"
                placeholder="Min. 6 characters"
                required
                suffix={{ show: showPassword, toggle: () => setShowPassword(!showPassword) }}
              />

              <Field
                label="Confirm Password"
                icon={Lock}
                type={showConfirm ? 'text' : 'password'}
                field="confirmPassword"
                placeholder="Re-enter password"
                required
                suffix={{ show: showConfirm, toggle: () => setShowConfirm(!showConfirm) }}
              />

              {/* Terms */}
              <p
                className="text-xs text-gray-500 text-center"
                style={{ fontFamily: "'Montserrat', sans-serif" }}
              >
                By creating an account, you agree to our{' '}
                <a href="#" className="text-orange-600 hover:underline">Terms of Service</a>
                {' '}and{' '}
                <a href="#" className="text-orange-600 hover:underline">Privacy Policy</a>.
              </p>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-orange-600 to-red-600 text-white py-4 rounded-xl font-bold text-lg hover:from-orange-700 hover:to-red-700 transition-all hover:shadow-xl transform hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  'Create Account'
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 border-t border-gray-200" />
              <span className="text-sm text-gray-400" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                Already have an account?
              </span>
              <div className="flex-1 border-t border-gray-200" />
            </div>

            <Link
              to="/login"
              className="block w-full text-center py-4 border-2 border-orange-600 text-orange-600 rounded-xl font-bold text-lg hover:bg-orange-50 transition-all"
            >
              Sign In
            </Link>
          </div>
        </div>

        <div className="text-center mt-6">
          <Link
            to="/products"
            className="text-orange-700 hover:text-orange-900 font-semibold transition-colors"
            style={{ fontFamily: "'Montserrat', sans-serif" }}
          >
            ← Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
