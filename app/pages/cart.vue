<script setup>
const cartStore = useCartStore()
const authStore = useAuthStore()
const router = useRouter()

const placingOrder = ref(false)
const error = ref('')
const success = ref(false)

async function checkout() {
  error.value = ''

  if (!authStore.isLoggedIn) {
    router.push('/login')
    return
  }

  placingOrder.value = true
  try {
    await $fetch('/api/orders', {
      method: 'POST',
      body: {
        items: cartStore.items.map((i) => ({ productId: i.id, quantity: i.quantity }))
      }
    })
    cartStore.clear()
    success.value = true
  } catch (e) {
    error.value = e?.data?.statusMessage || 'Could not place order.'
  } finally {
    placingOrder.value = false
  }
}
</script>

<template>
  <div>
    <h1 class="text-2xl font-bold text-gray-900 mb-6">Your Cart</h1>

    <p v-if="success" class="text-green-700 bg-green-50 border border-green-200 rounded p-4 mb-4">
      Order placed successfully! Thanks for shopping with us.
    </p>

    <p v-if="cartStore.items.length === 0 && !success" class="text-gray-500">
      Your cart is empty. <NuxtLink to="/" class="text-blue-600 hover:underline">Browse products</NuxtLink>.
    </p>

    <div v-else-if="cartStore.items.length > 0" class="space-y-4">
      <div
        v-for="item in cartStore.items"
        :key="item.id"
        class="flex items-center gap-4 border rounded-lg p-3 bg-white"
      >
        <img :src="item.image || 'https://placehold.co/80x80'" class="w-16 h-16 object-cover rounded">

        <div class="flex-1">
          <p class="font-medium text-gray-900">{{ item.name }}</p>
          <p class="text-sm text-gray-500">${{ item.price.toFixed(2) }} each</p>
        </div>

        <input
          type="number"
          min="1"
          class="w-16 border rounded px-2 py-1"
          :value="item.quantity"
          @change="cartStore.updateQuantity(item.id, Number($event.target.value))"
        >

        <p class="w-20 text-right font-semibold">${{ (item.price * item.quantity).toFixed(2) }}</p>

        <button class="text-red-500 hover:text-red-700 text-sm" @click="cartStore.removeItem(item.id)">
          Remove
        </button>
      </div>

      <div class="flex justify-between items-center pt-4 border-t">
        <p class="text-lg font-bold">Total: ${{ cartStore.total.toFixed(2) }}</p>
        <button
          class="px-5 py-2 rounded bg-blue-600 text-white font-medium hover:bg-blue-700 disabled:bg-gray-300"
          :disabled="placingOrder"
          @click="checkout"
        >
          {{ authStore.isLoggedIn ? (placingOrder ? 'Placing order...' : 'Checkout') : 'Log in to checkout' }}
        </button>
      </div>

      <p v-if="error" class="text-red-600 text-sm">{{ error }}</p>
    </div>
  </div>
</template>
