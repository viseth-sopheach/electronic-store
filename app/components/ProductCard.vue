<script setup>
const props = defineProps({
  product: { type: Object, required: true }
})

const cartStore = useCartStore()

function addToCart() {
  cartStore.addItem(props.product, 1)
}
</script>

<template>
  <div class="border border-gray-200 rounded-lg overflow-hidden bg-white flex flex-col">
    <NuxtLink :to="`/products/${product.id}`">
      <img
        :src="product.image || 'https://placehold.co/400x400?text=No+Image'"
        :alt="product.name"
        class="w-full h-48 object-cover"
      >
    </NuxtLink>

    <div class="p-4 flex flex-col flex-1">
      <NuxtLink :to="`/products/${product.id}`" class="font-semibold text-gray-900 hover:text-blue-600">
        {{ product.name }}
      </NuxtLink>

      <p v-if="product.category" class="text-xs text-gray-500 mt-1">
        {{ product.category.name }}
      </p>

      <p class="text-lg font-bold text-gray-900 mt-2">
        ${{ Number(product.price).toFixed(2) }}
      </p>

      <p class="text-xs mt-1" :class="product.stock > 0 ? 'text-green-600' : 'text-red-600'">
        {{ product.stock > 0 ? `${product.stock} in stock` : 'Out of stock' }}
      </p>

      <button
        class="mt-auto pt-3 w-full py-2 rounded bg-blue-600 text-white font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
        :disabled="product.stock <= 0"
        @click="addToCart"
      >
        Add to cart
      </button>
    </div>
  </div>
</template>
