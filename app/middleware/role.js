// middleware: 'role', allowedRoles: ['admin', 'staff']
export default defineNuxtRouteMiddleware(async (to) => {
  const authStore = useAuthStore()

  if (!authStore.user && !authStore.loading) {
    await authStore.fetchUser()
  }

  if (!authStore.isLoggedIn) {
    return navigateTo('/login')
  }

  const allowedRoles = to.meta.allowedRoles || ['admin', 'staff']
  if (!allowedRoles.includes(authStore.user.role)) {
    return navigateTo('/')
  }
})
 