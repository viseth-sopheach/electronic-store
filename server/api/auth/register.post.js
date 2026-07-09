// POST /api/auth/register
// Body: { name, email, password }
// New accounts always start as "guest" — nobody can sign themselves up
// as admin or staff through this endpoint.
export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const name = (body?.name || '').trim()
  const email = (body?.email || '').trim().toLowerCase()
  const password = body?.password || ''

  if (!name || !email || !password) {
    throw createError({ statusCode: 400, statusMessage: 'Name, email and password are required.' })
  }
  if (password.length < 6) {
    throw createError({ statusCode: 400, statusMessage: 'Password must be at least 6 characters.' })
  }

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    throw createError({ statusCode: 409, statusMessage: 'An account with this email already exists.' })
  }

  const hashed = await hashPassword(password)
  const user = await prisma.user.create({
    data: { name, email, password: hashed, role: 'guest' }
  })

  const token = signToken(user)
  setAuthCookie(event, token)

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role
  }
})
