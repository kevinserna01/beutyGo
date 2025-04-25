import type { GoogleMapsConfig } from '~/types'

/**
 * Estilos personalizados para el mapa
 * Estos estilos dan un aspecto más suave y estético al mapa
 * Adaptados a la paleta de colores de BeautyGo
 */
const mapStyles = [
  {
    "featureType": "administrative",
    "elementType": "labels.text.fill",
    "stylers": [{"color": "#444444"}]
  },
  {
    "featureType": "landscape",
    "elementType": "all",
    "stylers": [{"color": "#f2f2f2"}]
  },
  {
    "featureType": "poi",
    "elementType": "all",
    "stylers": [{"visibility": "off"}]
  },
  {
    "featureType": "poi.business",
    "elementType": "geometry.fill",
    "stylers": [{"visibility": "on"}]
  },
  {
    "featureType": "poi.park",
    "elementType": "all",
    "stylers": [
      {"visibility": "on"},
      {"color": "#e4f3d7"}
    ]
  },
  {
    "featureType": "road",
    "elementType": "all",
    "stylers": [
      {"saturation": -100},
      {"lightness": 45}
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "all",
    "stylers": [{"visibility": "simplified"}]
  },
  {
    "featureType": "road.arterial",
    "elementType": "labels.icon",
    "stylers": [{"visibility": "off"}]
  },
  {
    "featureType": "transit",
    "elementType": "all",
    "stylers": [{"visibility": "off"}]
  },
  {
    "featureType": "water",
    "elementType": "all",
    "stylers": [
      {"color": "#dfe6eb"},
      {"visibility": "on"}
    ]
  }
]

/**
 * Configuración de Google Maps para la aplicación
 */
export const googleMapsConfig: GoogleMapsConfig = {
  apiKey: '', // IMPORTANTE: Reemplazar con tu API key de Google Maps
  defaultCenter: {
    lat: 40.4167, // Madrid como centro por defecto
    lng: -3.7033
  },
  defaultZoom: 12,
  styles: mapStyles
}

/**
 * URL de los iconos personalizados para el mapa
 */
export const mapIcons = {
  default: '/images/map/marker.svg',
  selected: '/images/map/marker-selected.svg',
  salon: '/images/map/salon.svg',
  home: '/images/map/home.svg'
}

/**
 * Opciones para el componente de autocompletado de direcciones
 */
export const autocompleteOptions = {
  componentRestrictions: { country: 'es' }, // Limitar a España
  types: ['address'],
  fields: ['address_components', 'formatted_address', 'geometry', 'name']
} 