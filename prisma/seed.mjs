// Run with: npm run db:seed
// Creates one admin user + a couple of categories/products so you have
// something to look at right away.
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const adminPassword = await bcrypt.hash('admin123', 10)

  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      name: 'Store Admin',
      email: 'admin@example.com',
      password: adminPassword,
      role: 'admin'
    }
  })
  console.log('Admin user ready:', admin.email, '(password: admin123)')

  const phones = await prisma.category.upsert({
    where: { name: 'Phones' },
    update: {},
    create: { name: 'Phones' }
  })
  const laptops = await prisma.category.upsert({
    where: { name: 'Laptops' },
    update: {},
    create: { name: 'Laptops' }
  })

  await prisma.product.createMany({
    data: [
      {
        name: 'Nova Phone 12',
        description: 'A reliable mid-range smartphone with a great camera.',
        price: 499.99,
        image: 'https://placehold.co/400x400?text=Nova+Phone',
        stock: 25,
        categoryId: phones.id
      },
      {
        name: 'Aero Laptop 14"',
        description: 'Light, fast, and great for everyday work.',
        price: 899.0,
        image: 'https://placehold.co/400x400?text=Aero+Laptop',
        stock: 12,
        categoryId: laptops.id
      }
    ],
    skipDuplicates: true
  })

  console.log('Seed complete.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
