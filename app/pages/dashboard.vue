<script setup>
definePageMeta({
  middleware: 'role',
  allowedRoles: ['admin', 'staff']
})

const authStore = useAuthStore()

const tab = ref('products')

// Products
const { data: products, refresh: refreshProducts } = await useFetch('/api/products')
const { data: categories } = await useFetch('/api/categories')

const showForm = ref(false)
const editingProduct = ref(null)
const productError = ref('')

function openCreateForm() {
  editingProduct.value = null
  showForm.value = true
}

function openEditForm(product) {
  editingProduct.value = product
  showForm.value = true
}

async function handleProductSubmit(form) {
  productError.value = ''
  try {
    if (editingProduct.value) {
      await $fetch(`/api/products/${editingProduct.value.id}`, { method: 'PUT', body: form })
    } else {
      await $fetch('/api/products', { method: 'POST', body: form })
    }
    showForm.value = false
    await refreshProducts()
  } catch (e) {
    productError.value = e?.data?.statusMessage || 'Could not save product.'
  }
}

async function deleteProduct(id) {
  if (!confirm('Delete this product?')) return
  await $fetch(`/api/products/${id}`, { method: 'DELETE' })
  await refreshProducts()
}

// Orders
const { data: orders, refresh: refreshOrders } = await useFetch('/api/orders')

async function updateOrderStatus(order, status) {
  await $fetch(`/api/orders/${order.id}`, { method: 'PUT', body: { status } })
  await refreshOrders()
}

// Users (admin only)
const { data: users, refresh: refreshUsers } = await useFetch('/api/users', {
  // Skip the request entirely for staff — the API would reject it anyway.
  immediate: authStore.isAdmin
})

async function updateUserRole(user, role) {
  await $fetch(`/api/users/${user.id}`, { method: 'PUT', body: { role } })
  await refreshUsers()
}
</script>

<template>
  <div>
    <h1 class="text-2xl font-bold text-gray-900 mb-1">Dashboard</h1>
    <p class="text-sm text-gray-500 mb-6">
      Logged in as {{ authStore.user?.name }} ({{ authStore.user?.role }})
    </p>

    <div class="flex gap-2 border-b mb-6">
      <button
        class="px-4 py-2 -mb-px border-b-2"
        :class="tab === 'products' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500'"
        @click="tab = 'products'"
      >
        Products
      </button>
      <button
        class="px-4 py-2 -mb-px border-b-2"
        :class="tab === 'orders' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500'"
        @click="tab = 'orders'"
      >
        Orders
      </button>
      <button
        v-if="authStore.isAdmin"
        class="px-4 py-2 -mb-px border-b-2"
        :class="tab === 'users' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500'"
        @click="tab = 'users'"
      >
        Users
      </button>
    </div>

    <!-- Products tab -->
    <section v-if="tab === 'products'">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-lg font-semibold">Products</h2>
        <button class="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700" @click="openCreateForm">
          + Add product
        </button>
      </div>

      <div v-if="showForm" class="border rounded-lg p-4 bg-white mb-6">
        <h3 class="font-semibold mb-3">{{ editingProduct ? 'Edit product' : 'New product' }}</h3>
        <ProductForm
          :categories="categories || []"
          :initial-product="editingProduct"
          @submit="handleProductSubmit"
          @cancel="showForm = false"
        />
        <p v-if="productError" class="text-red-600 text-sm mt-2">{{ productError }}</p>
      </div>

      <div class="overflow-x-auto bg-white border rounded-lg">
        <table class="w-full text-sm">
          <thead class="bg-gray-50 text-left text-gray-500">
            <tr>
              <th class="p-3">Name</th>
              <th class="p-3">Category</th>
              <th class="p-3">Price</th>
              <th class="p-3">Stock</th>
              <th class="p-3"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="p in products" :key="p.id" class="border-t">
              <td class="p-3 font-medium">{{ p.name }}</td>
              <td class="p-3 text-gray-500">{{ p.category?.name || '—' }}</td>
              <td class="p-3">${{ Number(p.price).toFixed(2) }}</td>
              <td class="p-3">{{ p.stock }}</td>
              <td class="p-3 text-right space-x-3">
                <button class="text-blue-600 hover:underline" @click="openEditForm(p)">Edit</button>
                <button class="text-red-600 hover:underline" @click="deleteProduct(p.id)">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- Orders tab -->
    <section v-else-if="tab === 'orders'">
      <h2 class="text-lg font-semibold mb-4">Orders</h2>

      <div v-if="!orders || orders.length === 0" class="text-gray-500">No orders yet.</div>

      <div v-else class="space-y-3">
        <div v-for="order in orders" :key="order.id" class="border rounded-lg p-4 bg-white">
          <div class="flex justify-between items-start">
            <div>
              <p class="font-semibold">Order #{{ order.id }} — {{ order.user?.name }}</p>
              <p class="text-sm text-gray-500">{{ order.items.length }} item(s) · ${{ Number(order.total).toFixed(2) }}</p>
            </div>
            <select
              class="border rounded px-2 py-1 text-sm"
              :value="order.status"
              @change="updateOrderStatus(order, $event.target.value)"
            >
              <option value="pending">pending</option>
              <option value="paid">paid</option>
              <option value="shipped">shipped</option>
              <option value="cancelled">cancelled</option>
            </select>
          </div>
        </div>
      </div>
    </section>

    <!-- Users tab (admin only) -->
    <section v-else-if="tab === 'users' && authStore.isAdmin">
      <h2 class="text-lg font-semibold mb-4">Users</h2>

      <div class="overflow-x-auto bg-white border rounded-lg">
        <table class="w-full text-sm">
          <thead class="bg-gray-50 text-left text-gray-500">
            <tr>
              <th class="p-3">Name</th>
              <th class="p-3">Email</th>
              <th class="p-3">Role</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="u in users" :key="u.id" class="border-t">
              <td class="p-3 font-medium">{{ u.name }}</td>
              <td class="p-3 text-gray-500">{{ u.email }}</td>
              <td class="p-3">
                <select
                  class="border rounded px-2 py-1"
                  :value="u.role"
                  @change="updateUserRole(u, $event.target.value)"
                >
                  <option value="admin">admin</option>
                  <option value="staff">staff</option>
                  <option value="guest">guest</option>
                </select>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </div>
</template>
