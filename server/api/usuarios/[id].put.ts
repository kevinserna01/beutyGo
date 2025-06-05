/**
 * API Mock para actualizar datos de perfil de usuario
 * PUT /api/usuarios/{id}
 */
export default defineEventHandler(async (event) => {
  const userId = getRouterParam(event, 'id')
  const body = await readBody(event)
  
  // Simular delay de red
  await new Promise(resolve => setTimeout(resolve, 800))

  // Simular validación de datos
  if (!body.nombre || !body.correo || !body.telefono) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Faltan campos obligatorios'
    })
  }

  // Simular actualización exitosa
  const updatedUser = {
    id: userId,
    rol: body.rol || 'client',
    nombre: body.nombre,
    correo: body.correo,
    telefono: body.telefono,
    fotoUrl: body.fotoUrl || null,
    ...(body.direccion && { direccion: body.direccion }),
    ...(body.descripcion && { descripcion: body.descripcion }),
    updatedAt: new Date().toISOString()
  }

  return updatedUser
}) 