/**
 * API Mock para eliminar perfil de usuario
 * DELETE /api/usuarios/{id}
 */
export default defineEventHandler(async (event) => {
  const userId = getRouterParam(event, 'id')
  
  // Simular delay de red
  await new Promise(resolve => setTimeout(resolve, 1000))

  // Simular verificación de existencia del usuario
  if (!userId || userId === '0') {
    throw createError({
      statusCode: 404,
      statusMessage: 'Usuario no encontrado'
    })
  }

  // Simular verificación de permisos
  if (userId === 'admin') {
    throw createError({
      statusCode: 403,
      statusMessage: 'No se puede eliminar una cuenta de administrador'
    })
  }

  // Simular eliminación exitosa
  return {
    success: true,
    message: 'Perfil eliminado correctamente',
    deletedAt: new Date().toISOString()
  }
}) 