/**
 * Admin guard — must be used AFTER the protect middleware.
 * Rejects non-admin users with 403.
 */
const requireAdmin = (req, res, next) => {
  if (req.user?.role !== 'ADMIN') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Admin privileges required.',
    });
  }
  next();
};

module.exports = { requireAdmin };
