<template>
  <div class="min-h-screen flex flex-col">
    <header v-if="showHeader" class="bg-white shadow-sm">
      <div class="container mx-auto px-4 py-3 flex justify-between items-center">
        <NuxtLink to="/" class="font-bold text-xl text-red-400">
          BeautyGo
        </NuxtLink>
        <div v-if="user" class="flex items-center gap-2">
          <NuxtLink to="/profile" class="relative">
            <img 
              :src="user.photoURL || '/images/avatar-placeholder.png'" 
              alt="Profile" 
              class="w-8 h-8 rounded-full object-cover"
            />
          </NuxtLink>
        </div>
        <div v-else class="flex items-center gap-2">
          <NuxtLink 
            to="/auth/login" 
            class="px-4 py-2 text-sm text-red-500 rounded-full hover:bg-red-50 transition-colors"
          >
            Iniciar sesión
          </NuxtLink>
          <NuxtLink 
            to="/auth/register" 
            class="px-4 py-2 text-sm bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
          >
            Registrarse
          </NuxtLink>
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
import { useRoute } from 'vue-router'
import type { User } from '~/types'

// Mock user for development
const user = ref<User | null>(null)

const route = useRoute()

// No mostrar header en rutas específicas
const showHeader = computed(() => {
  return !route.path.includes('/onboarding') && 
         !route.path.includes('/splash') && 
         route.path !== '/auth/login' && 
         route.path !== '/auth/register'
})

// No mostrar footer en rutas específicas
const showFooter = computed(() => {
  return !route.path.includes('/onboarding') && 
         !route.path.includes('/splash') && 
         route.path !== '/auth/login' && 
         route.path !== '/auth/register'
})
</script> 