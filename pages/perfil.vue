<template>
  <!-- Contenedor principal del perfil de usuario -->
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Título de la página -->
      <header class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">
          Perfil de Usuario
        </h1>
        <p class="mt-2 text-sm text-gray-600">
          Gestiona tu información personal y configuración de cuenta
        </p>
      </header>

      <!-- Indicador de carga -->
      <div v-if="loading" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span class="ml-3 text-gray-600">Cargando perfil...</span>
      </div>

      <!-- Mensaje de error -->
      <div v-else-if="error" 
           class="bg-red-50 border border-red-200 rounded-md p-4 mb-6"
           role="alert"
           aria-live="polite">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-red-800">Error al cargar perfil</h3>
            <p class="mt-1 text-sm text-red-700">{{ error }}</p>
          </div>
        </div>
      </div>

      <!-- Formulario de perfil -->
      <form v-else-if="profile" 
            @submit.prevent="handleGuardarCambios"
            class="bg-white shadow-sm rounded-lg overflow-hidden">
        
        <!-- Sección: Datos básicos -->
        <fieldset class="p-6 border-b border-gray-200">
          <legend class="text-lg font-medium text-gray-900 mb-4">
            Datos Básicos
          </legend>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Campo: Nombre -->
            <div>
              <label for="nombre" class="block text-sm font-medium text-gray-700 mb-2">
                Nombre completo <span class="text-red-500">*</span>
              </label>
              <input
                id="nombre"
                v-model="formData.nombre"
                :disabled="mode === 'readonly'"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                :class="{ 'border-red-300': !validation.nombre.valid }"
                @input="handleValidarCampo('nombre', $event)"
                aria-describedby="nombre-error"
              />
              <div v-if="!validation.nombre.valid" 
                   id="nombre-error"
                   class="mt-1 text-sm text-red-600"
                   role="alert">
                {{ validation.nombre.message }}
              </div>
            </div>

            <!-- Campo: Correo -->
            <div>
              <label for="correo" class="block text-sm font-medium text-gray-700 mb-2">
                Correo electrónico <span class="text-red-500">*</span>
              </label>
              <input
                id="correo"
                v-model="formData.correo"
                :disabled="mode === 'readonly'"
                type="email"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                :class="{ 'border-red-300': !validation.correo.valid }"
                @input="handleValidarCampo('correo', $event)"
                aria-describedby="correo-error"
              />
              <div v-if="!validation.correo.valid" 
                   id="correo-error"
                   class="mt-1 text-sm text-red-600"
                   role="alert">
                {{ validation.correo.message }}
              </div>
            </div>

            <!-- Campo: Teléfono -->
            <div>
              <label for="telefono" class="block text-sm font-medium text-gray-700 mb-2">
                Teléfono <span class="text-red-500">*</span>
              </label>
              <input
                id="telefono"
                v-model="formData.telefono"
                :disabled="mode === 'readonly'"
                type="tel"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                :class="{ 'border-red-300': !validation.telefono.valid }"
                @input="handleValidarCampo('telefono', $event)"
                aria-describedby="telefono-error"
                placeholder="Ej: +57 301 234 5678"
              />
              <div v-if="!validation.telefono.valid" 
                   id="telefono-error"
                   class="mt-1 text-sm text-red-600"
                   role="alert">
                {{ validation.telefono.message }}
              </div>
            </div>

            <!-- Campo: Foto de perfil -->
            <div>
              <label for="foto" class="block text-sm font-medium text-gray-700 mb-2">
                Foto de perfil
              </label>
              
              <!-- Vista previa de imagen -->
              <div v-if="imagePreview" class="mb-3">
                <img 
                  :src="imagePreview" 
                  alt="Vista previa de foto de perfil"
                  class="h-24 w-24 rounded-full object-cover border-2 border-gray-200"
                />
              </div>

              <!-- Input de archivo -->
              <input
                id="foto"
                :disabled="mode === 'readonly'"
                type="file"
                accept="image/*"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                @change="handleCambioImagen"
              />
              <p class="mt-1 text-xs text-gray-500">
                JPG, PNG, GIF hasta 5MB
              </p>
            </div>
          </div>
        </fieldset>

        <!-- Sección: Datos de profesional (solo si es profesional) -->
        <fieldset v-if="esProfesional" class="p-6 border-b border-gray-200">
          <legend class="text-lg font-medium text-gray-900 mb-4">
            Datos Profesionales
          </legend>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Campo: Calle -->
            <div class="md:col-span-2">
              <label for="calle" class="block text-sm font-medium text-gray-700 mb-2">
                Calle y número <span class="text-red-500">*</span>
              </label>
              <input
                id="calle"
                v-model="formData.direccion!.calle"
                :disabled="mode === 'readonly'"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                :class="{ 'border-red-300': validation.calle && !validation.calle.valid }"
                @input="handleValidarCampo('calle', $event)"
                aria-describedby="calle-error"
                placeholder="Ej: Carrera 15 # 93-47"
              />
              <div v-if="validation.calle && !validation.calle.valid" 
                   id="calle-error"
                   class="mt-1 text-sm text-red-600"
                   role="alert">
                {{ validation.calle.message }}
              </div>
            </div>

            <!-- Campo: Departamento -->
            <div>
              <label for="estado" class="block text-sm font-medium text-gray-700 mb-2">
                Departamento <span class="text-red-500">*</span>
              </label>
              <select
                id="estado"
                v-model="formData.direccion!.estado"
                :disabled="mode === 'readonly'"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                :class="{ 'border-red-300': validation.estado && !validation.estado.valid }"
                @change="handleCambioEstado"
                aria-describedby="estado-error"
              >
                <option value="">Seleccionar departamento</option>
                <option 
                  v-for="estado in estados" 
                  :key="estado.id" 
                  :value="estado.id"
                >
                  {{ estado.nombre }}
                </option>
              </select>
              <div v-if="validation.estado && !validation.estado.valid" 
                   id="estado-error"
                   class="mt-1 text-sm text-red-600"
                   role="alert">
                {{ validation.estado.message }}
              </div>
            </div>

            <!-- Campo: Ciudad -->
            <div>
              <label for="ciudad" class="block text-sm font-medium text-gray-700 mb-2">
                Ciudad <span class="text-red-500">*</span>
              </label>
              <select
                id="ciudad"
                v-model="formData.direccion!.ciudad"
                :disabled="mode === 'readonly' || !formData.direccion?.estado"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                :class="{ 'border-red-300': validation.ciudad && !validation.ciudad.valid }"
                @change="handleValidarCampo('ciudad', $event)"
                aria-describedby="ciudad-error"
              >
                <option value="">Seleccionar ciudad</option>
                <option 
                  v-for="ciudad in ciudadesDisponibles" 
                  :key="ciudad.id" 
                  :value="ciudad.id"
                >
                  {{ ciudad.nombre }}
                </option>
              </select>
              <div v-if="validation.ciudad && !validation.ciudad.valid" 
                   id="ciudad-error"
                   class="mt-1 text-sm text-red-600"
                   role="alert">
                {{ validation.ciudad.message }}
              </div>
            </div>

            <!-- Campo: Código postal -->
            <div>
              <label for="codigoPostal" class="block text-sm font-medium text-gray-700 mb-2">
                Código postal <span class="text-red-500">*</span>
              </label>
              <input
                id="codigoPostal"
                v-model="formData.direccion!.codigoPostal"
                :disabled="mode === 'readonly'"
                type="text"
                maxlength="6"
                pattern="[0-9]{6}"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                :class="{ 'border-red-300': validation.codigoPostal && !validation.codigoPostal.valid }"
                @input="handleValidarCampo('codigoPostal', $event)"
                aria-describedby="codigoPostal-error"
                placeholder="Ej: 110221"
              />
              <div v-if="validation.codigoPostal && !validation.codigoPostal.valid" 
                   id="codigoPostal-error"
                   class="mt-1 text-sm text-red-600"
                   role="alert">
                {{ validation.codigoPostal.message }}
              </div>
            </div>

            <!-- Campo: Descripción -->
            <div class="md:col-span-2">
              <label for="descripcion" class="block text-sm font-medium text-gray-700 mb-2">
                Descripción profesional <span class="text-red-500">*</span>
              </label>
              <textarea
                id="descripcion"
                v-model="formData.descripcion"
                :disabled="mode === 'readonly'"
                rows="4"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                :class="{ 'border-red-300': validation.descripcion && !validation.descripcion.valid }"
                @input="handleValidarCampo('descripcion', $event)"
                aria-describedby="descripcion-error"
                placeholder="Describe tus servicios, experiencia y especialidades..."
              ></textarea>
              <div class="flex justify-between items-center mt-1">
                <div v-if="validation.descripcion && !validation.descripcion.valid" 
                     id="descripcion-error"
                     class="text-sm text-red-600"
                     role="alert">
                  {{ validation.descripcion.message }}
                </div>
                <div class="text-xs text-gray-500">
                  Mínimo 20 caracteres ({{ formData.descripcion?.length || 0 }}/20)
                </div>
              </div>
            </div>
          </div>
        </fieldset>

        <!-- Botones de acción -->
        <div class="px-6 py-4 bg-gray-50 flex flex-col sm:flex-row gap-3 justify-between">
          <!-- Botones principales -->
          <div class="flex flex-col sm:flex-row gap-3">
            <!-- Botón Editar -->
            <button
              v-if="mode === 'readonly'"
              type="button"
              @click="habilitarEdicion"
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              data-cursor="clickable"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
              </svg>
              Editar perfil
            </button>

            <!-- Botón Guardar -->
            <button
              v-if="mode === 'editing'"
              type="submit"
              :disabled="!puedeGuardar || saving"
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
              data-cursor="clickable"
            >
              <svg v-if="saving" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <svg v-else class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
              </svg>
              {{ saving ? 'Guardando...' : 'Guardar cambios' }}
            </button>

            <!-- Botón Cancelar -->
            <button
              v-if="mode === 'editing'"
              type="button"
              @click="cancelarEdicion"
              class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              data-cursor="clickable"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
              Cancelar
            </button>
          </div>

          <!-- Botón Eliminar perfil -->
          <button
            type="button"
            @click="mostrarModalEliminacion = true"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            data-cursor="clickable"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
            </svg>
            Eliminar perfil
          </button>
        </div>
      </form>
    </div>

    <!-- Modal de confirmación para eliminar perfil -->
    <div v-if="mostrarModalEliminacion" 
         class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
         @click="cerrarModalEliminacion"
         role="dialog"
         aria-modal="true"
         aria-labelledby="modal-title">
      <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white"
           @click.stop>
        
        <!-- Encabezado del modal -->
        <div class="mt-3 text-center">
          <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
            <svg class="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"/>
            </svg>
          </div>
          
          <h3 id="modal-title" class="text-lg leading-6 font-medium text-gray-900 mt-4">
            Eliminar perfil
          </h3>
          
          <div class="mt-2 px-7 py-3">
            <p class="text-sm text-gray-500">
              ¿Estás seguro de que deseas eliminar tu perfil? Esta acción es irreversible 
              y perderás toda tu información permanentemente.
            </p>
          </div>
        </div>

        <!-- Mensaje de error en modal -->
        <div v-if="errorModal" 
             class="mx-7 mb-3 p-3 bg-red-50 border border-red-200 rounded-md">
          <p class="text-sm text-red-600">{{ errorModal }}</p>
        </div>

        <!-- Botones del modal -->
        <div class="items-center px-4 py-3">
          <div class="flex flex-col sm:flex-row gap-3">
            <button
              @click="handleEliminarPerfil"
              :disabled="deleting"
              class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
              data-cursor="clickable"
            >
              <svg v-if="deleting" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ deleting ? 'Eliminando...' : 'Confirmar eliminación' }}
            </button>
            
            <button
              @click="cerrarModalEliminacion"
              :disabled="deleting"
              class="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              data-cursor="clickable"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Configuración de la página
definePageMeta({
  title: 'Perfil de Usuario',
  layout: 'default'
})

// Imports de composables
const { 
  profile, loading, error, saving, deleting, mode, formData, validation, 
  imagePreview, puedeGuardar, esProfesional, cargarPerfil, validarCampo,
  manejarCambioImagen, habilitarEdicion, cancelarEdicion, guardarCambios, 
  eliminarPerfil 
} = useProfile()

const { 
  estados, ciudadesDisponibles, actualizarCiudades 
} = useLocations()

// Estados locales para el modal
const mostrarModalEliminacion = ref(false)
const errorModal = ref<string | null>(null)

// Router para navegación
const router = useRouter()
const route = useRoute()

// Store de autenticación para obtener el usuario actual
const authStore = useAuthStore()

// ID del usuario desde el store de autenticación (ya no hardcodeado)
const userId = computed(() => {
  return authStore.user?.id || null
})

/**
 * Carga inicial de datos al montar el componente
 */
onMounted(async () => {
  // Verificar que el usuario esté autenticado
  if (!userId.value) {
    console.warn('Usuario no autenticado, redirigiendo al login')
    await router.push('/auth/login')
    return
  }
  
  await cargarPerfil(userId.value)
})

/**
 * Maneja la validación de un campo específico
 */
const handleValidarCampo = (campo: string, event: Event) => {
  const target = event.target as HTMLInputElement | HTMLTextAreaElement
  validarCampo(campo as any, target.value)
}

/**
 * Maneja el cambio de estado y actualiza las ciudades disponibles
 */
const handleCambioEstado = (event: Event) => {
  const target = event.target as HTMLSelectElement
  const estadoId = target.value
  
  // Validar campo estado
  validarCampo('estado', estadoId)
  
  // Limpiar ciudad seleccionada
  if (formData.value.direccion) {
    formData.value.direccion.ciudad = ''
  }
  
  // Actualizar ciudades disponibles
  if (estadoId) {
    actualizarCiudades(estadoId)
  }
}

/**
 * Maneja el cambio de archivo de imagen
 */
const handleCambioImagen = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  
  if (file) {
    manejarCambioImagen(file)
  }
}

/**
 * Maneja el guardado de cambios
 */
const handleGuardarCambios = async () => {
  try {
    await guardarCambios(userId.value)
    
    // Mostrar mensaje de éxito (puedes usar una librería de toast)
    console.log('Perfil actualizado correctamente')
    
  } catch (err) {
    console.error('Error al guardar cambios:', err)
    // El error ya se maneja en el composable
  }
}

/**
 * Maneja la eliminación del perfil
 */
const handleEliminarPerfil = async () => {
  try {
    errorModal.value = null
    await eliminarPerfil(userId.value)
    
    // Cerrar modal
    mostrarModalEliminacion.value = false
    
    // Redireccionar a la página principal
    await router.push('/')
    
    // Mostrar mensaje de éxito
    console.log('Perfil eliminado correctamente')
    
  } catch (err) {
    console.error('Error al eliminar perfil:', err)
    errorModal.value = err instanceof Error ? err.message : 'Error desconocido al eliminar perfil'
  }
}

/**
 * Cierra el modal de eliminación
 */
const cerrarModalEliminacion = () => {
  mostrarModalEliminacion.value = false
  errorModal.value = null
}

// Configuración del head para SEO
useHead({
  title: 'Perfil de Usuario - BeautyGo',
  meta: [
    { name: 'description', content: 'Gestiona tu perfil de usuario en BeautyGo' },
    { name: 'robots', content: 'noindex, nofollow' } // Páginas de perfil no deben ser indexadas
  ]
})
</script>

<style scoped>
/* Estilos específicos para la página de perfil */

/* Animación para los campos con error */
.border-red-300 {
  animation: shake 0.3s ease-in-out;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-2px); }
  75% { transform: translateX(2px); }
}

/* Mejoras de accesibilidad para focus */
input:focus, 
select:focus, 
textarea:focus {
  outline: 2px solid transparent;
  outline-offset: 2px;
}

/* Responsive para pantallas pequeñas */
@media (max-width: 640px) {
  .grid {
    grid-template-columns: 1fr;
  }
  
  .md\:col-span-2 {
    grid-column: span 1 / span 1;
  }
  
  /* Modal responsive */
  .fixed .w-96 {
    width: calc(100vw - 2rem);
    max-width: 24rem;
  }
}

/* Estados de hover para elementos interactivos */
button[data-cursor="clickable"]:hover {
  transform: translateY(-1px);
  transition: transform 0.1s ease-in-out;
}

/* Indicador visual para campos obligatorios */
.text-red-500 {
  font-weight: 600;
}

/* Estilos para vista previa de imagen */
img {
  transition: transform 0.2s ease-in-out;
}

img:hover {
  transform: scale(1.05);
}
</style> 