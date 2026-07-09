export default defineEventHandler(async (event) => {
  requireRole(event, ['admin'])

  return prisma.user.findMany({
    select: { id: true, name: true, email: true, role: true, createdAt: true },
    orderBy: { createdAt: 'desc' }
  })
})
