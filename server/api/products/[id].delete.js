export default defineEventHandler(async (event) => {
  requireRole(event, ['admin', 'staff'])

  const id = Number(getRouterParam(event, 'id'))
  await prisma.product.delete({ where: { id } })

  return { success: true }
})
