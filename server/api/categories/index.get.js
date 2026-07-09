// GET /api/categories (public — needed to build the filter dropdown)
export default defineEventHandler(async () => {
  return prisma.category.findMany({ orderBy: { name: 'asc' } })
})
