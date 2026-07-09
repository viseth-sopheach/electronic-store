// POST /api/categories  (admin only)
export default defineEventHandler(async (event) => {
  requireRole(event, ['admin'])

  const body = await readBody(event)
  const name = (body?.name || '').trim()
  if (!name) {
    throw createError({ statusCode: 400, statusMessage: 'Category name is required.' })
  }

  return prisma.category.create({ data: { name } })
})
