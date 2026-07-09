<script setup>
const authStore = useAuthStore()
const cartStore = useCartStore()
const router = useRouter()

async function handleLogout() {
  await authStore.logout()
  router.push('/')
}
</script>

<template>
  <header class="bg-white border-b border-gray-200 sticky top-0 z-10">
    <nav class="max-w-6xl mx-auto flex items-center justify-between px-4 py-3">
      <NuxtLink to="/" class="text-xl font-bold text-gray-900">
        Electronic Store
      </NuxtLink>

      <div class="flex items-center gap-5 text-sm font-medium text-gray-700">
        <NuxtLink to="/" class="hover:text-blue-600">Products</NuxtLink>

        <NuxtLink
          v-if="authStore.canManageProducts"
          to="/dashboard"
          class="hover:text-blue-600"
        >
          Dashboard
        </NuxtLink>

        <NuxtLink to="/cart" class="relative hover:text-blue-600">
          Cart
          <span
            v-if="cartStore.itemCount > 0"
            class="absolute -top-2 -right-3 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
          >
            {{ cartStore.itemCount }}
          </span>
        </NuxtLink>

        <template v-if="authStore.isLoggedIn">
          <span class="text-gray-500 hidden sm:inline">
            Hi, {{ authStore.user.name }}
          </span>
          <button
            class="px-3 py-1.5 rounded bg-gray-100 hover:bg-gray-200"
            @click="handleLogout"
          >
            Logout
          </button>
        </template>
        <template v-else>
          <NuxtLink to="/login" class="hover:text-blue-600">Login</NuxtLink>
          <NuxtLink
            to="/register"
            class="px-3 py-1.5 rounded bg-blue-600 text-white hover:bg-blue-700"
          >
            Sign up
          </NuxtLink>
        </template>
      </div>
    </nav>
  </header>
</template>
