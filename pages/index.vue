<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-white">
    <div class="w-full max-w-md p-6 text-center">
      <!-- Logo -->
      <div class="flex justify-center mb-8">
        <img 
          src="/images/logo.svg" 
          alt="BeautyGo Logo" 
          class="w-40 h-40 object-contain"
        />
      </div>
      
      <h1 class="text-3xl font-bold text-red-500 mb-2">BeautyGo</h1>
      <p class="text-gray-600 mb-8">Belleza a un clic de distancia</p>
      
      <div class="animate-pulse text-center text-gray-500 text-sm mb-4">
        Cargando...
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useOnboardingStore } from '~/stores/onboarding'
import { useAuthStore } from '~/stores/auth'

// Obtener los stores
const onboardingStore = useOnboardingStore()
const authStore = useAuthStore()

// Verificar si el usuario ya ha completado el onboarding
onMounted(() => {
  // Verificar autenticación
  authStore.checkAuth()
  
  // Simular carga
  setTimeout(() => {
    if (authStore.isAuthenticated) {
      // Si está autenticado, ir directo al home
      navigateTo('/home')
    } else if (onboardingStore.hasCompletedOnboarding) {
      // Si ya completó el onboarding, ir al login
      navigateTo('/auth/login')
    } else {
      // Si es la primera vez, mostrar onboarding
      navigateTo('/onboarding')
    }
  }, 2000)
})

// Configurar el título de la página
useHead({
  title: 'Bienvenido'
})
</script> 