const prisma = require('../config/database');
const { slugify } = require('../utils/helpers');

// ── Get All Products (with filtering, pagination, sorting) ─────────────────
const getAllProducts = async (req, res, next) => {
  try {
    const {
      page = 1, limit = 12, category, search,
      sort = 'createdAt', order = 'desc',
      minPrice, maxPrice, featured,
    } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = { isActive: true };

    if (category) {
      where.category = { slug: category };
    }
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (featured === 'true') {
      where.isFeatured = true;
    }
    if (minPrice || maxPrice) {
      where.variants = {
        some: {
          isActive: true,
          price: {
            ...(minPrice && { gte: parseFloat(minPrice) }),
            ...(maxPrice && { lte: parseFloat(maxPrice) }),
          },
        },
      };
    }

    const orderBy = {};
    const validSortFields = ['createdAt', 'name'];
    if (validSortFields.includes(sort)) {
      orderBy[sort] = order === 'asc' ? 'asc' : 'desc';
    } else {
      orderBy.createdAt = 'desc';
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: parseInt(limit),
        orderBy,
        include: {
          category: { select: { name: true, slug: true } },
          variants: { where: { isActive: true }, orderBy: { price: 'asc' } },
          _count: { select: { reviews: true } },
        },
      }),
      prisma.product.count({ where }),
    ]);

    res.json({
      success: true,
      products,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (err) {
    next(err);
  }
};

// ── Get Single Product by Slug ──────────────────────────────────────────────
const getProduct = async (req, res, next) => {
  try {
    const product = await prisma.product.findUnique({
      where: { slug: req.params.slug },
      include: {
        category: true,
        variants: { where: { isActive: true }, orderBy: { price: 'asc' } },
        reviews: {
          where: { isApproved: true },
          include: { user: { select: { name: true } } },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
        _count: { select: { reviews: true } },
      },
    });

    if (!product || !product.isActive) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    // Calculate average rating
    const ratings = product.reviews.map((r) => r.rating);
    const avgRating = ratings.length ? ratings.reduce((a, b) => a + b, 0) / ratings.length : 0;

    res.json({ success: true, product: { ...product, avgRating: parseFloat(avgRating.toFixed(1)) } });
  } catch (err) {
    next(err);
  }
};

// ── Create Product (Admin) ──────────────────────────────────────────────────
const createProduct = async (req, res, next) => {
  try {
    const { name, description, shortDesc, categoryId, variants, isFeatured } = req.body;
    const images = req.files?.map((f) => f.path) || req.body.images || [];

    const product = await prisma.product.create({
      data: {
        name,
        slug: slugify(name),
        description,
        shortDesc,
        categoryId,
        isFeatured: isFeatured === 'true' || isFeatured === true,
        images,
        variants: {
          create: (typeof variants === 'string' ? JSON.parse(variants) : variants).map((v) => ({
            weight: v.weight,
            price: parseFloat(v.price),
            mrp: parseFloat(v.mrp),
            stock: parseInt(v.stock) || 0,
            sku: v.sku || `${slugify(name)}-${v.weight}`.toUpperCase(),
          })),
        },
      },
      include: { variants: true, category: true },
    });

    res.status(201).json({ success: true, message: 'Product created.', product });
  } catch (err) {
    next(err);
  }
};

// ── Update Product (Admin) ──────────────────────────────────────────────────
const updateProduct = async (req, res, next) => {
  try {
    const { name, description, shortDesc, categoryId, isFeatured, isActive } = req.body;
    const images = req.files?.map((f) => f.path);

    const data = { description, shortDesc, categoryId };
    if (name) { data.name = name; data.slug = slugify(name); }
    if (images?.length) data.images = images;
    if (isFeatured !== undefined) data.isFeatured = isFeatured === 'true' || isFeatured === true;
    if (isActive !== undefined)  data.isActive  = isActive  === 'true' || isActive  === true;

    const product = await prisma.product.update({
      where: { id: req.params.id },
      data,
      include: { variants: true, category: true },
    });

    res.json({ success: true, message: 'Product updated.', product });
  } catch (err) {
    next(err);
  }
};

// ── Delete Product (Admin) ──────────────────────────────────────────────────
const deleteProduct = async (req, res, next) => {
  try {
    await prisma.product.update({
      where: { id: req.params.id },
      data: { isActive: false },
    });
    res.json({ success: true, message: 'Product deactivated.' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAllProducts, getProduct, createProduct, updateProduct, deleteProduct };
