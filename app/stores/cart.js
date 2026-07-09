// Cart store — saved to localStorage
import { defineStore } from 'pinia'

const STORAGE_KEY = 'electronic-store-cart'

export const useCartStore = defineStore('cart', {
  state: () => ({
    // items: [{ id, name, price, image, quantity }]
    items: []
  }),

  getters: {
    itemCount: (state) => state.items.reduce((sum, i) => sum + i.quantity, 0),
    total: (state) => state.items.reduce((sum, i) => sum + i.price * i.quantity, 0)
  },

  actions: {
    // Read the saved cart from the browser. Call this once, client-side only.
    load() {
      if (import.meta.server) return
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        try {
          this.items = JSON.parse(raw)
        } catch {
          this.items = []
        }
      }
    },

    save() {
      if (import.meta.server) return
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.items))
    },

    addItem(product, quantity = 1) {
      const existing = this.items.find((i) => i.id === product.id)
      if (existing) {
        existing.quantity += quantity
      } else {
        this.items.push({
          id: product.id,
          name: product.name,
          price: Number(product.price),
          image: product.image,
          quantity
        })
      }
      this.save()
    },

    updateQuantity(id, quantity) {
      const item = this.items.find((i) => i.id === id)
      if (!item) return
      if (quantity <= 0) {
        this.removeItem(id)
        return
      }
      item.quantity = quantity
      this.save()
    },

    removeItem(id) {
      this.items = this.items.filter((i) => i.id !== id)
      this.save()
    },

    clear() {
      this.items = []
      this.save()
    }
  }
})
