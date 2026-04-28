const bcrypt = require('bcrypt');
const prisma = require('../config/database');
const { generateToken, generateRefreshToken } = require('../utils/helpers');

// ── Register ────────────────────────────────────────────────────────────────
const register = async (req, res, next) => {
  try {
    const { name, email, password, phone } = req.body;

    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) {
      return res.status(409).json({ success: false, message: 'Email already registered.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword, phone },
      select: { id: true, name: true, email: true, phone: true, role: true, createdAt: true },
    });

    const token = generateToken(user.id);
    res.status(201).json({ success: true, message: 'Account created successfully.', token, user });
  } catch (err) {
    next(err);
  }
};

// ── Login ───────────────────────────────────────────────────────────────────
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    if (!user.isActive) {
      return res.status(403).json({ success: false, message: 'Account is deactivated.' });
    }

    const token = generateToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    const { password: _, ...safeUser } = user;

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    res.json({ success: true, message: 'Login successful.', token, user: safeUser });
  } catch (err) {
    next(err);
  }
};

// ── Get Me ──────────────────────────────────────────────────────────────────
const getMe = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true, name: true, email: true, phone: true,
        role: true, emailVerified: true, createdAt: true,
        addresses: true,
        _count: { select: { orders: true } },
      },
    });
    res.json({ success: true, user });
  } catch (err) {
    next(err);
  }
};

// ── Update Profile ───────────────────────────────────────────────────────────
const updateProfile = async (req, res, next) => {
  try {
    const { name, phone } = req.body;
    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: { name, phone },
      select: { id: true, name: true, email: true, phone: true },
    });
    res.json({ success: true, message: 'Profile updated.', user });
  } catch (err) {
    next(err);
  }
};

// ── Change Password ──────────────────────────────────────────────────────────
const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Current password is incorrect.' });
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({ where: { id: req.user.id }, data: { password: hashed } });

    res.json({ success: true, message: 'Password changed successfully.' });
  } catch (err) {
    next(err);
  }
};

// ── Logout ──────────────────────────────────────────────────────────────────
const logout = (req, res) => {
  res.clearCookie('refreshToken');
  res.json({ success: true, message: 'Logged out.' });
};

module.exports = { register, login, getMe, updateProfile, changePassword, logout };
