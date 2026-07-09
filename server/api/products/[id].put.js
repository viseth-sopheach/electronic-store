export default defineEventHandler(async (event) => {
  requireRole(event, ['admin', 'staff'])

  const id = Number(getRouterParam(event, 'id'))
  const body = await readBody(event)
  const { name, description, price, image, stock, categoryId } = body || {}

  const product = await prisma.product.update({
    where: { id },
    data: {
      ...(name !== undefined ? { name: String(name).trim() } : {}),
      ...(description !== undefined ? { description: String(description) } : {}),
      ...(price !== undefined ? { price: Number(price) } : {}),
      ...(image !== undefined ? { image: String(image) } : {}),
      ...(stock !== undefined ? { stock: Number(stock) } : {}),
      ...(categoryId !== undefined ? { categoryId: categoryId ? Number(categoryId) : null } : {})
    }
  })

  return product
})
