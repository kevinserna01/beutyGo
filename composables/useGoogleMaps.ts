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
        reject(new Error('Tu navegador no soporta geolocalización'))
        return
      }

      // Verificar si estamos en un origen seguro (HTTPS o localhost)
      const isSecureOrigin = window.location.protocol === 'https:' || 
                            window.location.hostname === 'localhost' || 
                            window.location.hostname === '127.0.0.1'

      if (!isSecureOrigin) {
        reject(new Error('La geolocalización solo está disponible en conexiones seguras (HTTPS) o en localhost. Por favor, accede a la aplicación a través de HTTPS o localhost.'))
        return
      }

      const options = {
        enableHighAccuracy: true, // Usar GPS si está disponible
        timeout: 15000, // Aumentar el timeout a 15 segundos
        maximumAge: 0, // No usar caché de ubicación
      }

      let attempts = 0
      const maxAttempts = 3
      let bestAccuracy = Infinity
      let bestPosition: GeolocationPosition | null = null

      const getPosition = () => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            console.log(`Intento ${attempts + 1}: Precisión ${position.coords.accuracy} metros`)
            
            // Si la precisión es mejor que la anterior, guardar la posición
            if (position.coords.accuracy < bestAccuracy) {
              bestAccuracy = position.coords.accuracy
              bestPosition = position
            }

            // Si la precisión es menor a 20 metros o hemos alcanzado el máximo de intentos
            if (position.coords.accuracy <= 20 || attempts >= maxAttempts - 1) {
              if (bestPosition) {
                const location = {
                  lat: bestPosition.coords.latitude,
                  lng: bestPosition.coords.longitude
                }
                console.log(`Ubicación final obtenida con precisión de ${bestAccuracy} metros:`, location)
                resolve(location)
              } else {
                reject(new Error('No se pudo obtener una ubicación precisa'))
              }
            } else {
              // Intentar de nuevo con un pequeño retraso
              attempts++
              setTimeout(getPosition, 1000)
            }
          },
          (error) => {
            let errorMessage = 'Error al obtener la ubicación'
            
            switch (error.code) {
              case error.PERMISSION_DENIED:
                errorMessage = 'Permiso de ubicación denegado. Por favor, habilita los permisos de ubicación en tu navegador.'
                break
              case error.POSITION_UNAVAILABLE:
                errorMessage = 'No se pudo obtener la ubicación. Por favor, verifica que la ubicación esté habilitada en tu dispositivo.'
                break
              case error.TIMEOUT:
                if (attempts < maxAttempts - 1) {
                  attempts++
                  setTimeout(getPosition, 1000)
                  return
                }
                errorMessage = 'La solicitud de ubicación ha expirado. Por favor, intenta nuevamente.'
                break
            }
            
            console.error('Error de geolocalización:', error)
            reject(new Error(errorMessage))
          },
          options
        )
      }

      // Iniciar el primer intento
      getPosition()
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