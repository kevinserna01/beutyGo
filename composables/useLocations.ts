/**
 * Composable para manejar departamentos y ciudades de Colombia
 */
import type { Estado, Ciudad } from '~/types'

export const useLocations = () => {
  // Departamentos de Colombia
  const estados = ref<Estado[]>([
    { id: 'ANT', nombre: 'Antioquia' },
    { id: 'ATL', nombre: 'Atlántico' },
    { id: 'BOG', nombre: 'Bogotá D.C.' },
    { id: 'BOL', nombre: 'Bolívar' },
    { id: 'BOY', nombre: 'Boyacá' },
    { id: 'CAL', nombre: 'Caldas' },
    { id: 'CAQ', nombre: 'Caquetá' },
    { id: 'CAS', nombre: 'Casanare' },
    { id: 'CAU', nombre: 'Cauca' },
    { id: 'CES', nombre: 'Cesar' },
    { id: 'CHO', nombre: 'Chocó' },
    { id: 'COR', nombre: 'Córdoba' },
    { id: 'CUN', nombre: 'Cundinamarca' },
    { id: 'GUA', nombre: 'Guainía' },
    { id: 'GUV', nombre: 'Guaviare' },
    { id: 'HUI', nombre: 'Huila' },
    { id: 'LAG', nombre: 'La Guajira' },
    { id: 'MAG', nombre: 'Magdalena' },
    { id: 'MET', nombre: 'Meta' },
    { id: 'NAR', nombre: 'Nariño' },
    { id: 'NSA', nombre: 'Norte de Santander' },
    { id: 'PUT', nombre: 'Putumayo' },
    { id: 'QUI', nombre: 'Quindío' },
    { id: 'RIS', nombre: 'Risaralda' },
    { id: 'SAP', nombre: 'San Andrés y Providencia' },
    { id: 'SAN', nombre: 'Santander' },
    { id: 'SUC', nombre: 'Sucre' },
    { id: 'TOL', nombre: 'Tolima' },
    { id: 'VAC', nombre: 'Valle del Cauca' },
    { id: 'VAU', nombre: 'Vaupés' },
    { id: 'VIC', nombre: 'Vichada' }
  ])

  // Ciudades por departamento (principales ciudades de Colombia)
  const ciudadesPorEstado = ref<Record<string, Ciudad[]>>({
    'BOG': [
      { id: 'bog-001', nombre: 'Usaquén', estadoId: 'BOG' },
      { id: 'bog-002', nombre: 'Chapinero', estadoId: 'BOG' },
      { id: 'bog-003', nombre: 'Santa Fe', estadoId: 'BOG' },
      { id: 'bog-004', nombre: 'San Cristóbal', estadoId: 'BOG' },
      { id: 'bog-005', nombre: 'Usme', estadoId: 'BOG' },
      { id: 'bog-006', nombre: 'Tunjuelito', estadoId: 'BOG' },
      { id: 'bog-007', nombre: 'Bosa', estadoId: 'BOG' },
      { id: 'bog-008', nombre: 'Kennedy', estadoId: 'BOG' },
      { id: 'bog-009', nombre: 'Fontibón', estadoId: 'BOG' },
      { id: 'bog-010', nombre: 'Engativá', estadoId: 'BOG' },
      { id: 'bog-011', nombre: 'Suba', estadoId: 'BOG' },
      { id: 'bog-012', nombre: 'Barrios Unidos', estadoId: 'BOG' }
    ],
    'ANT': [
      { id: 'ant-001', nombre: 'Medellín', estadoId: 'ANT' },
      { id: 'ant-002', nombre: 'Bello', estadoId: 'ANT' },
      { id: 'ant-003', nombre: 'Itagüí', estadoId: 'ANT' },
      { id: 'ant-004', nombre: 'Envigado', estadoId: 'ANT' },
      { id: 'ant-005', nombre: 'Sabaneta', estadoId: 'ANT' },
      { id: 'ant-006', nombre: 'La Estrella', estadoId: 'ANT' },
      { id: 'ant-007', nombre: 'Caldas', estadoId: 'ANT' },
      { id: 'ant-008', nombre: 'Copacabana', estadoId: 'ANT' }
    ],
    'VAC': [
      { id: 'vac-001', nombre: 'Cali', estadoId: 'VAC' },
      { id: 'vac-002', nombre: 'Palmira', estadoId: 'VAC' },
      { id: 'vac-003', nombre: 'Buenaventura', estadoId: 'VAC' },
      { id: 'vac-004', nombre: 'Tuluá', estadoId: 'VAC' },
      { id: 'vac-005', nombre: 'Cartago', estadoId: 'VAC' },
      { id: 'vac-006', nombre: 'Buga', estadoId: 'VAC' }
    ],
    'ATL': [
      { id: 'atl-001', nombre: 'Barranquilla', estadoId: 'ATL' },
      { id: 'atl-002', nombre: 'Soledad', estadoId: 'ATL' },
      { id: 'atl-003', nombre: 'Malambo', estadoId: 'ATL' },
      { id: 'atl-004', nombre: 'Puerto Colombia', estadoId: 'ATL' },
      { id: 'atl-005', nombre: 'Galapa', estadoId: 'ATL' }
    ],
    'SAN': [
      { id: 'san-001', nombre: 'Bucaramanga', estadoId: 'SAN' },
      { id: 'san-002', nombre: 'Floridablanca', estadoId: 'SAN' },
      { id: 'san-003', nombre: 'Girón', estadoId: 'SAN' },
      { id: 'san-004', nombre: 'Piedecuesta', estadoId: 'SAN' },
      { id: 'san-005', nombre: 'Barrancabermeja', estadoId: 'SAN' }
    ],
    'BOL': [
      { id: 'bol-001', nombre: 'Cartagena', estadoId: 'BOL' },
      { id: 'bol-002', nombre: 'Magangué', estadoId: 'BOL' },
      { id: 'bol-003', nombre: 'Turbaco', estadoId: 'BOL' },
      { id: 'bol-004', nombre: 'El Carmen de Bolívar', estadoId: 'BOL' }
    ],
    'CUN': [
      { id: 'cun-001', nombre: 'Soacha', estadoId: 'CUN' },
      { id: 'cun-002', nombre: 'Chía', estadoId: 'CUN' },
      { id: 'cun-003', nombre: 'Zipaquirá', estadoId: 'CUN' },
      { id: 'cun-004', nombre: 'Facatativá', estadoId: 'CUN' },
      { id: 'cun-005', nombre: 'Mosquera', estadoId: 'CUN' },
      { id: 'cun-006', nombre: 'Madrid', estadoId: 'CUN' }
    ],
    'NSA': [
      { id: 'nsa-001', nombre: 'Cúcuta', estadoId: 'NSA' },
      { id: 'nsa-002', nombre: 'Los Patios', estadoId: 'NSA' },
      { id: 'nsa-003', nombre: 'Villa del Rosario', estadoId: 'NSA' },
      { id: 'nsa-004', nombre: 'Ocaña', estadoId: 'NSA' }
    ],
    'HUI': [
      { id: 'hui-001', nombre: 'Neiva', estadoId: 'HUI' },
      { id: 'hui-002', nombre: 'Pitalito', estadoId: 'HUI' },
      { id: 'hui-003', nombre: 'Garzón', estadoId: 'HUI' },
      { id: 'hui-004', nombre: 'La Plata', estadoId: 'HUI' }
    ],
    'RIS': [
      { id: 'ris-001', nombre: 'Pereira', estadoId: 'RIS' },
      { id: 'ris-002', nombre: 'Dosquebradas', estadoId: 'RIS' },
      { id: 'ris-003', nombre: 'Santa Rosa de Cabal', estadoId: 'RIS' },
      { id: 'ris-004', nombre: 'La Virginia', estadoId: 'RIS' }
    ]
  })

  // Estado reactivo para ciudades disponibles
  const ciudadesDisponibles = ref<Ciudad[]>([])

  /**
   * Obtiene las ciudades para un departamento específico
   */
  const getCiudadesPorEstado = (estadoId: string): Ciudad[] => {
    return ciudadesPorEstado.value[estadoId] || []
  }

  /**
   * Actualiza las ciudades disponibles basado en el departamento seleccionado
   */
  const actualizarCiudades = (estadoId: string) => {
    ciudadesDisponibles.value = getCiudadesPorEstado(estadoId)
  }

  /**
   * Obtiene el nombre del departamento por su ID
   */
  const getNombreEstado = (estadoId: string): string => {
    const estado = estados.value.find(e => e.id === estadoId)
    return estado?.nombre || ''
  }

  /**
   * Obtiene el nombre de la ciudad por su ID
   */
  const getNombreCiudad = (ciudadId: string): string => {
    for (const ciudades of Object.values(ciudadesPorEstado.value)) {
      const ciudad = ciudades.find(c => c.id === ciudadId)
      if (ciudad) return ciudad.nombre
    }
    return ''
  }

  /**
   * Simula carga de ciudades desde API (para casos futuros)
   */
  const cargarCiudadesAsync = async (estadoId: string): Promise<Ciudad[]> => {
    // Simular delay de API
    await new Promise(resolve => setTimeout(resolve, 300))
    return getCiudadesPorEstado(estadoId)
  }

  return {
    estados: readonly(estados),
    ciudadesDisponibles: readonly(ciudadesDisponibles),
    getCiudadesPorEstado,
    actualizarCiudades,
    getNombreEstado,
    getNombreCiudad,
    cargarCiudadesAsync
  }
} 