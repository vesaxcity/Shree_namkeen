const jwt = require('jsonwebtoken');
const { jwt: jwtConfig, shipping } = require('../config/config');

/**
 * Generate a short-lived access token
 */
const generateToken = (id) =>
  jwt.sign({ id }, jwtConfig.secret, { expiresIn: jwtConfig.expire });

/**
 * Generate a long-lived refresh token
 */
const generateRefreshToken = (id) =>
  jwt.sign({ id }, jwtConfig.refreshSecret, { expiresIn: jwtConfig.refreshExpire });

/**
 * Generate a unique order number: SN-YYYYMMDD-XXXX
 */
const generateOrderNumber = () => {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `SN-${date}-${rand}`;
};

/**
 * Convert a string to a URL-friendly slug
 */
const slugify = (text) =>
  text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');

/**
 * Calculate shipping charge based on order subtotal
 */
const calculateShipping = (subtotal) =>
  subtotal >= shipping.freeThreshold ? 0 : shipping.charge;

/**
 * Estimate delivery date (3–5 business days from now)
 */
const estimateDelivery = () => {
  const date = new Date();
  date.setDate(date.getDate() + 5);
  return date;
};

/**
 * Build a standard success response
 */
const successResponse = (res, data, message = 'Success', statusCode = 200) =>
  res.status(statusCode).json({ success: true, message, ...data });

module.exports = {
  generateToken,
  generateRefreshToken,
  generateOrderNumber,
  slugify,
  calculateShipping,
  estimateDelivery,
  successResponse,
};
