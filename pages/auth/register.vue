<template>
  <div>
    <h1 class="text-2xl font-bold text-center text-gray-900 mb-6">
      Crear cuenta
    </h1>
    
    <!-- Mensaje de error general -->
    <div v-if="errors.general" class="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
      {{ errors.general }}
    </div>
    
    <!-- Mensaje de éxito -->
    <div v-if="registerSuccess" class="mb-4 p-3 bg-green-50 border border-green-200 text-green-600 rounded-lg text-sm">
      ¡Cuenta creada exitosamente! Redirigiendo al inicio de sesión...
    </div>
    
    <form @submit.prevent="handleRegister" class="space-y-4">
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <UiInput
          v-model="firstName"
          label="Nombre"
          type="text"
          placeholder="Tu nombre"
          :error="errors.firstName"
          required
          id="firstName"
          autocomplete="given-name"
        />
        
        <UiInput
          v-model="lastName"
          label="Apellidos"
          type="text"
          placeholder="Tus apellidos"
          :error="errors.lastName"
          required
          id="lastName"
          autocomplete="family-name"
        />
      </div>
      
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
        v-model="phone"
        label="Teléfono"
        type="tel"
        placeholder="Tu número de teléfono"
        :error="errors.phone"
        required
        id="phone"
        autocomplete="tel"
      />
      
      <UiInput
        v-model="password"
        label="Contraseña"
        type="password"
        placeholder="••••••••"
        :error="errors.password"
        required
        id="password"
        autocomplete="new-password"
        helperText="Mínimo 8 caracteres, con al menos una letra mayúscula y un número"
      />
      
      <UiInput
        v-model="passwordConfirmation"
        label="Confirmar contraseña"
        type="password"
        placeholder="••••••••"
        :error="errors.passwordConfirmation"
        required
        id="password_confirmation"
        autocomplete="new-password"
      />
      
      <div class="flex flex-col space-y-3 pt-2">
        <div class="flex flex-col space-y-2">
          <label class="text-sm font-medium text-gray-700">
            Tipo de cuenta
            <span class="text-red-500 ml-1">*</span>
          </label>
          
          <div class="flex flex-col sm:flex-row gap-3">
            <button 
              type="button"
              @click="role = 'client'"
              :class="[
                'flex-1 px-4 py-3 rounded-lg border-2 flex flex-col items-center justify-center transition-colors',
                role === 'client' 
                  ? 'border-red-500 bg-red-50 text-red-700' 
                  : 'border-gray-200 hover:border-gray-300 text-gray-700'
              ]"
            >
              <div class="text-base font-medium">Cliente</div>
              <div class="text-xs text-gray-500">Busco servicios de belleza</div>
            </button>
            
            <button 
              type="button"
              @click="role = 'professional'"
              :class="[
                'flex-1 px-4 py-3 rounded-lg border-2 flex flex-col items-center justify-center transition-colors',
                role === 'professional' 
                  ? 'border-red-500 bg-red-50 text-red-700' 
                  : 'border-gray-200 hover:border-gray-300 text-gray-700'
              ]"
            >
              <div class="text-base font-medium">Profesional</div>
              <div class="text-xs text-gray-500">Ofrezco servicios de belleza</div>
            </button>
          </div>
          
          <p v-if="errors.role" class="mt-1 text-sm text-red-500">{{ errors.role }}</p>
        </div>
      </div>
      
      <div class="pt-2">
        <UiButton
          type="submit"
          block
          :loading="isLoading"
          loadingText="Creando cuenta..."
        >
          Registrarse
        </UiButton>
      </div>
      
      <p class="text-xs text-center text-gray-500 mt-4">
        Al registrarte, aceptas nuestros 
        <NuxtLink to="/terms" class="text-red-500 hover:text-red-600">Términos y Condiciones</NuxtLink> 
        y 
        <NuxtLink to="/privacy" class="text-red-500 hover:text-red-600">Política de Privacidad</NuxtLink>.
      </p>
    </form>
    
    <div class="mt-6 text-center">
      <p class="text-sm text-gray-600">
        ¿Ya tienes una cuenta?
        <NuxtLink to="/auth/login" class="font-medium text-red-500 hover:text-red-600">
          Inicia sesión aquí
        </NuxtLink>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useAuthStore } from '~/stores/auth'
import type { RegisterData } from '~/types'

// Definir el layout
definePageMeta({
  layout: 'auth'
})

// Establecer el título de la página
useHead({
  title: 'Crear cuenta'
})

// Estado
const firstName = ref('')
const lastName = ref('')
const email = ref('')
const phone = ref('')
const password = ref('')
const passwordConfirmation = ref('')
const role = ref<'client' | 'professional'>('client')
const isLoading = ref(false)
const registerSuccess = ref(false)
const errors = reactive({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  password: '',
  passwordConfirmation: '',
  role: '',
  general: ''
})

// Store de autenticación
const authStore = useAuthStore()
const router = useRouter()

// Métodos
const validateForm = (): boolean => {
  // Resetear errores
  Object.keys(errors).forEach(key => {
    errors[key as keyof typeof errors] = ''
  })
  
  let isValid = true
  
  // Validar nombre
  if (!firstName.value.trim()) {
    errors.firstName = 'El nombre es obligatorio'
    isValid = false
  }
  
  // Validar apellidos
  if (!lastName.value.trim()) {
    errors.lastName = 'Los apellidos son obligatorios'
    isValid = false
  }
  
  // Validar email
  if (!email.value) {
    errors.email = 'El correo electrónico es obligatorio'
    isValid = false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    errors.email = 'Introduce un correo electrónico válido'
    isValid = false
  }
  
  // Validar teléfono (ahora obligatorio)
  if (!phone.value) {
    errors.phone = 'El teléfono es obligatorio'
    isValid = false
  } else if (!/^\d{9,10}$/.test(phone.value.replace(/\s+/g, ''))) {
    errors.phone = 'Introduce un número de teléfono válido'
    isValid = false
  }
  
  // Validar contraseña
  if (!password.value) {
    errors.password = 'La contraseña es obligatoria'
    isValid = false
  } else if (password.value.length < 8) {
    errors.password = 'La contraseña debe tener al menos 8 caracteres'
    isValid = false
  } else if (!/[A-Z]/.test(password.value) || !/[0-9]/.test(password.value)) {
    errors.password = 'La contraseña debe contener al menos una mayúscula y un número'
    isValid = false
  }
  
  // Validar confirmación de contraseña
  if (password.value !== passwordConfirmation.value) {
    errors.passwordConfirmation = 'Las contraseñas no coinciden'
    isValid = false
  }
  
  // Validar rol
  if (!role.value) {
    errors.role = 'Selecciona un tipo de cuenta'
    isValid = false
  }
  
  return isValid
}

const handleRegister = async () => {
  if (!validateForm()) return
  
  try {
    isLoading.value = true
    errors.general = ''
    registerSuccess.value = false
    
    const userData: RegisterData = {
      firstName: firstName.value,
      lastName: lastName.value,
      email: email.value,
      password: password.value,
      phone: phone.value,
      role: role.value
    }
    
    await authStore.register(userData)
    
    // Mostrar mensaje de éxito
    registerSuccess.value = true
    
    // Esperar 3 segundos antes de redirigir
    setTimeout(() => {
      // Redirigir a la página de inicio de sesión
      router.push('/auth/login')
    }, 3000)
  } catch (error) {
    registerSuccess.value = false
    errors.general = error instanceof Error ? error.message : 'Error al crear la cuenta'
  } finally {
    isLoading.value = false
  }
}
</script>