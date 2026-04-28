module.exports = {
  jwt: {
    secret:        process.env.JWT_SECRET        || 'fallback-secret',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'fallback-refresh-secret',
    expire:        process.env.JWT_EXPIRE         || '7d',
    refreshExpire: process.env.JWT_REFRESH_EXPIRE || '30d',
  },
  email: {
    host:   process.env.EMAIL_HOST  || 'smtp.gmail.com',
    port:   parseInt(process.env.EMAIL_PORT || '587'),
    user:   process.env.EMAIL_USER,
    pass:   process.env.EMAIL_PASS,
    from:   process.env.EMAIL_FROM  || 'noreply@shreesnamkeen.com',
  },
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  },
  upload: {
    maxFileSizeMB: 5,
    allowedTypes:  ['image/jpeg', 'image/png', 'image/webp'],
  },
  shipping: {
    freeThreshold: 500,   // orders above ₹500 = free shipping
    charge:        60,    // ₹60 flat for orders below threshold
  },
};
