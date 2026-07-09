// POST /api/orders
// Body: { items: [{ productId, quantity }] }
// Creates an order from the cart. Only logged-in users may check out —
// requireUser() throws a 401 for guests, which the frontend uses to
// redirect them to the login page.
export default defineEventHandler(async (event) => {
  const user = requireUser(event)

  const body = await readBody(event)
  const items = Array.isArray(body?.items) ? body.items : []
  if (items.length === 0) {
    throw createError({ statusCode: 400, statusMessage: 'Your cart is empty.' })
  }

  // Look up real prices/stock from the database — never trust prices
  // sent from the browser.
  const productIds = items.map((i) => Number(i.productId))
  const products = await prisma.product.findMany({ where: { id: { in: productIds } } })

  let total = 0
  const orderItemsData = []

  for (const item of items) {
    const product = products.find((p) => p.id === Number(item.productId))
    const quantity = Number(item.quantity) || 1

    if (!product) {
      throw createError({ statusCode: 404, statusMessage: `Product ${item.productId} not found.` })
    }
    if (product.stock < quantity) {
      throw createError({ statusCode: 400, statusMessage: `Not enough stock for "${product.name}".` })
    }

    total += Number(product.price) * quantity
    orderItemsData.push({
      productId: product.id,
      quantity,
      price: product.price
    })
  }

  // Create the order and reduce stock together.
  const order = await prisma.$transaction(async (tx) => {
    const created = await tx.order.create({
      data: {
        userId: user.id,
        total,
        status: 'pending',
        items: { create: orderItemsData }
      },
      include: { items: { include: { product: true } } }
    })

    for (const item of orderItemsData) {
      await tx.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } }
      })
    }

    return created
  })

  return order
})
