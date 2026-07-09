// Auth store — keeps track of who is logged in.
// The actual session lives in an http-only cookie (set by the server),
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null, // { id, name, email, role } or null
    loading: false
  }),

  getters: {
    isLoggedIn: (state) => !!state.user,
    isAdmin: (state) => state.user?.role === 'admin',
    isStaff: (state) => state.user?.role === 'staff',
    // Staff and admin both get into the dashboard.
    canManageProducts: (state) => ['admin', 'staff'].includes(state.user?.role)
  },

  actions: {
    // Called once when the app loads to restore the session from the cookie.
    async fetchUser() {
      this.loading = true
      try {
        this.user = await $fetch('/api/auth/me')
      } finally {
        this.loading = false
      }
    },

    async login(email, password) {
      this.user = await $fetch('/api/auth/login', {
        method: 'POST',
        body: { email, password }
      })
      return this.user
    },

    async register(name, email, password) {
      this.user = await $fetch('/api/auth/register', {
        method: 'POST',
        body: { name, email, password }
      })
      return this.user
    },

    async logout() {
      await $fetch('/api/auth/logout', { method: 'POST' })
      this.user = null
    }
  }
})
