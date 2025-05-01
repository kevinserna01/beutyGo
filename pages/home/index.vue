<template>
  <div class="min-h-screen py-4">
    <div class="container mx-auto px-4">
      <h1 class="text-2xl font-bold text-gray-900 mb-4">
        Servicios cerca de ti
      </h1>
      
      <!-- Mapa -->
      <div class="mb-6">
        <MapGoogleMap 
          :markers="professionalMarkers"
          :show-current-location="true"
          height="300px"
          @marker-click="handleMarkerClick"
          @map-loaded="handleMapLoaded"
          @error="handleMapError"
        />
        
        <div v-if="mapError" class="mt-2 p-2 bg-red-50 text-sm text-red-500 rounded">
          {{ mapError }}
        </div>
      </div>
      
      <!-- Categorías -->
      <div class="mb-6">
        <h2 class="text-lg font-medium text-gray-900 mb-3">
          Categorías
        </h2>
        
        <div class="grid grid-cols-4 gap-3">
          <div 
            v-for="category in categories" 
            :key="category.id"
            class="flex flex-col items-center p-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <div class="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-2">
              <span class="text-red-500 text-xl">{{ category.icon }}</span>
            </div>
            <span class="text-xs text-center">{{ category.name }}</span>
          </div>
        </div>
      </div>
      
      <!-- Profesionales destacados -->
      <div class="mb-6">
        <h2 class="text-lg font-medium text-gray-900 mb-3">
          Profesionales destacados
        </h2>
        
        <div class="space-y-4">
          <div 
            v-for="professional in professionals" 
            :key="professional.id"
            :id="`professional-${professional.id}`"
            class="bg-white rounded-xl shadow-sm overflow-hidden"
            :class="{'ring-2 ring-red-500': selectedProfessionalId === professional.id}"
          >
            <div class="flex">
              <div class="w-24 h-24 flex-shrink-0">
                <img 
                  :src="professional.photoURL || '/images/avatar-placeholder.png'" 
                  :alt="professional.name"
                  class="w-full h-full object-cover"
                />
              </div>
              
              <div class="p-3 flex-grow">
                <div class="flex justify-between">
                  <h3 class="font-medium text-gray-900">{{ professional.name }}</h3>
                  <div class="flex items-center">
                    <span class="text-yellow-500 mr-1">★</span>
                    <span class="text-sm font-medium">{{ professional.rating }}</span>
                  </div>
                </div>
                
                <p class="text-sm text-gray-500 line-clamp-2 mb-2">
                  {{ professional.description }}
                </p>
                
                <div class="flex justify-between items-center">
                  <span class="text-xs text-gray-500">
                    {{ services[professional.services[0]?.id]?.name || 'Sin servicios' }}
                  </span>
                  
                  <UiButton 
                    size="sm" 
                    @click="navigateTo(`/professionals/${professional.id}`)"
                  >
                    Ver perfil
                  </UiButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { Professional, ServiceCategory, Service, MapMarker } from '~/types'
import { mapIcons } from '~/config/maps'

// Establecer el título de la página
useHead({
  title: 'Inicio'
})

// Estado
const mapError = ref<string | null>(null)
const selectedProfessionalId = ref<string | null>(null)
const isMapLoaded = ref(false)

// Datos mock para la interfaz
const categories = ref<ServiceCategory[]>([
  { id: '1', name: 'Peluquería', icon: '✂️' },
  { id: '2', name: 'Maquillaje', icon: '💄' },
  { id: '3', name: 'Uñas', icon: '💅' },
  { id: '4', name: 'Masajes', icon: '👐' },
  { id: '5', name: 'Facial', icon: '😊' },
  { id: '6', name: 'Depilación', icon: '🦵' },
  { id: '7', name: 'Pestañas', icon: '👁️' },
  { id: '8', name: 'Cejas', icon: '🧿' }
])

const services = ref<Record<string, Service>>({
  '1': { 
    id: '1', 
    name: 'Corte de cabello', 
    description: 'Corte y peinado personalizado', 
    price: 25, 
    duration: 30, 
    category: categories.value[0] 
  },
  '2': { 
    id: '2', 
    name: 'Maquillaje para eventos', 
    description: 'Maquillaje profesional para eventos especiales', 
    price: 40, 
    duration: 60, 
    category: categories.value[1] 
  },
  '3': { 
    id: '3', 
    name: 'Manicura', 
    description: 'Manicura completa con esmaltado semipermanente', 
    price: 20, 
    duration: 40, 
    category: categories.value[2] 
  }
})

const professionals = ref<Professional[]>([
  {
    id: '1',
    name: 'María García',
    email: 'maria@beautygo.com',
    role: 'professional',
    createdAt: '2023-01-01',
    services: [{ id: '1', name: 'Corte de cabello', description: '', price: 25, duration: 30, category: categories.value[0] }],
    location: { latitude: 40.416775, longitude: -3.703790, address: 'Calle Mayor 10', city: 'Madrid' },
    description: 'Estilista con más de 10 años de experiencia en cortes modernos y coloración.',
    rating: 4.8,
    reviewCount: 120,
    availability: [
      { day: 'monday', startTime: '09:00', endTime: '18:00' },
      { day: 'tuesday', startTime: '09:00', endTime: '18:00' },
      { day: 'wednesday', startTime: '09:00', endTime: '18:00' },
      { day: 'thursday', startTime: '09:00', endTime: '18:00' },
      { day: 'friday', startTime: '09:00', endTime: '18:00' }
    ]
  },
  {
    id: '2',
    name: 'Laura Martínez',
    email: 'laura@beautygo.com',
    role: 'professional',
    createdAt: '2023-02-15',
    services: [{ id: '2', name: 'Maquillaje para eventos', description: '', price: 40, duration: 60, category: categories.value[1] }],
    location: { latitude: 40.413140, longitude: -3.699717, address: 'Calle Atocha 27', city: 'Madrid' },
    description: 'Maquilladora profesional especializada en looks para eventos y bodas.',
    rating: 4.9,
    reviewCount: 85,
    availability: [
      { day: 'monday', startTime: '10:00', endTime: '19:00' },
      { day: 'tuesday', startTime: '10:00', endTime: '19:00' },
      { day: 'thursday', startTime: '10:00', endTime: '19:00' },
      { day: 'friday', startTime: '10:00', endTime: '19:00' },
      { day: 'saturday', startTime: '10:00', endTime: '15:00' }
    ]
  },
  {
    id: '3',
    name: 'Sofía Rodríguez',
    email: 'sofia@beautygo.com',
    role: 'professional',
    createdAt: '2023-03-10',
    services: [{ id: '3', name: 'Manicura', description: '', price: 20, duration: 40, category: categories.value[2] }],
    location: { latitude: 40.425512, longitude: -3.687678, address: 'Calle Serrano 41', city: 'Madrid' },
    description: 'Especialista en uñas con técnicas innovadoras y diseños personalizados.',
    rating: 4.7,
    reviewCount: 64,
    availability: [
      { day: 'tuesday', startTime: '09:30', endTime: '18:30' },
      { day: 'wednesday', startTime: '09:30', endTime: '18:30' },
      { day: 'thursday', startTime: '09:30', endTime: '18:30' },
      { day: 'friday', startTime: '09:30', endTime: '18:30' },
      { day: 'saturday', startTime: '10:00', endTime: '14:00' }
    ]
  }
])

// Transformar profesionales a marcadores para el mapa
const professionalMarkers = computed<MapMarker[]>(() => {
  return professionals.value.map(professional => {
    // Obtener el icono según el tipo de servicio
    let icon = mapIcons.default
    if (professional.id === selectedProfessionalId.value) {
      icon = mapIcons.selected
    }
    
    return {
      id: professional.id,
      position: {
        lat: professional.location.latitude,
        lng: professional.location.longitude
      },
      title: professional.name,
      icon,
      professional
    }
  })
})

// Manejadores de eventos
function handleMarkerClick(marker: MapMarker) {
  // Seleccionar el profesional al hacer clic en el marcador
  selectedProfessionalId.value = marker.id
  
  // Hacer scroll al profesional seleccionado
  const professionalElement = document.getElementById(`professional-${marker.id}`)
  if (professionalElement) {
    professionalElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }
}

function handleMapLoaded() {
  isMapLoaded.value = true
  console.log('Mapa cargado correctamente')
}

function handleMapError(error: Error) {
  mapError.value = `Error al cargar el mapa: ${error.message}`
  console.error('Error con el mapa:', error)
}
</script> 