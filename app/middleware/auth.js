export default defineNuxtRouteMiddleware(async () => {
  const authStore = useAuthStore()

  // Make sure we know who's logged
  if (!authStore.user && !authStore.loading) {
    await authStore.fetchUser()
  }

  if (!authStore.isLoggedIn) {
    return navigateTo(`/login`)
  }
})
