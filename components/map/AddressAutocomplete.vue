<script setup lang="ts">
import { ref, onMounted, watch, onUnmounted } from 'vue'
import { autocompleteOptions } from '~/config/maps'
import { useGoogleMaps } from '~/composables/useGoogleMaps'
import type { Location } from '~/types'

const props = defineProps<{
  modelValue?: Location
  placeholder?: string
  apiKey?: string
  label?: string
  required?: boolean
  error?: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', location: Location): void
  (e: 'selected', location: Location): void
  (e: 'error', message: string): void
}>()

// Referencias y estado
const inputElement = ref<HTMLInputElement | null>(null)
const addressInput = ref<string>('')
const autocomplete = ref<google.maps.places.Autocomplete | null>(null)
const isLoading = ref(false)
const errorMessage = ref<string | null>(null)
const placeChangedListener = ref<google.maps.MapsEventListener | null>(null)

// Si hay un valor inicial, mostrarlo en el input
watch(() => props.modelValue, (newValue) => {
  if (newValue && newValue.address && addressInput.value === '') {
    addressInput.value = newValue.address
  }
}, { immediate: true })

// Usar el composable de Google Maps
const { loadGoogleMapsScript, isLoaded } = useGoogleMaps()

// Inicializar el autocompletado
async function initializeAutocomplete() {
  if (!inputElement.value) return
  isLoading.value = true
  
  try {
    // Cargar el script de Google Maps si no está cargado
    const apiKeyToUse = props.apiKey || ''
    await loadGoogleMapsScript(apiKeyToUse)
    
    // Crear el autocompletado
    autocomplete.value = new google.maps.places.Autocomplete(
      inputElement.value,
      autocompleteOptions
    )
    
    // Escuchar el evento de selección de lugar
    placeChangedListener.value = google.maps.event.addListener(
      autocomplete.value, 
      'place_changed', 
      handlePlaceSelect
    )
    
    errorMessage.value = null
  } catch (error) {
    const errorMsg = error instanceof Error 
      ? error.message 
      : 'Error al inicializar el autocompletado'
    
    errorMessage.value = errorMsg
    emit('error', errorMsg)
    console.error('Error al inicializar el autocompletado:', error)
  } finally {
    isLoading.value = false
  }
}

// Manejar la selección de un lugar
function handlePlaceSelect() {
  if (!autocomplete.value) return
  
  const place = autocomplete.value.getPlace()
  
  // Verificar que el lugar tenga la información necesaria
  if (!place.geometry || !place.geometry.location) {
    errorMessage.value = 'La dirección seleccionada no es válida'
    emit('error', errorMessage.value)
    return
  }
  
  // Obtener la información de la dirección
  const location: Location = {
    latitude: place.geometry.location.lat(),
    longitude: place.geometry.location.lng(),
    address: place.formatted_address || addressInput.value,
    city: extractCityFromPlace(place),
    zipCode: extractZipCodeFromPlace(place)
  }
  
  // Emitir el evento con la nueva ubicación
  emit('update:modelValue', location)
  emit('selected', location)
  
  errorMessage.value = null
}

// Extraer la ciudad de los componentes de la dirección
function extractCityFromPlace(place: google.maps.places.PlaceResult): string {
  if (!place.address_components) return ''
  
  // Buscar el componente de localidad o población
  const cityComponent = place.address_components.find(component => 
    component.types.includes('locality') || 
    component.types.includes('administrative_area_level_2')
  )
  
  return cityComponent ? cityComponent.long_name : ''
}

// Extraer el código postal de los componentes de la dirección
function extractZipCodeFromPlace(place: google.maps.places.PlaceResult): string {
  if (!place.address_components) return ''
  
  // Buscar el componente de código postal
  const zipComponent = place.address_components.find(component => 
    component.types.includes('postal_code')
  )
  
  return zipComponent ? zipComponent.long_name : ''
}

// Ciclo de vida
onMounted(() => {
  initializeAutocomplete()
})

onUnmounted(() => {
  // Limpiar listener para evitar memory leaks
  if (placeChangedListener.value) {
    google.maps.event.removeListener(placeChangedListener.value)
  }
  
  if (autocomplete.value) {
    google.maps.event.clearInstanceListeners(autocomplete.value)
  }
})
</script>

<template>
  <div class="address-autocomplete">
    <label 
      v-if="label" 
      :for="label.toLowerCase().replace(/\s+/g, '-')" 
      class="block text-sm font-medium text-gray-700 mb-1"
    >
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>
    
    <div class="relative">
      <input
        ref="inputElement"
        v-model="addressInput"
        type="text"
        :id="label?.toLowerCase().replace(/\s+/g, '-')"
        :placeholder="placeholder || 'Buscar dirección...'"
        class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
        :class="{ 'border-red-500': error || errorMessage }"
        :required="required"
      />
      
      <div 
        v-if="isLoading" 
        class="absolute top-1/2 right-3 transform -translate-y-1/2"
      >
        <div class="w-5 h-5 border-2 border-gray-300 border-t-red-500 rounded-full animate-spin"></div>
      </div>
    </div>
    
    <p v-if="error || errorMessage" class="mt-1 text-sm text-red-600">
      {{ error || errorMessage }}
    </p>
    
    <p v-if="!isLoaded" class="mt-1 text-xs text-gray-500">
      Cargando servicio de autocompletado...
    </p>
  </div>
</template> 