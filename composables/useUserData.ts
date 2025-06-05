/**
 * Composable para manejar transformaciones de datos de usuario
 * Evita conflictos entre nombres de campos del registro y perfil
 */
import type { RegisterData, UserProfileResponse, ProfileFormData } from '~/types'

export const useUserData = () => {
  
  /**
   * Transforma datos de registro a formato de perfil
   */
  const transformRegisterToProfile = (registerData: RegisterData): Partial<UserProfileResponse> => {
    return {
      nombre: `${registerData.firstName} ${registerData.lastName}`,
      correo: registerData.email,
      telefono: registerData.phone,
      rol: registerData.role === 'client' ? 'client' : 'professional'
    }
  }

  /**
   * Transforma datos de perfil a formato para API
   */
  const transformProfileToApi = (profileData: ProfileFormData): Record<string, any> => {
    const apiData: Record<string, any> = {
      nombre: profileData.nombre,
      correo: profileData.correo,
      telefono: profileData.telefono,
      fotoUrl: profileData.fotoUrl || null
    }

    // Añadir datos específicos de profesionales si existen
    if (profileData.direccion) {
      apiData.direccion = profileData.direccion
    }
    
    if (profileData.descripcion) {
      apiData.descripcion = profileData.descripcion
    }

    return apiData
  }

  /**
   * Valida formato de teléfono colombiano
   */
  const validarTelefonoColombiano = (telefono: string): { valid: boolean; message: string } => {
    // Limpiar espacios y caracteres especiales
    const cleanPhone = telefono.replace(/[\s\-\(\)]/g, '')
    
    // Patrón para números colombianos: +57 3XX XXX XXXX o 3XX XXX XXXX
    const regexConCodigo = /^\+57[3][0-9]{9}$/
    const regexSinCodigo = /^[3][0-9]{9}$/
    
    if (!telefono.trim()) {
      return { valid: false, message: 'El teléfono es obligatorio' }
    }
    
    if (regexConCodigo.test(cleanPhone) || regexSinCodigo.test(cleanPhone)) {
      return { valid: true, message: '' }
    }
    
    return { 
      valid: false, 
      message: 'Formato inválido. Use: +57 301 234 5678 o 301 234 5678' 
    }
  }

  /**
   * Valida código postal colombiano
   */
  const validarCodigoPostalColombiano = (codigo: string): { valid: boolean; message: string } => {
    const cleanCode = codigo.replace(/\s/g, '')
    
    if (!codigo.trim()) {
      return { valid: false, message: 'El código postal es obligatorio' }
    }
    
    // Colombia usa códigos de 6 dígitos
    if (!/^\d{6}$/.test(cleanCode)) {
      return { 
        valid: false, 
        message: 'Código postal debe tener 6 dígitos (ej: 110221)' 
      }
    }
    
    return { valid: true, message: '' }
  }

  /**
   * Formatea número de teléfono para mostrar
   */
  const formatearTelefonoColombiano = (telefono: string): string => {
    const cleanPhone = telefono.replace(/[\s\-\(\)]/g, '')
    
    // Si ya tiene código de país, formatear
    if (cleanPhone.startsWith('+57')) {
      const number = cleanPhone.substring(3)
      return `+57 ${number.substring(0, 3)} ${number.substring(3, 6)} ${number.substring(6)}`
    }
    
    // Si es solo el número, añadir código de país
    if (cleanPhone.length === 10 && cleanPhone.startsWith('3')) {
      return `+57 ${cleanPhone.substring(0, 3)} ${cleanPhone.substring(3, 6)} ${cleanPhone.substring(6)}`
    }
    
    return telefono
  }

  /**
   * Obtiene información de departamentos y ciudades colombianas
   */
  const getDepartamentoInfo = (departamentoId: string): { nombre: string; codigo: string } => {
    const departamentos: Record<string, { nombre: string; codigo: string }> = {
      'BOG': { nombre: 'Bogotá D.C.', codigo: 'BOG' },
      'ANT': { nombre: 'Antioquia', codigo: 'ANT' },
      'VAC': { nombre: 'Valle del Cauca', codigo: 'VAC' },
      'ATL': { nombre: 'Atlántico', codigo: 'ATL' },
      'SAN': { nombre: 'Santander', codigo: 'SAN' },
      'BOL': { nombre: 'Bolívar', codigo: 'BOL' },
      'CUN': { nombre: 'Cundinamarca', codigo: 'CUN' },
      'NSA': { nombre: 'Norte de Santander', codigo: 'NSA' },
      'HUI': { nombre: 'Huila', codigo: 'HUI' },
      'RIS': { nombre: 'Risaralda', codigo: 'RIS' }
    }
    
    return departamentos[departamentoId] || { nombre: '', codigo: '' }
  }

  /**
   * Valida dirección completa colombiana
   */
  const validarDireccionColombiana = (direccion: {
    calle: string;
    estado: string;
    ciudad: string;
    codigoPostal: string;
  }): { valid: boolean; errors: Record<string, string> } => {
    const errors: Record<string, string> = {}
    
    if (!direccion.calle.trim()) {
      errors.calle = 'La dirección es obligatoria'
    }
    
    if (!direccion.estado.trim()) {
      errors.estado = 'El departamento es obligatorio'
    }
    
    if (!direccion.ciudad.trim()) {
      errors.ciudad = 'La ciudad es obligatoria'
    }
    
    const codigoValidation = validarCodigoPostalColombiano(direccion.codigoPostal)
    if (!codigoValidation.valid) {
      errors.codigoPostal = codigoValidation.message
    }
    
    return {
      valid: Object.keys(errors).length === 0,
      errors
    }
  }

  return {
    transformRegisterToProfile,
    transformProfileToApi,
    validarTelefonoColombiano,
    validarCodigoPostalColombiano,
    formatearTelefonoColombiano,
    getDepartamentoInfo,
    validarDireccionColombiana
  }
} 