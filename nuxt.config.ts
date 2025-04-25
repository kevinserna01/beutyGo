// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  
  // Configuración de módulos
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@nuxt/image',
    '@vueuse/nuxt',
  ],
  
  // Configuración de aplicación
  app: {
    head: {
      title: 'BeautyGo',
      meta: [
        { name: 'description', content: 'Descubre, reserva y recibe servicios de belleza a domicilio' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap' }
      ]
    }
  },
  
  // Configuración de imagen
  image: {
    quality: 80,
    format: ['webp']
  },
  
  // Configuración de Pinia
  pinia: {
    autoImports: ['defineStore', 'storeToRefs']
  },
  
  // Configuración de TypeScript
  typescript: {
    strict: true,
    typeCheck: true
  },
  
  // Configuración de rutas
  routeRules: {
    '/auth/**': { ssr: false }
  }
})
