<script setup>
const authStore = useAuthStore()
const cartStore = useCartStore()

// Runs once on the client  restore the logged-in user and the saved cart.
onMounted(() => {
  authStore.fetchUser()
  cartStore.load()
})
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <Navbar />
    <main class="flex-1 max-w-6xl w-full mx-auto px-4 py-6">
      <slot />
    </main>
    <footer class="text-center text-xs text-gray-400 py-6">
      Electronic Store — built with Nuxt 3
    </footer>
  </div>
</template>
