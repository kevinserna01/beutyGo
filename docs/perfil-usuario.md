# Página de Perfil de Usuario - BeautyGo

## Descripción General

La página de perfil de usuario permite a los usuarios gestionar su información personal y configuración de cuenta. Implementa todas las funcionalidades CRUD (Create, Read, Update, Delete) con validación en tiempo real, selects dependientes y funcionalidades avanzadas.

## Funcionalidades Implementadas

### ✅ 1. Carga inicial de datos (GET)
- Petición `GET /api/usuarios/{id}` al cargar la página
- Manejo de estados de carga, error y éxito
- JSON incluye: `id`, `rol`, `nombre`, `correo`, `telefono`, `fotoUrl`
- Para profesionales: objeto `direccion` y `descripcion`
- Formulario en modo solo lectura por defecto

### ✅ 2. Formulario y secciones
- **Datos básicos**: nombre, correo, teléfono, foto de perfil
- **Datos profesionales**: calle, estado, ciudad, código postal, descripción
- Sección profesional visible solo si `rol === "professional"`
- Vista previa de imagen en tiempo real

### ✅ 3. Edición de datos (PUT)
- Botón "Editar perfil" habilita el modo edición
- Botón "Cancelar" restaura valores originales
- Botón "Guardar cambios" con validación en tiempo real
- Envía `PUT /api/usuarios/{id}` al guardar
- Indicador "Guardando..." durante la petición

### ✅ 4. Selects dependientes (Estado → Ciudad)
- Select de estado carga lista completa al iniciar
- Cambio de estado actualiza dinámicamente las ciudades
- Implementado con datos de México (32 estados + ciudades principales)

### ✅ 5. Vista previa de foto
- Input tipo file muestra imagen seleccionada inmediatamente
- Validación de tipos de archivo (image/*)
- Imagen circular con bordes y hover effects

### ✅ 6. Eliminar perfil (DELETE)
- Modal de confirmación con mensaje claro
- Botón "Confirmar" ejecuta `DELETE /api/usuarios/{id}`
- Redirección a página principal tras éxito
- Manejo de errores sin cerrar modal

### ✅ 7. Responsividad y accesibilidad
- Responsive design para pantallas < 600px
- Etiquetas semánticas: `<form>`, `<fieldset>`, `<legend>`, `<label>`
- Atributos `aria-*` y `role` para accesibilidad
- Mensajes de validación junto a campos afectados

## Estructura de Archivos

### Archivos principales creados/actualizados:

```
├── pages/
│   └── perfil.vue                 # Página principal del perfil
├── composables/
│   ├── useProfile.ts             # Lógica de gestión de perfil
│   ├── useLocations.ts           # Estados y ciudades de México
│   └── useApi.ts                 # Actualizado para nuevos endpoints
├── types/
│   └── index.ts                  # Tipos TypeScript añadidos
├── server/api/usuarios/
│   ├── [id].get.ts              # Endpoint GET para cargar perfil
│   ├── [id].put.ts              # Endpoint PUT para actualizar
│   └── [id].delete.ts           # Endpoint DELETE para eliminar
└── docs/
    └── perfil-usuario.md        # Esta documentación
```

## Validaciones Implementadas

### Campos básicos (todos los usuarios):
- **Nombre**: Obligatorio, mínimo 2 caracteres
- **Correo**: Obligatorio, formato email válido
- **Teléfono**: Obligatorio, formato telefónico válido

### Campos profesionales (solo si `rol === "professional"`):
- **Calle**: Obligatorio, no vacío
- **Estado**: Obligatorio, selección válida
- **Ciudad**: Obligatorio, selección válida
- **Código postal**: Obligatorio, 5 dígitos
- **Descripción**: Obligatorio, mínimo 20 caracteres

## API Endpoints

### GET /api/usuarios/{id}
```json
{
  "id": "1",
  "rol": "professional",
  "nombre": "María García López",
  "correo": "maria.garcia@beautygo.com",
  "telefono": "+52 55 1234 5678",
  "fotoUrl": "https://...",
  "direccion": {
    "calle": "Av. Insurgentes Sur 1234",
    "estado": "CMX",
    "ciudad": "cmx-003",
    "codigoPostal": "03100"
  },
  "descripcion": "Estilista profesional..."
}
```

### PUT /api/usuarios/{id}
```json
{
  "nombre": "María García López",
  "correo": "maria.garcia@beautygo.com",
  "telefono": "+52 55 1234 5678",
  "fotoUrl": "https://...",
  "direccion": {
    "calle": "Av. Insurgentes Sur 1234",
    "estado": "CMX",
    "ciudad": "cmx-003",
    "codigoPostal": "03100"
  },
  "descripcion": "Estilista profesional..."
}
```

### DELETE /api/usuarios/{id}
```json
{
  "success": true,
  "message": "Perfil eliminado correctamente",
  "deletedAt": "2024-01-01T12:00:00.000Z"
}
```

## Estados y Ciudades

El sistema incluye todos los 32 estados de México con ciudades principales:
- Ciudad de México (12 delegaciones)
- Jalisco (6 ciudades principales)
- Nuevo León (6 ciudades principales)
- Estado de México (6 ciudades principales)
- Puebla (4 ciudades principales)

## Usuarios de Prueba

La API mock incluye 3 usuarios de ejemplo:

### Usuario 1 - Profesional
- **ID**: 1
- **Nombre**: María García López
- **Rol**: professional
- **Ubicación**: Ciudad de México

### Usuario 2 - Cliente
- **ID**: 2
- **Nombre**: Juan Pérez Martínez
- **Rol**: client

### Usuario 3 - Profesional
- **ID**: 3
- **Nombre**: Ana Rodríguez Sánchez
- **Rol**: professional
- **Ubicación**: Guadalajara, Jalisco

## Tecnologías Utilizadas

- **NuxtJS 3**: Framework Vue.js full-stack
- **Vue 3**: Composition API con `<script setup>`
- **TypeScript**: Tipado estático completo
- **TailwindCSS**: Estilos utility-first
- **Composables**: Lógica reutilizable encapsulada
- **API Routes**: Endpoints mock integrados

## Accesibilidad

- Navegación por teclado completa
- Lectores de pantalla compatible
- Indicadores visuales claros
- Mensajes de error descriptivos
- Contraste adecuado de colores
- Responsive design mobile-first

## Próximos Pasos

1. Integrar con sistema de autenticación real
2. Añadir upload de imágenes a servidor
3. Implementar notificaciones toast
4. Añadir más validaciones personalizadas
5. Implementar cache de datos del perfil 