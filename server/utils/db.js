// A single, shared Prisma Client instance.
// Nuxt "server/utils" files are auto-imported, so anywhere in server/api
// you can just call `prisma.product.findMany()` without importing anything.
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}
