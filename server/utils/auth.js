import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const TOKEN_COOKIE = 'auth_token'

export function hashPassword(plain) {
  return bcrypt.hash(plain, 10)
}

export function comparePassword(plain, hash) {
  return bcrypt.compare(plain, hash)
}

export function signToken(user) {
  const config = useRuntimeConfig()
  // Keep the token payload small — just enough to identify the user.
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    config.jwtSecret,
    { expiresIn: '7d' }
  )
}

export function verifyToken(token) {
  const config = useRuntimeConfig()
  try {
    return jwt.verify(token, config.jwtSecret)
  } catch {
    return null
  }
}

// Reads the JWT from the http-only cookie and returns the decoded user, or null if there isn't a valid session.
export function getAuthUser(event) {
  const token = getCookie(event, TOKEN_COOKIE)
  if (!token) return null
  return verifyToken(token)
}

export function requireUser(event) {
  const user = getAuthUser(event)
  if (!user) {
    throw createError({ statusCode: 401, statusMessage: 'You must be logged in.' })
  }
  return user
}

export function requireRole(event, allowedRoles) {
  const user = requireUser(event)
  if (!allowedRoles.includes(user.role)) {
    throw createError({ statusCode: 403, statusMessage: 'You do not have permission to do this.' })
  }
  return user
}

export function setAuthCookie(event, token) {
  setCookie(event, TOKEN_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7 // 7 day 
  })
}

export function clearAuthCookie(event) {
  deleteCookie(event, TOKEN_COOKIE, { path: '/' })
}
