const { validationResult } = require('express-validator');

/**
 * Global error handler.
 * Handles Prisma, JWT, validation, and generic errors uniformly.
 */
const errorHandler = (err, req, res, next) => {
  console.error('[ERROR]', err.message, err.stack ? `\n${err.stack}` : '');

  // express-validator errors (passed via next(errors))
  if (err.type === 'validation') {
    return res.status(400).json({ success: false, message: 'Validation failed', errors: err.errors });
  }

  // Prisma — Unique constraint violation
  if (err.code === 'P2002') {
    const field = err.meta?.target?.[0] || 'field';
    return res.status(409).json({ success: false, message: `${field} already exists.` });
  }

  // Prisma — Record not found
  if (err.code === 'P2025') {
    return res.status(404).json({ success: false, message: 'Record not found.' });
  }

  // JWT errors (shouldn't normally reach here, caught in auth.js, but just in case)
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ success: false, message: 'Invalid token.' });
  }
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ success: false, message: 'Token expired.' });
  }

  // Known HTTP errors (thrown with err.status)
  if (err.status) {
    return res.status(err.status).json({ success: false, message: err.message });
  }

  // Default 500
  return res.status(500).json({
    success: false,
    message: process.env.NODE_ENV === 'production' ? 'Internal server error.' : err.message,
  });
};

/**
 * Helper — run express-validator checks and forward errors to errorHandler
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const err = new Error('Validation failed');
    err.type = 'validation';
    err.errors = errors.array();
    return next(err);
  }
  next();
};

module.exports = { errorHandler, validate };
