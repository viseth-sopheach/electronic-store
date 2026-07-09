// PUT /api/orders/:id  (staff/admin only) — update order status
// Body: { status: 'pending' | 'paid' | 'shipped' | 'cancelled' }
export default defineEventHandler(async (event) => {
  requireRole(event, ['admin', 'staff'])

  const id = Number(getRouterParam(event, 'id'))
  const body = await readBody(event)
  const allowedStatuses = ['pending', 'paid', 'shipped', 'cancelled']

  if (!allowedStatuses.includes(body?.status)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid order status.' })
  }

  return prisma.order.update({
    where: { id },
    data: { status: body.status },
    include: { items: { include: { product: true } } }
  })
})
