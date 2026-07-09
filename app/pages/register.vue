<script setup>
const authStore = useAuthStore()
const router = useRouter()

const name = ref('')
const email = ref('')
const password = ref('')
const error = ref('')
const submitting = ref(false)

async function handleRegister() {
  error.value = ''
  submitting.value = true
  try {
    await authStore.register(name.value, email.value, password.value)
    router.push('/')
  } catch (e) {
    error.value = e?.data?.statusMessage || 'Registration failed.'
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="max-w-sm mx-auto mt-8">
    <h1 class="text-2xl font-bold text-gray-900 mb-6">Create an account</h1>

    <form class="space-y-4" @submit.prevent="handleRegister">
      <p v-if="error" class="text-sm text-red-600">{{ error }}</p>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Name</label>
        <input v-model="name" type="text" required class="w-full border rounded px-3 py-2">
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <input v-model="email" type="email" required class="w-full border rounded px-3 py-2">
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
        <input v-model="password" type="password" required minlength="6" class="w-full border rounded px-3 py-2">
        <p class="text-xs text-gray-400 mt-1">At least 6 characters.</p>
      </div>

      <button
        type="submit"
        class="w-full py-2 rounded bg-blue-600 text-white font-medium hover:bg-blue-700 disabled:bg-gray-300"
        :disabled="submitting"
      >
        {{ submitting ? 'Creating account...' : 'Sign up' }}
      </button>
    </form>

    <p class="text-sm text-gray-500 mt-4">
      Already have an account?
      <NuxtLink to="/login" class="text-blue-600 hover:underline">Log in</NuxtLink>
    </p>
  </div>
</template>
