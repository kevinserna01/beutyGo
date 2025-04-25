import { ref, onMounted, onUnmounted } from 'vue'

export interface MapOptions {
  zoom?: number
  center?: google.maps.LatLngLiteral
  styles?: google.maps.MapTypeStyle[]
  disableDefaultUI?: boolean
}

export interface Marker {
  id: string
  position: google.maps.LatLngLiteral
  title?: string
  icon?: string
  infoContent?: string
}

export function useGoogleMaps() {
  const isLoaded = ref(false)
  const isLoading = ref(false)
  const error = ref<Error | null>(null)
  const mapInstance = ref<google.maps.Map | null>(null)
  const markers = ref<Map<string, google.maps.Marker>>(new Map())
  
  // Cargar el script de Google Maps
  const loadGoogleMapsScript = (apiKey: string): Promise<void> => {
    // Si no estamos en el cliente, no intentar cargar el script
    if (!import.meta.client) {
      return Promise.reject(new Error('Solo se puede cargar Google Maps en el cliente'))
    }
    
    if (isLoaded.value) return Promise.resolve()
    if (isLoading.value) {
      // Si ya se está cargando, devolvemos una promesa que se resolverá cuando cargue
      return new Promise((resolve, reject) => {
        const checkIfLoaded = setInterval(() => {
          if (isLoaded.value) {
            clearInterval(checkIfLoaded)
            resolve()
          }
          if (error.value) {
            clearInterval(checkIfLoaded)
            reject(error.value)
          }
        }, 100)
      })
    }
    
    isLoading.value = true
    
    return new Promise((resolve, reject) => {
      try {
        // Crear el script element
        const script = document.createElement('script')
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`
        script.async = true
        script.defer = true
        
        // Configurar callbacks
        script.onload = () => {
          isLoaded.value = true
          isLoading.value = false
          resolve()
        }
        
        script.onerror = (e) => {
          const errorMsg = new Error('Error al cargar el script de Google Maps')
          error.value = errorMsg
          isLoading.value = false
          reject(errorMsg)
        }
        
        // Añadir el script al DOM
        document.head.appendChild(script)
      } catch (e) {
        isLoading.value = false
        error.value = e instanceof Error ? e : new Error('Error desconocido al cargar Google Maps')
        reject(error.value)
      }
    })
  }
  
  // Inicializar el mapa
  const initMap = (
    element: HTMLElement, 
    options: MapOptions = {}
  ): google.maps.Map | null => {
    if (!import.meta.client) {
      console.error('No se puede inicializar el mapa en el servidor')
      return null
    }
    
    if (!isLoaded.value) {
      console.error('Google Maps no ha sido cargado. Primero debes llamar a loadGoogleMapsScript')
      return null
    }
    
    try {
      const defaultOptions: google.maps.MapOptions = {
        zoom: 12,
        center: { lat: 40.4165, lng: -3.7026 }, // Madrid por defecto
        styles: [],
        disableDefaultUI: false,
        ...options,
      }
      
      const map = new google.maps.Map(element, defaultOptions)
      mapInstance.value = map
      return map
    } catch (e) {
      error.value = e instanceof Error ? e : new Error('Error al inicializar el mapa')
      return null
    }
  }
  
  // Añadir marcadores al mapa
  const addMarkers = (
    markersData: Marker[], 
    map: google.maps.Map = mapInstance.value!
  ): void => {
    if (!import.meta.client) return
    
    if (!map) {
      console.error('El mapa no ha sido inicializado')
      return
    }
    
    markersData.forEach(markerData => {
      const marker = new google.maps.Marker({
        position: markerData.position,
        map,
        title: markerData.title,
        icon: markerData.icon,
      })
      
      markers.value.set(markerData.id, marker)
      
      // Si hay contenido para InfoWindow, lo configuramos
      if (markerData.infoContent) {
        const infoWindow = new google.maps.InfoWindow({
          content: markerData.infoContent
        })
        
        marker.addListener('click', () => {
          infoWindow.open(map, marker)
        })
      }
    })
  }
  
  // Eliminar marcadores
  const removeMarkers = (markerIds?: string[]): void => {
    if (!import.meta.client) return
    
    if (markerIds) {
      markerIds.forEach(id => {
        const marker = markers.value.get(id)
        if (marker) {
          marker.setMap(null)
          markers.value.delete(id)
        }
      })
    } else {
      // Eliminar todos los marcadores
      markers.value.forEach(marker => {
        marker.setMap(null)
      })
      markers.value.clear()
    }
  }
  
  // Centrar el mapa en una posición
  const panTo = (
    position: google.maps.LatLngLiteral, 
    zoom?: number
  ): void => {
    if (!import.meta.client || !mapInstance.value) return
    
    mapInstance.value.panTo(position)
    if (zoom !== undefined) {
      mapInstance.value.setZoom(zoom)
    }
  }
  
  // Geolocalizar al usuario
  const getUserLocation = (): Promise<google.maps.LatLngLiteral> => {
    if (!import.meta.client) {
      return Promise.reject(new Error('La geolocalización solo está disponible en el cliente'))
    }
    
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocalización no soportada por tu navegador'))
        return
      }
      
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          })
        },
        (err) => {
          reject(new Error(`Error obteniendo la ubicación: ${err.message}`))
        }
      )
    })
  }
  
  // Limpiar recursos al desmontar el componente
  onUnmounted(() => {
    if (import.meta.client) {
      removeMarkers()
      mapInstance.value = null
    }
  })
  
  return {
    isLoaded,
    isLoading,
    error,
    mapInstance,
    markers,
    loadGoogleMapsScript,
    initMap,
    addMarkers,
    removeMarkers,
    panTo,
    getUserLocation
  }
} 