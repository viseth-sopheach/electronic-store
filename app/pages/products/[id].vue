<script setup>
import { useRoute } from "vue-router";
const route = useRoute();
const cartStore = useCartStore();
const router = useRouter();

const { data: product, error } = await useFetch(
  `/api/products/${route.params.id}`,
);

const quantity = ref(1);

function addToCart() {
  cartStore.addItem(product.value, quantity.value);
}
</script>

<template>
  <div>
    <p v-if="error" class="text-red-600">Product not found.</p>

    <div v-else-if="product" class="grid md:grid-cols-2 gap-8">
      <img
        :src="product.image || 'https://placehold.co/500x500?text=No+Image'"
        :alt="product.name"
        class="w-full rounded-lg border object-cover"
      />

      <div>
        <p v-if="product.category" class="text-sm text-gray-500">
          {{ product.category.name }}
        </p>
        <h1 class="text-3xl font-bold text-gray-900 mt-1">
          {{ product.name }}
        </h1>
        <p class="text-2xl font-semibold text-gray-900 mt-3">
          ${{ Number(product.price).toFixed(2) }}
        </p>

        <p class="text-gray-600 mt-4 leading-relaxed">
          {{ product.description }}
        </p>

        <p
          class="text-sm mt-4"
          :class="product.stock > 0 ? 'text-green-600' : 'text-red-600'"
        >
          {{ product.stock > 0 ? `${product.stock} in stock` : "Out of stock" }}
        </p>
        
        <div v-if="product.stock > 0" class="flex items-center gap-3 mt-5">
          <input
          v-model.number="quantity"
            type="number"
            min="1"
            :max="product.stock"
            class="w-20 border rounded px-3 py-2"
          />
          <button
          class="px-5 py-2 rounded bg-blue-600 text-white font-medium hover:bg-blue-700"
          @click="addToCart"
          >
          Add to cart
        </button>
      </div>
      <button class="mt-1 bg-blue-500 p-2 rounded-xl" @click="router.go(-1)">Back to Shop</button>
      </div>
    </div>
  </div>
</template>
