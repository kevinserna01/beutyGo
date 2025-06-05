/**
 * Composable para gestión de perfil de usuario
 */
import type { 
  UserProfileResponse, 
  ProfileFormData, 
  ValidationState, 
  ProfileMode 
} from '~/types'

export const useProfile = () => {
  const { request } = useApi()

  // Estados reactivos para el perfil
  const profile = ref<UserProfileResponse | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const saving = ref(false)
  const deleting = ref(false)

  // Estado del formulario
  const mode = ref<ProfileMode>('readonly')
  const formData = ref<ProfileFormData>({
    nombre: '',
    correo: '',
    telefono: '',
    fotoUrl: '',
    direccion: {
      calle: '',
      estado: '',
      ciudad: '',
      codigoPostal: ''
    },
    descripcion: ''
  })

  // Datos originales para poder cancelar edición
  const originalData = ref<ProfileFormData | null>(null)

  // Estado de validación
  const validation = ref<ValidationState>({
    nombre: { valid: true, message: '' },
    correo: { valid: true, message: '' },
    telefono: { valid: true, message: '' },
    calle: { valid: true, message: '' },
    estado: { valid: true, message: '' },
    ciudad: { valid: true, message: '' },
    codigoPostal: { valid: true, message: '' },
    descripcion: { valid: true, message: '' }
  })

  // Vista previa de imagen
  const imagePreview = ref<string | null>(null)

  /**
   * Carga los datos del perfil del usuario
   */
  const cargarPerfil = async (userId: string): Promise<void> => {
    try {
      loading.value = true
      error.value = null

      // Realizar petición GET a la API
      const data = await request<UserProfileResponse>(`/usuarios/${userId}`, 'GET')
      
      profile.value = data
      
      // Rellenar formulario con datos cargados
      rellenarFormulario(data)

    } catch (err) {
      console.error('Error al cargar perfil:', err)
      error.value = err instanceof Error ? err.message : 'Error desconocido al cargar perfil'
    } finally {
      loading.value = false
    }
  }

  /**
   * Rellena el formulario con los datos del perfil
   */
  const rellenarFormulario = (data: UserProfileResponse): void => {
    formData.value = {
      nombre: data.nombre || '',
      correo: data.correo || '',
      telefono: data.telefono || '',
      fotoUrl: data.fotoUrl || '',
      direccion: data.direccion ? {
        calle: data.direccion.calle || '',
        estado: data.direccion.estado || '',
        ciudad: data.direccion.ciudad || '',
        codigoPostal: data.direccion.codigoPostal || ''
      } : {
        calle: '',
        estado: '',
        ciudad: '',
        codigoPostal: ''
      },
      descripcion: data.descripcion || ''
    }

    // Guardar copia de datos originales
    originalData.value = JSON.parse(JSON.stringify(formData.value))

    // Establecer vista previa de imagen si existe
    if (data.fotoUrl) {
      imagePreview.value = data.fotoUrl
    }
  }

  /**
   * Valida un campo específico del formulario
   */
  const validarCampo = (campo: keyof ValidationState, valor: string): void => {
    const validations = validation.value as any

    switch (campo) {
      case 'nombre':
        if (!valor.trim()) {
          validations.nombre = { valid: false, message: 'El nombre es obligatorio' }
        } else if (valor.trim().length < 2) {
          validations.nombre = { valid: false, message: 'El nombre debe tener al menos 2 caracteres' }
        } else {
          validations.nombre = { valid: true, message: '' }
        }
        break

      case 'correo':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!valor.trim()) {
          validations.correo = { valid: false, message: 'El correo es obligatorio' }
        } else if (!emailRegex.test(valor)) {
          validations.correo = { valid: false, message: 'Formato de correo inválido' }
        } else {
          validations.correo = { valid: true, message: '' }
        }
        break

      case 'telefono':
        // Armonizar con validación del registro: colombiano +57
        const phoneRegex = /^(\+57\s?)?[3][0-9]{9}$/
        const cleanPhone = valor.replace(/\s/g, '')
        if (!valor.trim()) {
          validations.telefono = { valid: false, message: 'El teléfono es obligatorio' }
        } else if (!phoneRegex.test(cleanPhone)) {
          validations.telefono = { valid: false, message: 'Formato inválido. Ej: +57 301 234 5678' }
        } else {
          validations.telefono = { valid: true, message: '' }
        }
        break

      case 'calle':
        if (profile.value?.rol === 'professional') {
          if (!valor.trim()) {
            validations.calle = { valid: false, message: 'La calle es obligatoria para profesionales' }
          } else {
            validations.calle = { valid: true, message: '' }
          }
        }
        break

      case 'estado':
        if (profile.value?.rol === 'professional') {
          if (!valor.trim()) {
            validations.estado = { valid: false, message: 'El estado es obligatorio para profesionales' }
          } else {
            validations.estado = { valid: true, message: '' }
          }
        }
        break

      case 'ciudad':
        if (profile.value?.rol === 'professional') {
          if (!valor.trim()) {
            validations.ciudad = { valid: false, message: 'La ciudad es obligatoria para profesionales' }
          } else {
            validations.ciudad = { valid: true, message: '' }
          }
        }
        break

      case 'codigoPostal':
        if (profile.value?.rol === 'professional') {
          const zipRegex = /^\d{6}$/
          if (!valor.trim()) {
            validations.codigoPostal = { valid: false, message: 'El código postal es obligatorio para profesionales' }
          } else if (!zipRegex.test(valor)) {
            validations.codigoPostal = { valid: false, message: 'Código postal debe tener 6 dígitos' }
          } else {
            validations.codigoPostal = { valid: true, message: '' }
          }
        }
        break

      case 'descripcion':
        if (profile.value?.rol === 'professional') {
          if (!valor.trim()) {
            validations.descripcion = { valid: false, message: 'La descripción es obligatoria para profesionales' }
          } else if (valor.trim().length < 20) {
            validations.descripcion = { valid: false, message: 'La descripción debe tener al menos 20 caracteres' }
          } else {
            validations.descripcion = { valid: true, message: '' }
          }
        }
        break
    }
  }

  /**
   * Valida todo el formulario
   */
  const validarFormulario = (): boolean => {
    // Validar campos básicos
    validarCampo('nombre', formData.value.nombre)
    validarCampo('correo', formData.value.correo)
    validarCampo('telefono', formData.value.telefono)

    // Validar campos específicos de profesionales
    if (profile.value?.rol === 'professional' && formData.value.direccion) {
      validarCampo('calle', formData.value.direccion.calle)
      validarCampo('estado', formData.value.direccion.estado)
      validarCampo('ciudad', formData.value.direccion.ciudad)
      validarCampo('codigoPostal', formData.value.direccion.codigoPostal)
      validarCampo('descripcion', formData.value.descripcion || '')
    }

    // Verificar si todos los campos son válidos
    const allValid = Object.values(validation.value).every(field => field && field.valid)
    return allValid
  }

  /**
   * Maneja la vista previa de imagen cuando se selecciona un archivo
   */
  const manejarCambioImagen = (file: File): void => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (e) => {
        imagePreview.value = e.target?.result as string
      }
      reader.readAsDataURL(file)
      formData.value.foto = file
    }
  }

  /**
   * Habilita el modo de edición
   */
  const habilitarEdicion = (): void => {
    mode.value = 'editing'
    // Guardar copia de datos originales
    originalData.value = JSON.parse(JSON.stringify(formData.value))
  }

  /**
   * Cancela la edición y restaura datos originales
   */
  const cancelarEdicion = (): void => {
    if (originalData.value) {
      formData.value = JSON.parse(JSON.stringify(originalData.value))
      // Restaurar vista previa de imagen
      imagePreview.value = originalData.value.fotoUrl || null
    }
    mode.value = 'readonly'
    
    // Limpiar errores de validación
    Object.keys(validation.value).forEach(key => {
      const field = validation.value[key as keyof ValidationState] as any
      if (field) {
        field.valid = true
        field.message = ''
      }
    })
  }

  /**
   * Guarda los cambios del perfil
   */
  const guardarCambios = async (userId: string): Promise<void> => {
    if (!validarFormulario()) {
      throw new Error('Por favor, corrige los errores en el formulario')
    }

    try {
      saving.value = true
      error.value = null

      // Preparar datos para envío
      const dataToSend = {
        nombre: formData.value.nombre,
        correo: formData.value.correo,
        telefono: formData.value.telefono,
        fotoUrl: formData.value.fotoUrl,
        ...(profile.value?.rol === 'professional' && {
          direccion: formData.value.direccion,
          descripcion: formData.value.descripcion
        })
      }

      // Enviar petición PUT a la API
      const updatedProfile = await request<UserProfileResponse>(
        `/usuarios/${userId}`, 
        'PUT', 
        dataToSend
      )

      // Actualizar datos locales
      profile.value = updatedProfile
      rellenarFormulario(updatedProfile)
      
      // Volver a modo solo lectura
      mode.value = 'readonly'

    } catch (err) {
      console.error('Error al guardar perfil:', err)
      error.value = err instanceof Error ? err.message : 'Error desconocido al guardar perfil'
      throw err
    } finally {
      saving.value = false
    }
  }

  /**
   * Elimina el perfil del usuario
   */
  const eliminarPerfil = async (userId: string): Promise<void> => {
    try {
      deleting.value = true
      error.value = null

      // Enviar petición DELETE a la API
      await request(`/usuarios/${userId}`, 'DELETE')
      
      // Limpiar datos locales
      profile.value = null
      formData.value = {
        nombre: '',
        correo: '',
        telefono: '',
        fotoUrl: '',
        direccion: {
          calle: '',
          estado: '',
          ciudad: '',
          codigoPostal: ''
        },
        descripcion: ''
      }

    } catch (err) {
      console.error('Error al eliminar perfil:', err)
      error.value = err instanceof Error ? err.message : 'Error desconocido al eliminar perfil'
      throw err
    } finally {
      deleting.value = false
    }
  }

  /**
   * Computed para verificar si el botón guardar debe estar habilitado
   */
  const puedeGuardar = computed((): boolean => {
    return mode.value === 'editing' && validarFormulario() && !saving.value
  })

  /**
   * Computed para verificar si es un profesional
   */
  const esProfesional = computed((): boolean => {
    return profile.value?.rol === 'professional'
  })

  return {
    // Estados
    profile: readonly(profile),
    loading: readonly(loading),
    error: readonly(error),
    saving: readonly(saving),
    deleting: readonly(deleting),
    mode: readonly(mode),
    formData,
    validation: readonly(validation),
    imagePreview: readonly(imagePreview),

    // Computed
    puedeGuardar,
    esProfesional,

    // Métodos
    cargarPerfil,
    rellenarFormulario,
    validarCampo,
    validarFormulario,
    manejarCambioImagen,
    habilitarEdicion,
    cancelarEdicion,
    guardarCambios,
    eliminarPerfil
  }
} 