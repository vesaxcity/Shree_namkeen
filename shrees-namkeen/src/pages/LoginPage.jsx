import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, Loader2, ShoppingBag } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

/**
 * LoginPage — Mock authentication login form.
 *
 * On successful login, redirects to the page the user was trying to
 * access (or home). Uses react-hot-toast for feedback and AuthContext
 * for the actual login logic.
 */
const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    try {
      await login(email, password);
      toast.success('Welcome back! 🎉');
      navigate('/');
    } catch (err) {
      toast.error('Invalid credentials. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

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
              Welcome Back!
            </h1>
            <p className="text-orange-100 mt-2" style={{ fontFamily: "'Montserrat', sans-serif" }}>
              Sign in to your Shree's Namkeen account
            </p>
          </div>

          {/* Form */}
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all"
                    style={{ fontFamily: "'Montserrat', sans-serif" }}
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-11 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all"
                    style={{ fontFamily: "'Montserrat', sans-serif" }}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Forgot Password */}
              <div className="text-right">
                <a
                  href="#"
                  className="text-sm text-orange-600 hover:text-orange-700 font-semibold transition-colors"
                  style={{ fontFamily: "'Montserrat', sans-serif" }}
                >
                  Forgot password?
                </a>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-orange-600 to-red-600 text-white py-4 rounded-xl font-bold text-lg hover:from-orange-700 hover:to-red-700 transition-all hover:shadow-xl transform hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 border-t border-gray-200" />
              <span
                className="text-sm text-gray-400"
                style={{ fontFamily: "'Montserrat', sans-serif" }}
              >
                New here?
              </span>
              <div className="flex-1 border-t border-gray-200" />
            </div>

            {/* Register Link */}
            <Link
              to="/register"
              className="block w-full text-center py-4 border-2 border-orange-600 text-orange-600 rounded-xl font-bold text-lg hover:bg-orange-50 transition-all"
            >
              Create an Account
            </Link>
          </div>
        </div>

        {/* Back to shopping */}
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

export default LoginPage;
