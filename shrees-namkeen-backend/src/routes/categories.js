const express = require('express');
const prisma = require('../config/database');

const router = express.Router();

// GET /api/categories — list all active categories with product count
router.get('/', async (req, res, next) => {
  try {
    const categories = await prisma.category.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
      include: {
        _count: { select: { products: { where: { isActive: true } } } },
      },
    });
    res.json({ success: true, categories });
  } catch (err) {
    next(err);
  }
});

// GET /api/categories/:slug — single category with its products
router.get('/:slug', async (req, res, next) => {
  try {
    const category = await prisma.category.findUnique({
      where: { slug: req.params.slug },
      include: {
        products: {
          where: { isActive: true },
          include: {
            variants: { where: { isActive: true }, orderBy: { price: 'asc' } },
          },
        },
      },
    });
    if (!category) return res.status(404).json({ success: false, message: 'Category not found.' });
    res.json({ success: true, category });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
