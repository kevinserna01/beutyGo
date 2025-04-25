<template>
  <div>
    <h1 class="text-2xl font-bold text-center text-gray-900 mb-6">
      Iniciar sesión
    </h1>
    
    <form @submit.prevent="handleLogin" class="space-y-4">
      <UiInput
        v-model="email"
        label="Correo electrónico"
        type="email"
        placeholder="correo@ejemplo.com"
        :error="errors.email"
        required
        id="email"
        autocomplete="email"
      />
      
      <UiInput
        v-model="password"
        label="Contraseña"
        type="password"
        placeholder="••••••••"
        :error="errors.password"
        required
        id="password"
        autocomplete="current-password"
      />
      
      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <input 
            id="remember_me" 
            type="checkbox" 
            v-model="rememberMe"
            class="h-4 w-4 text-red-500 focus:ring-red-500 border-gray-300 rounded" 
          />
          <label for="remember_me" class="ml-2 block text-sm text-gray-700">
            Recordarme
          </label>
        </div>
        
        <div class="text-sm">
          <NuxtLink to="/auth/forgot-password" class="font-medium text-red-500 hover:text-red-600">
            ¿Olvidaste tu contraseña?
          </NuxtLink>
        </div>
      </div>
      
      <div class="pt-2">
        <UiButton
          type="submit"
          block
          :loading="isLoading"
          loadingText="Iniciando sesión..."
        >
          Iniciar sesión
        </UiButton>
      </div>
    </form>
    
    <div class="mt-6 text-center">
      <p class="text-sm text-gray-600">
        ¿No tienes una cuenta?
        <NuxtLink to="/auth/register" class="font-medium text-red-500 hover:text-red-600">
          Regístrate aquí
        </NuxtLink>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useAuthStore } from '~/stores/auth'

// Definir el layout
definePageMeta({
  layout: 'auth'
})

// Establecer el título de la página
useHead({
  title: 'Iniciar sesión'
})

// Estado
const email = ref('')
const password = ref('')
const rememberMe = ref(false)
const isLoading = ref(false)
const errors = reactive({
  email: '',
  password: '',
  general: ''
})

// Store de autenticación
const authStore = useAuthStore()
const router = useRouter()

// Métodos
const validateForm = (): boolean => {
  // Resetear errores
  errors.email = ''
  errors.password = ''
  errors.general = ''
  
  let isValid = true
  
  // Validar email
  if (!email.value) {
    errors.email = 'El correo electrónico es obligatorio'
    isValid = false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    errors.email = 'Introduce un correo electrónico válido'
    isValid = false
  }
  
  // Validar contraseña
  if (!password.value) {
    errors.password = 'La contraseña es obligatoria'
    isValid = false
  }
  
  return isValid
}

const handleLogin = async () => {
  if (!validateForm()) return
  
  try {
    isLoading.value = true
    
    await authStore.login({
      email: email.value,
      password: password.value
    })
    
    // Si el inicio de sesión es exitoso, redirigir a la página principal
    router.push('/home')
  } catch (error) {
    errors.general = 'Credenciales inválidas'
  } finally {
    isLoading.value = false
  }
}
</script> 