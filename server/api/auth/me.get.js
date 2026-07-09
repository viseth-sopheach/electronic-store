// GET /api/auth/me
// Returns the logged-in user (based on the auth cookie) or null.
// Used on app start to restore the session.
export default defineEventHandler(async (event) => {
  const decoded = getAuthUser(event)
  if (!decoded) return null

  const user = await prisma.user.findUnique({ where: { id: decoded.id } })
  if (!user) return null

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role
  }
})
