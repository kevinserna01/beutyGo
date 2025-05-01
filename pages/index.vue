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
      
      <h1 class="text-3xl font-bold text-red-500 mb-4">BeautyGo</h1>
      <p class="text-gray-600 mb-8">Belleza a un clic de distancia</p>
      
      <!-- Descripción de la app -->
      <div class="space-y-6 mb-12">
        <div class="p-4 bg-red-50 rounded-lg">
          <h2 class="text-lg font-semibold text-red-700 mb-2">
            Servicios de Belleza a Domicilio
          </h2>
          <p class="text-red-600">
            Conectamos profesionales de belleza con clientes que buscan servicios de calidad en la comodidad de su hogar.
          </p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="p-4 bg-gray-50 rounded-lg">
            <h3 class="font-medium text-gray-900 mb-1">Para Clientes</h3>
            <p class="text-sm text-gray-600">
              Encuentra y reserva servicios de belleza profesionales desde la comodidad de tu hogar.
            </p>
          </div>
          
          <div class="p-4 bg-gray-50 rounded-lg">
            <h3 class="font-medium text-gray-900 mb-1">Para Profesionales</h3>
            <p class="text-sm text-gray-600">
              Gestiona tus servicios, horarios y conecta con nuevos clientes.
            </p>
          </div>
        </div>
      </div>
      
      <!-- Botones de acción -->
      <div class="space-y-4">
        <button 
          @click="navigateToAuth"
          class="w-full px-6 py-3 text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors"
        >
          Comenzar
        </button>
        
        <button 
          @click="skipIntro"
          class="w-full px-6 py-3 text-red-500 bg-transparent hover:bg-red-50 rounded-lg transition-colors"
        >
          Ya tengo una cuenta
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useOnboardingStore } from '~/stores/onboarding'
import { useAuthStore } from '~/stores/auth'
import { useRouter } from 'vue-router'

// Obtener los stores
const onboardingStore = useOnboardingStore()
const authStore = useAuthStore()
const router = useRouter()

// Verificar autenticación al montar
onMounted(() => {
  authStore.checkAuth()
  
  // Si el usuario ya está autenticado, redirigir al home
  if (authStore.isAuthenticated) {
    router.push('/home')
  }
})

// Función para navegar al flujo de autenticación
const navigateToAuth = () => {
  if (!onboardingStore.hasCompletedOnboarding) {
    router.push('/onboarding')
  } else {
    router.push('/auth/register')
  }
}

// Función para ir directamente al login
const skipIntro = () => {
  router.push('/auth/login')
}

// Configurar el título de la página
useHead({
  title: 'Bienvenido'
})
</script> 