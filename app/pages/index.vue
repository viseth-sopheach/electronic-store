<script setup>
const search = ref('')
const categoryId = ref('')

const { data: categories } = await useFetch('/api/categories')

// useFetch automatically re-runs whenever search or categoryId change, because they're passed inside the reactive query object.
const { data: products, pending } = await useFetch('/api/products', {
  query: computed(() => ({
    search: search.value || undefined,
    categoryId: categoryId.value || undefined
  }))
})
</script>

<template>
  <div>
    <h1 class="text-2xl font-bold text-gray-900 mb-4">Shop Electronics</h1>

    <div class="flex flex-col sm:flex-row gap-3 mb-6">
      <input
        v-model="search"
        type="text"
        placeholder="Search products..."
        class="flex-1 border rounded px-3 py-2"
      >
      <select v-model="categoryId" class="border rounded px-3 py-2">
        <option value="">All categories</option>
        <option v-for="cat in categories" :key="cat.id" :value="cat.id">
          {{ cat.name }}
        </option>
      </select>
    </div>

    <p v-if="pending" class="text-gray-500">Loading products...</p>

    <p v-else-if="products?.length === 0" class="text-gray-500">
      No products found.
    </p>

    <div v-else class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
      <ProductCard v-for="product in products" :key="product.id" :product="product" />
    </div>
  </div>
</template>
