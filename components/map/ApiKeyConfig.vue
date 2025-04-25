<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { googleMapsConfig } from '~/config/maps'

const apiKey = ref<string>(googleMapsConfig.apiKey || '')
const isConfigured = computed(() => !!apiKey.value && apiKey.value.length > 10)
const showApiInfo = ref(false)

const emit = defineEmits<{
  (e: 'update:apiKey', value: string): void
}>()

function saveApiKey() {
  // Guardar la API key en localStorage para persistirla
  if (import.meta.client) {
    try {
      localStorage.setItem('googleMapsApiKey', apiKey.value)
      
      // Emitir evento para actualizar la API key en el componente padre
      emit('update:apiKey', apiKey.value)
      
      // Recargar la página para aplicar la nueva API key
      window.location.reload()
    } catch (e) {
      console.error('Error al guardar la API key:', e)
    }
  }
}

// Inicializar la API key desde localStorage si está disponible
onMounted(() => {
  if (import.meta.client) {
    try {
      const storedApiKey = localStorage.getItem('googleMapsApiKey')
      if (storedApiKey) {
        apiKey.value = storedApiKey
        emit('update:apiKey', apiKey.value)
      }
    } catch (e) {
      console.error('Error al obtener la API key:', e)
    }
  }
})
</script>

<template>
  <div class="bg-white rounded-lg shadow-sm p-4 mb-6">
    <div class="flex items-center justify-between mb-3">
      <h3 class="text-lg font-medium text-gray-900">
        Configuración de Google Maps
      </h3>
      
      <button 
        type="button"
        class="text-gray-500 hover:text-gray-700 transition-colors"
        @click="showApiInfo = !showApiInfo"
      >
        <span v-if="!showApiInfo">Mostrar info</span>
        <span v-else>Ocultar info</span>
      </button>
    </div>
    
    <div v-if="showApiInfo" class="mb-4 p-3 bg-blue-50 rounded-md text-sm text-blue-800">
      <p class="mb-2">
        <strong>¿Por qué se necesita una API key?</strong> Google Maps Platform requiere una clave de API para funcionar correctamente. Esta clave permite:
      </p>
      <ul class="list-disc list-inside mb-2 pl-2">
        <li>Cargar los mapas interactivos</li>
        <li>Utilizar el servicio de autocompletado de direcciones</li>
        <li>Geocodificar direcciones</li>
        <li>Calcular rutas</li>
      </ul>
      <p class="mb-2">
        <strong>¿Cómo obtener una API key?</strong> Puedes obtener una clave gratuita en <a href="https://console.cloud.google.com/google/maps-apis/overview" target="_blank" class="text-blue-600 underline">Google Cloud Console</a>. Google ofrece $200 mensuales en créditos gratuitos, lo que suele ser suficiente para proyectos pequeños o medianos.
      </p>
      <p>
        <strong>Restricciones:</strong> Es recomendable restringir tu clave de API por dominio y para los servicios específicos que vayas a utilizar: Maps JavaScript API, Places API y Geocoding API.
      </p>
    </div>
    
    <div class="flex items-end gap-3">
      <div class="flex-grow">
        <label for="api-key" class="block text-sm font-medium text-gray-700 mb-1">
          API Key de Google Maps
        </label>
        <input
          id="api-key"
          v-model="apiKey"
          type="text"
          placeholder="Ingresa tu API key aquí"
          class="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
          :class="{'border-green-500': isConfigured, 'border-yellow-400': !isConfigured}"
        />
      </div>
      
      <button
        type="button"
        class="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
        :disabled="!apiKey"
        @click="saveApiKey"
      >
        Guardar
      </button>
    </div>
    
    <div class="mt-2 flex items-center text-sm" :class="{'text-green-600': isConfigured, 'text-yellow-600': !isConfigured}">
      <span v-if="isConfigured" class="mr-1">✓</span>
      <span v-else class="mr-1">⚠️</span>
      {{ isConfigured ? 'API key configurada' : 'API key no configurada o inválida' }}
    </div>
  </div>
</template> 