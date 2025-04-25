<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useGoogleMaps } from '~/composables/useGoogleMaps'
import type { MapMarker } from '~/types'
import { googleMapsConfig, mapIcons } from '~/config/maps'

const props = defineProps<{
  markers?: MapMarker[]
  initialCenter?: google.maps.LatLngLiteral
  initialZoom?: number
  height?: string
  showCurrentLocation?: boolean
  apiKey?: string
}>()

const emit = defineEmits<{
  (e: 'markerClick', marker: MapMarker): void
  (e: 'mapClick', position: google.maps.LatLngLiteral): void
  (e: 'mapLoaded'): void
  (e: 'error', error: Error): void
}>()

// Referencias y estado
const mapContainer = ref<HTMLElement | null>(null)
const infoWindow = ref<google.maps.InfoWindow | null>(null)
const isLoading = ref(true)
const errorMessage = ref<string | null>(null)

// Usar el composable de Google Maps
const {
  isLoaded,
  mapInstance,
  markers: mapMarkers,
  loadGoogleMapsScript,
  initMap,
  addMarkers,
  removeMarkers,
  panTo,
  getUserLocation
} = useGoogleMaps()

// Inicializar el mapa
async function initializeMap() {
  if (!mapContainer.value) return
  isLoading.value = true
  
  try {
    // Cargar el script de Google Maps
    const apiKeyToUse = props.apiKey || googleMapsConfig.apiKey
    if (!apiKeyToUse) {
      throw new Error('API key de Google Maps no configurada')
    }
    
    await loadGoogleMapsScript(apiKeyToUse)
    
    // Configurar opciones del mapa
    const mapOptions = {
      zoom: props.initialZoom || googleMapsConfig.defaultZoom,
      center: props.initialCenter || googleMapsConfig.defaultCenter,
      styles: googleMapsConfig.styles,
      disableDefaultUI: false,
      zoomControl: true,
      mapTypeControl: false,
      scaleControl: true,
      streetViewControl: false,
      rotateControl: false,
      fullscreenControl: true
    }
    
    // Crear el mapa
    const map = initMap(mapContainer.value, mapOptions)
    
    if (!map) {
      throw new Error('Error al inicializar el mapa')
    }
    
    // Crear una ventana de información
    infoWindow.value = new google.maps.InfoWindow({
      maxWidth: 300
    })
    
    // Si hay marcadores, añadirlos
    if (props.markers && props.markers.length > 0) {
      addMarkersToMap()
    }
    
    // Si se debe mostrar la ubicación actual
    if (props.showCurrentLocation) {
      try {
        const currentLocation = await getUserLocation()
        
        // Añadir un marcador para la ubicación actual
        addMarkers([{
          id: 'current-location',
          position: currentLocation,
          title: 'Tu ubicación actual',
          icon: '/images/map/current-location.svg'
        }])
        
        // Centrar el mapa en la ubicación actual
        panTo(currentLocation, props.initialZoom || googleMapsConfig.defaultZoom)
      } catch (locationError) {
        console.warn('No se pudo obtener la ubicación actual:', locationError)
      }
    }
    
    // Evento click en el mapa
    google.maps.event.addListener(map, 'click', (e: any) => {
      if (e.latLng) {
        const position = {
          lat: e.latLng.lat(),
          lng: e.latLng.lng()
        }
        emit('mapClick', position)
      }
    })
    
    emit('mapLoaded')
  } catch (error) {
    const errorObj = error instanceof Error ? error : new Error('Error desconocido')
    errorMessage.value = errorObj.message
    emit('error', errorObj)
    console.error('Error al inicializar Google Maps:', error)
  } finally {
    isLoading.value = false
  }
}

// Añadir marcadores al mapa
function addMarkersToMap() {
  if (!mapInstance.value || !props.markers) return
  
  // Primero eliminar los marcadores existentes
  removeMarkers()
  
  // Transformar los marcadores a formato de Google Maps
  const mappedMarkers = props.markers.map(marker => {
    // Determinar el ícono basado en si hay información del profesional o servicio
    let icon = marker.icon || mapIcons.default
    
    // Crear el contenido de la ventana de información
    let infoContent = ''
    
    if (marker.professional) {
      // Si es un profesional, mostrar información del profesional
      const prof = marker.professional
      infoContent = `
        <div class="map-info-window">
          <h3 class="text-lg font-medium text-gray-900">${prof.name}</h3>
          <div class="flex items-center mt-1">
            <span class="text-yellow-500 mr-1">★</span>
            <span class="text-sm font-medium">${prof.rating.toFixed(1)}</span>
            <span class="text-xs text-gray-500 ml-1">(${prof.reviewCount})</span>
          </div>
          ${prof.services.length > 0 ? 
            `<p class="text-sm text-gray-600 mt-1">${prof.services[0].name}</p>` : ''}
          <button 
            class="mt-2 px-3 py-1 bg-red-500 text-white text-sm rounded-full hover:bg-red-600 transition-colors"
            onclick="window.navigateToProfessional('${prof.id}')"
          >
            Ver perfil
          </button>
        </div>
      `
    } else if (marker.service) {
      // Si es un servicio, mostrar información del servicio
      const serv = marker.service
      infoContent = `
        <div class="map-info-window">
          <h3 class="text-lg font-medium text-gray-900">${serv.name}</h3>
          <p class="text-sm text-gray-600 mt-1">${serv.description}</p>
          <div class="flex justify-between items-center mt-2">
            <span class="font-medium text-red-500">${serv.price.toFixed(2)}€</span>
            <span class="text-xs text-gray-500">${serv.duration} min</span>
          </div>
        </div>
      `
    } else if (marker.title) {
      // Si solo hay un título, mostrar solo el título
      infoContent = `
        <div class="map-info-window">
          <h3 class="text-lg font-medium text-gray-900">${marker.title}</h3>
        </div>
      `
    }
    
    return {
      id: marker.id,
      position: marker.position,
      title: marker.title,
      icon,
      infoContent
    }
  })
  
  // Añadir los marcadores al mapa
  addMarkers(mappedMarkers, mapInstance.value)
  
  // Configurar eventos para los marcadores
  mapMarkers.value.forEach((googleMarker, id) => {
    const originalMarker = props.markers?.find(m => m.id === id)
    
    if (originalMarker) {
      google.maps.event.addListener(googleMarker, 'click', () => {
        // Abrir la ventana de información
        if (infoWindow.value && mapInstance.value) {
          const mappedMarker = mappedMarkers.find(m => m.id === id)
          if (mappedMarker && mappedMarker.infoContent) {
            infoWindow.value.setContent(mappedMarker.infoContent)
            infoWindow.value.open(mapInstance.value, googleMarker)
          }
        }
        
        // Emitir evento de click en marcador
        emit('markerClick', originalMarker)
      })
    }
  })
  
  // Si hay marcadores, ajustar el mapa para mostrarlos todos
  if (mappedMarkers.length > 1 && mapInstance.value) {
    const bounds = new google.maps.LatLngBounds()
    mappedMarkers.forEach(marker => {
      bounds.extend(marker.position)
    })
    mapInstance.value.fitBounds(bounds)
  } else if (mappedMarkers.length === 1 && mapInstance.value) {
    // Si solo hay un marcador, centrar el mapa en él
    panTo(mappedMarkers[0].position, props.initialZoom || googleMapsConfig.defaultZoom)
  }
}

// Observar cambios en los marcadores
watch(() => props.markers, () => {
  if (isLoaded.value && mapInstance.value) {
    addMarkersToMap()
  }
}, { deep: true })

// Ciclo de vida
onMounted(() => {
  // Si window está definido, añadir función para navegar a profesional desde la infoWindow
  if (import.meta.client) {
    // Declarar el tipo para window.navigateToProfessional
    window.navigateToProfessional = (id: string) => {
      navigateTo(`/professionals/${id}`)
    }
  }
  
  initializeMap()
})

onUnmounted(() => {
  // Limpiar la función global
  if (import.meta.client) {
    // Eliminar la propiedad de window
    if ('navigateToProfessional' in window) {
      delete (window as any).navigateToProfessional
    }
  }
})
</script>

<template>
  <div 
    class="google-map-container relative rounded-xl overflow-hidden"
    :style="{ height: height || '400px' }"
  >
    <!-- Contenedor del mapa -->
    <div 
      ref="mapContainer" 
      class="w-full h-full"
    ></div>
    
    <!-- Indicador de carga -->
    <div 
      v-if="isLoading" 
      class="absolute inset-0 flex flex-col items-center justify-center bg-white bg-opacity-80 z-10"
    >
      <div class="w-12 h-12 border-4 border-red-200 border-t-red-500 rounded-full animate-spin mb-2"></div>
      <p class="text-sm font-medium text-gray-700">Cargando mapa...</p>
    </div>
    
    <!-- Mensaje de error -->
    <div 
      v-if="errorMessage" 
      class="absolute inset-0 flex flex-col items-center justify-center bg-white bg-opacity-90 z-10 p-4"
    >
      <div class="text-red-500 mb-2">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <p class="text-sm font-medium text-gray-700 text-center">{{ errorMessage }}</p>
      <p class="text-xs text-gray-500 mt-2 text-center">
        Asegúrate de tener configurada correctamente la API key de Google Maps
      </p>
    </div>
  </div>
</template>

<style>
/* Estilos para las ventanas de información de Google Maps */
.gm-style .gm-style-iw-c {
  padding: 12px;
  border-radius: 8px;
}

.map-info-window h3 {
  margin: 0;
  font-size: 1rem;
  font-weight: 500;
  color: #1f2937;
}

.map-info-window p {
  margin: 4px 0 0;
  font-size: 0.875rem;
  color: #6b7280;
}

/* Ocultar el pequeño triángulo en la parte inferior de la ventana de información */
.gm-style .gm-style-iw-t::after {
  display: none;
}
</style> 