const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // ── Admin User ─────────────────────────────────────────────────────────────
  const adminPassword = await bcrypt.hash('Admin@123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@shreesnamkeen.com' },
    update: {},
    create: {
      name: 'Admin',
      email: 'admin@shreesnamkeen.com',
      password: adminPassword,
      role: 'ADMIN',
      emailVerified: true,
      phone: '9999999999',
    },
  });
  console.log(`✅ Admin user: ${admin.email}`);

  // ── Categories ─────────────────────────────────────────────────────────────
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'sev-varieties' },
      update: {},
      create: {
        name: 'Sev Varieties',
        slug: 'sev-varieties',
        description: 'Crispy & flavourful sev in various thickness and masala levels',
        sortOrder: 1,
      },
    }),
    prisma.category.upsert({
      where: { slug: 'mixture-namkeen' },
      update: {},
      create: {
        name: 'Mixture & Namkeen',
        slug: 'mixture-namkeen',
        description: 'Classic Indian namkeen mixtures perfect for snacking',
        sortOrder: 2,
      },
    }),
    prisma.category.upsert({
      where: { slug: 'seasonal-specials' },
      update: {},
      create: {
        name: 'Seasonal Specials',
        slug: 'seasonal-specials',
        description: 'Limited edition seasonal favourites made fresh to order',
        sortOrder: 3,
      },
    }),
  ]);
  console.log(`✅ ${categories.length} categories seeded`);

  // ── Products ───────────────────────────────────────────────────────────────
  const [sevCat, mixCat, seasonalCat] = categories;

  const products = [
    {
      name: 'Ratlami Sev',
      slug: 'ratlami-sev',
      description:
        'Authentic Ratlami Sev made with the finest chickpea flour, seasoned with traditional spices including cloves and black pepper. A classic Madhya Pradesh delicacy.',
      shortDesc: 'Classic spicy sev from Ratlam with bold clove & pepper notes',
      isFeatured: true,
      categoryId: sevCat.id,
      images: [],
      variants: [
        { weight: '250g', price: 80, mrp: 95, stock: 100 },
        { weight: '500g', price: 150, mrp: 180, stock: 75 },
        { weight: '1kg', price: 280, mrp: 330, stock: 50 },
      ],
    },
    {
      name: 'Indori Mixture',
      slug: 'indori-mixture',
      description:
        'A beloved Indori snack mix featuring poha, sev, peanuts, and aromatic spices. This iconic namkeen captures the true spirit of Indore\'s street food culture.',
      shortDesc: 'The iconic Indore-style snack mix with poha, sev & spices',
      isFeatured: true,
      categoryId: mixCat.id,
      images: [],
      variants: [
        { weight: '250g', price: 90, mrp: 110, stock: 120 },
        { weight: '500g', price: 170, mrp: 200, stock: 80 },
        { weight: '1kg', price: 320, mrp: 380, stock: 60 },
      ],
    },
    {
      name: 'Diwali Special Mixture',
      slug: 'diwali-special-mixture',
      description:
        'A festive blend crafted specially for Diwali – loaded with dry fruits, premium cashews, almonds, and crispy sev. A perfect gift for the season of lights.',
      shortDesc: 'Festive premium mix with dry fruits, cashews & almonds',
      isFeatured: false,
      categoryId: seasonalCat.id,
      images: [],
      variants: [
        { weight: '500g', price: 250, mrp: 300, stock: 40 },
        { weight: '1kg', price: 480, mrp: 560, stock: 25 },
      ],
    },
  ];

  for (const p of products) {
    const { variants, ...productData } = p;
    const product = await prisma.product.upsert({
      where: { slug: productData.slug },
      update: {},
      create: {
        ...productData,
        variants: {
          create: variants.map((v, i) => ({
            ...v,
            sku: `${productData.slug.toUpperCase()}-${v.weight}`,
          })),
        },
      },
    });
    console.log(`✅ Product: ${product.name}`);
  }

  console.log('\n🎉 Database seeded successfully!');
  console.log('\nAdmin credentials:');
  console.log('  Email   : admin@shreesnamkeen.com');
  console.log('  Password: Admin@123');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
