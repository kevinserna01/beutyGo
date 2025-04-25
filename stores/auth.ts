import { defineStore } from 'pinia'
import type { User, LoginCredentials, RegisterData, AuthState, AuthResponse } from '~/types'

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    loading: false,
    error: null
  }),

  getters: {
    isAuthenticated: (state): boolean => !!state.user,
    isAdmin: (state): boolean => state.user?.role === 'admin',
    isProfessional: (state): boolean => state.user?.role === 'professional',
    isClient: (state): boolean => state.user?.role === 'client'
  },

  actions: {
    /**
     * Iniciar sesión
     */
    async login(credentials: LoginCredentials) {
      this.loading = true
      this.error = null
      
      try {
        const api = useApi()
        
        // Realizar petición de login
        const response: AuthResponse = await api.login(credentials.email, credentials.password)
        
        // Guardar datos del usuario
        this.user = response.user
        
        // Guardar en localStorage
        if (import.meta.client) {
          try {
            localStorage.setItem('user', JSON.stringify(this.user))
            if (response.token) {
              localStorage.setItem('token', response.token)
            }
          } catch (e) {
            console.error('Error al guardar el usuario en localStorage:', e)
          }
        }
        
        return this.user
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Credenciales inválidas'
        throw error
      } finally {
        this.loading = false
      }
    },
    
    /**
     * Registro de usuario
     */
    async register(data: RegisterData) {
      this.loading = true
      this.error = null
      
      try {
        const api = useApi()
        
        // Realizar petición de registro
        const response: AuthResponse = await api.register(data)
        
        // Guardar datos del usuario
        this.user = response.user
        
        // Guardar en localStorage
        if (import.meta.client) {
          try {
            localStorage.setItem('user', JSON.stringify(this.user))
            if (response.token) {
              localStorage.setItem('token', response.token)
            }
          } catch (e) {
            console.error('Error al guardar el usuario en localStorage:', e)
          }
        }
        
        return this.user
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Error al registrar usuario'
        throw error
      } finally {
        this.loading = false
      }
    },
    
    /**
     * Cerrar sesión
     */
    logout() {
      this.user = null
      if (import.meta.client) {
        try {
          localStorage.removeItem('user')
          localStorage.removeItem('token')
        } catch (e) {
          console.error('Error al eliminar el usuario de localStorage:', e)
        }
      }
    },
    
    /**
     * Verificar sesión al cargar la app
     */
    checkAuth() {
      if (import.meta.client) {
        try {
          const storedUser = localStorage.getItem('user')
          if (storedUser) {
            try {
              this.user = JSON.parse(storedUser) as User
            } catch (error) {
              localStorage.removeItem('user')
            }
          }
        } catch (e) {
          console.error('Error al verificar la autenticación:', e)
        }
      }
    },
    
    /**
     * Plugin para inicializar el store
     * Este método será llamado por el plugin de Pinia
     */
    init() {
      if (import.meta.client) {
        nextTick(() => {
          this.checkAuth()
        })
      }
    }
  }
}) 