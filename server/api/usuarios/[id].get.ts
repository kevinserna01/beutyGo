/**
 * API Mock para obtener datos de perfil de usuario
 * GET /api/usuarios/{id}
 */
export default defineEventHandler(async (event) => {
  const userId = getRouterParam(event, 'id')
  
  // Simular delay de red
  await new Promise(resolve => setTimeout(resolve, 500))

  // Datos mock base - en una app real estos vendrían de la base de datos
  // usando el userId para obtener la información del usuario autenticado
  const mockUsers: Record<string, any> = {
    '1': {
      id: '1',
      rol: 'professional',
      nombre: 'María García López',
      correo: 'maria.garcia@beautygo.com',
      telefono: '+57 301 234 5678',
      fotoUrl: 'https://images.unsplash.com/photo-1494790108755-2616b169e900?w=150',
      direccion: {
        calle: 'Carrera 15 # 93-47',
        estado: 'BOG',
        ciudad: 'bog-001',
        codigoPostal: '110221'
      },
      descripcion: 'Estilista profesional con más de 10 años de experiencia en cortes, coloración y tratamientos capilares. Especializada en técnicas modernas y tendencias actuales. Certificada en colorimetría avanzada.'
    },
    '2': {
      id: '2',
      rol: 'client',
      nombre: 'Juan Pérez Martínez',
      correo: 'juan.perez@gmail.com',
      telefono: '+57 315 987 6543',
      fotoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'
    },
    '3': {
      id: '3',
      rol: 'professional',
      nombre: 'Ana Rodríguez Sánchez',
      correo: 'ana.rodriguez@spa.com',
      telefono: '+57 304 555 1234',
      fotoUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
      direccion: {
        calle: 'Calle 70 # 52-20',
        estado: 'ANT',
        ciudad: 'ant-001',
        codigoPostal: '050010'
      },
      descripcion: 'Especialista en tratamientos faciales, masajes relajantes y terapias de belleza. Más de 8 años de experiencia en spas de lujo. Certificada en aromaterapia y técnicas de relajación.'
    }
  }

  // En una aplicación real, aquí se consultaría la base de datos:
  // const user = await getUserFromDatabase(userId)
  // Y se verificaría que el usuario autenticado puede acceder a este perfil
  
  const user = mockUsers[userId as string]
  
  if (!user) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Usuario no encontrado'
    })
  }

  // NOTA IMPORTANTE: En producción estos datos vendrían de:
  // 1. Base de datos del usuario autenticado (usando JWT token)
  // 2. Verificación de permisos de acceso
  // 3. Datos actualizados en tiempo real
  
  return user
}) 