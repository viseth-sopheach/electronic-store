export default defineNuxtRouteMiddleware(async (to) => {
  const authStore = useAuthStore();

  if (!authStore.user && !authStore.loading) {
    await authStore.fetchUser();
  }

  if (!authStore.isLoggedIn) {
    return navigateTo({
      path: "/login",
      query: { redirect: to.fullPath },
    });
  }
});
