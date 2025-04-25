import { useAuthStore } from '~/stores/auth'

export default defineNuxtPlugin(() => {
  // No es necesario pasar el pinia como argumento,
  // Nuxt se encarga de proporcionar el contexto correcto
  const authStore = useAuthStore()
  
  // Inicializar el store después de que la aplicación se haya montado
  // Esto asegura que localStorage esté disponible
  if (import.meta.client) {
    nextTick(() => {
      authStore.init()
    })
  }
}) 