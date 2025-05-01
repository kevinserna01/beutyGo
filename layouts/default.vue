<template>
  <div class="min-h-screen flex flex-col">
    <header v-if="showHeader" class="bg-white shadow-sm">
      <div class="container mx-auto px-4 py-3 flex justify-between items-center">
        <NuxtLink to="/" class="font-bold text-xl text-red-400">
          BeautyGo
        </NuxtLink>
        <div v-if="user" class="flex items-center gap-2">
          <NuxtLink 
            to="/profile" 
            class="px-4 py-2 text-sm text-gray-700 rounded-full hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
            </svg>
            Perfil
          </NuxtLink>
          <button 
            @click="handleLogout"
            class="px-4 py-2 text-sm text-red-500 rounded-full hover:bg-red-50 transition-colors flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clip-rule="evenodd" />
            </svg>
            Cerrar sesión
          </button>
        </div>
      </div>
    </header>
    
    <main class="flex-grow">
      <slot />
    </main>
    
    <footer v-if="showFooter" class="bg-white border-t border-gray-100 mt-auto">
      <div class="container mx-auto px-4 py-5">
        <div class="flex flex-col md:flex-row justify-between items-center gap-4">
          <div class="text-gray-600 text-sm">
            © {{ new Date().getFullYear() }} BeautyGo. Todos los derechos reservados.
          </div>
          <div class="flex gap-4">
            <NuxtLink to="/terms" class="text-sm text-gray-600 hover:text-gray-900 transition-colors">
              Términos y condiciones
            </NuxtLink>
            <NuxtLink to="/privacy" class="text-sm text-gray-600 hover:text-gray-900 transition-colors">
              Política de privacidad
            </NuxtLink>
            <NuxtLink to="/contact" class="text-sm text-gray-600 hover:text-gray-900 transition-colors">
              Contacto
            </NuxtLink>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { User } from '~/types'
import { useAuthStore } from '~/stores/auth'

const authStore = useAuthStore()
const router = useRouter()

// Obtener el usuario del store
const user = computed(() => authStore.user)

// Función para manejar el cierre de sesión
const handleLogout = () => {
  authStore.logout()
  router.push('/auth/login')
}

const route = useRoute()

// No mostrar header en rutas específicas
const showHeader = computed(() => {
  return !route.path.includes('/auth/') && !route.path.includes('/onboarding')
})

// No mostrar footer en rutas específicas
const showFooter = computed(() => {
  return !route.path.includes('/onboarding') && 
         !route.path.includes('/splash') && 
         route.path !== '/auth/login' && 
         route.path !== '/auth/register'
})
</script> 