/**
 * Composable para manejar las peticiones a la API
 */
import type { AuthResponse, RegisterData } from '~/types'

export const useApi = () => {
  // URL base de la API
  const baseUrl = 'http://localhost:3000/api/v1'

  // Obtener el token de autenticación
  const getAuthToken = (): string | null => {
    if (process.client) {
      return localStorage.getItem('token')
    }
    return null
  }

  // Función para realizar peticiones HTTP
  const request = async <T>(
    endpoint: string, 
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
    data?: any,
    useAuth: boolean = true
  ): Promise<T> => {
    // Construir URL completa
    const url = `${baseUrl}${endpoint}`
    
    // Configurar headers
    const headers: HeadersInit = {
      'Content-Type': 'application/json'
    }
    
    // Añadir token de autenticación si es necesario
    if (useAuth) {
      const token = getAuthToken()
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }
    }
    
    // Configurar opciones de la petición
    const options: RequestInit = {
      method,
      headers,
      body: data ? JSON.stringify(data) : undefined
    }
    
    try {
      // Realizar la petición
      const response = await fetch(url, options)
      
      // Manejar respuesta
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `Error en la petición: ${response.status}`)
      }
      
      // Devolver datos
      return await response.json() as T
    } catch (error) {
      console.error('Error en la petición API:', error)
      throw error
    }
  }
  
  // Métodos específicos para operaciones comunes
  return {
    // Login
    login: (email: string, password: string): Promise<AuthResponse> => 
      request<AuthResponse>('/login', 'POST', { email, password }, false),
    
    // Registro
    register: (data: RegisterData): Promise<AuthResponse> => 
      request<AuthResponse>('/register', 'POST', data, false),
    
    // Método genérico para otras peticiones
    request
  }
} 