// POST /api/auth/login
// Body: { email, password }
export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const email = (body?.email || '').trim().toLowerCase()
  const password = body?.password || ''

  if (!email || !password) {
    throw createError({ statusCode: 400, statusMessage: 'Email and password are required.' })
  }

  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) {
    throw createError({ statusCode: 401, statusMessage: 'Invalid email or password.' })
  }

  const valid = await comparePassword(password, user.password)
  if (!valid) {
    throw createError({ statusCode: 401, statusMessage: 'Invalid email or password.' })
  }

  const token = signToken(user)
  setAuthCookie(event, token)

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role
  }
})
