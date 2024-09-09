// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ["@nuxt/ui", "@nuxtjs/device"],

  colorMode: {
    preference: 'dark'
  },

  compatibilityDate: "2024-08-30"
})