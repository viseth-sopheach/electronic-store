// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  // Tailwind CSS + Pinia (state management for auth/cart)
  modules: ['@nuxtjs/tailwindcss', '@pinia/nuxt'],

  // Auto-import everything in app/stores/*.js so we can call
  // useAuthStore() / useCartStore() anywhere without an import line.
  imports: {
    dirs: ['stores']
  },

  // Values only available on the server (never sent to the browser)
  // Values inside "public" ARE sent to the browser.
  runtimeConfig: {
    jwtSecret: process.env.JWT_SECRET || 'dev-secret-change-me',
    databaseUrl: process.env.DATABASE_URL || '',
    public: {
      appName: 'Electronic Store'
    }
  }
})
