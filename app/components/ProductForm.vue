<script setup>
const props = defineProps({
  categories: { type: Array, default: () => [] },
  // create a new one.
  initialProduct: { type: Object, default: null }
})

const emit = defineEmits(['submit', 'cancel'])

const form = reactive({
  name: props.initialProduct?.name || '',
  description: props.initialProduct?.description || '',
  price: props.initialProduct?.price || '',
  image: props.initialProduct?.image || '',
  stock: props.initialProduct?.stock ?? 0,
  categoryId: props.initialProduct?.categoryId || ''
})

const error = ref('')

function handleSubmit() {
  error.value = ''
  if (!form.name.trim() || !form.price) {
    error.value = 'Name and price are required.'
    return
  }
  emit('submit', { ...form })
}
</script>

<template>
  <form class="space-y-4" @submit.prevent="handleSubmit">
    <p v-if="error" class="text-sm text-red-600">{{ error }}</p>

    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">Name</label>
      <input v-model="form.name" type="text" class="w-full border rounded px-3 py-2">
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
      <textarea v-model="form.description" rows="3" class="w-full border rounded px-3 py-2" />
    </div>

    <div class="grid grid-cols-2 gap-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
        <input v-model="form.price" type="number" step="0.01" min="0" class="w-full border rounded px-3 py-2">
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Stock</label>
        <input v-model="form.stock" type="number" min="0" class="w-full border rounded px-3 py-2">
      </div>
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
      <input v-model="form.image" type="text" placeholder="https://..." class="w-full border rounded px-3 py-2">
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">Category</label>
      <select v-model="form.categoryId" class="w-full border rounded px-3 py-2">
        <option value="">No category</option>
        <option v-for="cat in categories" :key="cat.id" :value="cat.id">
          {{ cat.name }}
        </option>
      </select>
    </div>

    <div class="flex gap-3 pt-2">
      <button type="submit" class="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">
        {{ initialProduct ? 'Save changes' : 'Create product' }}
      </button>
      <button type="button" class="px-4 py-2 rounded bg-gray-100 hover:bg-gray-200" @click="emit('cancel')">
        Cancel
      </button>
    </div>
  </form>
</template>
