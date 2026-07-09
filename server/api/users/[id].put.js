// (admin only) change someone's role
export default defineEventHandler(async (event) => {
  requireRole(event, ['admin'])

  const id = Number(getRouterParam(event, 'id'))
  const body = await readBody(event)
  const { name, role } = body || {}

  const allowedRoles = ['admin', 'staff', 'guest']
  if (role && !allowedRoles.includes(role)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid role.' })
  }

  const user = await prisma.user.update({
    where: { id },
    data: {
      ...(name !== undefined ? { name: String(name).trim() } : {}),
      ...(role !== undefined ? { role } : {})
    },
    select: { id: true, name: true, email: true, role: true }
  })

  return user
})
