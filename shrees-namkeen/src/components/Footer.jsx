import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, MessageCircle } from 'lucide-react';

/**
 * Footer — Site-wide footer. Uses <Link> for internal navigation.
 * No props — fully self-contained.
 */
const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-orange-900 via-red-900 to-orange-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-bold mb-4 text-yellow-300">
              SHREE'S NAMKEEN
            </h3>
            <p
              className="text-orange-200 mb-4"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              Authentic Indian snacks made with tradition and love since 1985.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-4 text-yellow-300">
              Quick Links
            </h4>
            <ul
              className="space-y-2 text-orange-200"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              <li>
                <Link
                  to="/"
                  className="hover:text-yellow-300 transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/products"
                  className="hover:text-yellow-300 transition-colors"
                >
                  Our Products
                </Link>
              </li>
              <li>
                <a href="#" className="hover:text-yellow-300 transition-colors">
                  Track Order
                </a>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-lg font-bold mb-4 text-yellow-300">
              Customer Service
            </h4>
            <ul
              className="space-y-2 text-orange-200"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              <li>
                <a href="#" className="hover:text-yellow-300 transition-colors">
                  Shipping Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-yellow-300 transition-colors">
                  Return Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-yellow-300 transition-colors">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-bold mb-4 text-yellow-300">
              Contact Info
            </h4>
            <ul
              className="space-y-3 text-orange-200"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              <li className="flex items-start gap-2">
                <MapPin size={20} className="flex-shrink-0 mt-1" />
                <span>Mumbai, Maharashtra, India</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={20} />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={20} />
                <span>info@shreesnamkeen.com</span>
              </li>
              <li className="flex items-center gap-2">
                <MessageCircle size={20} />
                <a
                  href="https://wa.me/919876543210"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-yellow-300 transition-colors"
                >
                  WhatsApp Us
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div
          className="border-t border-orange-700 mt-8 pt-8 text-center text-orange-300"
          style={{ fontFamily: "'Montserrat', sans-serif" }}
        >
          <p>
            © 2026 Shree's Namkeen. All rights reserved. Made with ❤️ in India
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
