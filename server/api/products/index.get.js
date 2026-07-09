export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const search = (query.search || '').toString().trim()
  const categoryId = query.categoryId ? Number(query.categoryId) : null

  const products = await prisma.product.findMany({
    where: {
      AND: [
        search
          ? {
              OR: [
                { name: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } }
              ]
            }
          : {},
        categoryId ? { categoryId } : {}
      ]
    },
    include: { category: true },
    orderBy: { createdAt: 'desc' }
  })

  return products
})
