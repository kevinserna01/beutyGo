<template>
  <div>
    <h1 class="text-2xl font-bold text-center text-gray-900 mb-6">
      Iniciar sesión
    </h1>
    
    <!-- Mensaje de error general -->
    <div v-if="errors.general" class="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
      {{ errors.general }}
    </div>
    
    <!-- Mensaje de éxito -->
    <div v-if="loginSuccess" class="mb-4 p-3 bg-green-50 border border-green-200 text-green-600 rounded-lg text-sm">
      ¡Inicio de sesión exitoso! Redirigiendo...
    </div>
    
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
import { ref, reactive, computed } from 'vue'
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
const loginSuccess = ref(false)
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
    errors.general = ''
    loginSuccess.value = false
    
    await authStore.login({
      email: email.value,
      password: password.value
    })
    
    // Mostrar mensaje de éxito
    loginSuccess.value = true
    
    // Esperar un momento antes de redireccionar para que el usuario vea el mensaje de éxito
    setTimeout(() => {
      // Si el inicio de sesión es exitoso, redirigir a la página principal
      router.push('/home')
    }, 1000)
  } catch (error) {
    loginSuccess.value = false
    
    // Capturar errores específicos del backend
    if (error instanceof Error) {
      errors.general = error.message
    } else {
      errors.general = 'Error al iniciar sesión. Por favor, inténtalo de nuevo.'
    }
    
    // Manejar casos específicos de error
    if (errors.general.includes('404')) {
      errors.general = 'El usuario no existe. Revisa tus credenciales o regístrate.'
    } else if (errors.general.includes('401') || errors.general.toLowerCase().includes('contraseña') || errors.general.toLowerCase().includes('invalid credentials')) {
      errors.general = 'Correo electrónico o contraseña incorrectos. Por favor, verifica tus datos e inténtalo de nuevo.'
    } else if (errors.general.toLowerCase().includes('no encontrado')) {
      errors.general = 'El usuario no existe. Revisa tu correo electrónico o regístrate.'
    } else if (errors.general.toLowerCase().includes('unexpected token') || errors.general.toLowerCase().includes('<!doctype') || errors.general.toLowerCase().includes('not valid json')) {
      // SOLUCIÓN TEMPORAL: Verificar si la respuesta HTTP fue 200 OK
      // Si el código de estado es 200, asumimos que el login fue exitoso a pesar del error de formato
      if (error instanceof Error && (error as any).statusCode === 200) {
        console.log('Error de formato JSON pero status 200, asumiendo login exitoso')
        
        // Simular éxito y redirigir al home
        loginSuccess.value = true
        setTimeout(() => {
          router.push('/home')
        }, 1000)
        return
      }
      
      errors.general = 'Error de comunicación con el servidor. El formato de respuesta no es correcto. Por favor, inténtalo más tarde o contacta al administrador.'
      console.error('Error de formato JSON en la respuesta:', error)
    }
  } finally {
    isLoading.value = false
  }
}
</script> 