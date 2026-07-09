// GET /api/orders
// - admin/staff: see every order
// - regular logged-in user: see only their own orders
export default defineEventHandler(async (event) => {
  const user = requireUser(event)

  const isStaffOrAdmin = user.role === 'admin' || user.role === 'staff'

  return prisma.order.findMany({
    where: isStaffOrAdmin ? {} : { userId: user.id },
    include: {
      items: { include: { product: true } },
      user: { select: { id: true, name: true, email: true } }
    },
    orderBy: { createdAt: 'desc' }
  })
})
