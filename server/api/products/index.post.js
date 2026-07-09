export default defineEventHandler(async (event) => {
  requireRole(event, ['admin', 'staff'])

  const body = await readBody(event)
  const { name, description, price, image, stock, categoryId } = body || {}

  if (!name || price === undefined || price === null) {
    throw createError({ statusCode: 400, statusMessage: 'Name and price are required.' })
  }

  const product = await prisma.product.create({
    data: {
      name: String(name).trim(),
      description: description ? String(description) : '',
      price: Number(price),
      image: image ? String(image) : '',
      stock: stock ? Number(stock) : 0,
      categoryId: categoryId ? Number(categoryId) : null
    }
  })

  return product
})
