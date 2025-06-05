# 📚 Especificación de APIs - Backend

## 🎯 Endpoints Requeridos para BeautyGo

### **🔐 Autenticación**

#### `POST /api/auth/login`
**Descripción**: Iniciar sesión de usuario

**Request Body**:
```json
{
  "email": "usuario@email.com",
  "password": "contraseña123"
}
```

**Response 200**:
```json
{
  "user": {
    "id": "1",
    "name": "Juan Pérez",
    "email": "juan@email.com", 
    "role": "client",
    "createdAt": "2024-01-01T00:00:00Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "message": "Login exitoso"
}
```

**Response 401**:
```json
{
  "message": "Credenciales incorrectas"
}
```

---

#### `POST /api/auth/register`
**Descripción**: Registrar nuevo usuario

**Request Body**:
```json
{
  "firstName": "Juan",
  "lastName": "Pérez", 
  "email": "juan@email.com",
  "password": "contraseña123",
  "phone": "3012345678",
  "role": "client"
}
```

**Response 201**:
```json
{
  "user": {
    "id": "1",
    "name": "Juan Pérez",
    "email": "juan@email.com",
    "role": "client", 
    "createdAt": "2024-01-01T00:00:00Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "message": "Usuario creado exitosamente"
}
```

**Response 400**:
```json
{
  "message": "El email ya está registrado"
}
```

---

### **👤 Gestión de Perfil**

#### `GET /api/usuarios/{id}`
**Descripción**: Obtener datos completos del perfil de usuario

**Headers**:
```
Authorization: Bearer {token}
```

**Response 200**:
```json
{
  "id": "1",
  "rol": "professional",
  "nombre": "María García López",
  "correo": "maria@beautygo.com",
  "telefono": "+57 301 234 5678",
  "fotoUrl": "https://storage.beautygo.com/avatars/user1.jpg",
  "direccion": {
    "calle": "Carrera 15 # 93-47",
    "estado": "BOG",
    "ciudad": "bog-001", 
    "codigoPostal": "110221"
  },
  "descripcion": "Estilista profesional con más de 10 años de experiencia...",
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-15T10:30:00Z"
}
```

**Response 404**:
```json
{
  "message": "Usuario no encontrado"
}
```

**Response 403**:
```json
{
  "message": "No tienes permisos para ver este perfil"
}
```

---

#### `PUT /api/usuarios/{id}`
**Descripción**: Actualizar datos del perfil de usuario

**Headers**:
```
Authorization: Bearer {token}
```

**Request Body**:
```json
{
  "nombre": "María García López",
  "correo": "maria.nueva@email.com",
  "telefono": "+57 301 234 5678",
  "fotoUrl": "https://storage.beautygo.com/avatars/user1_new.jpg",
  "direccion": {
    "calle": "Carrera 15 # 93-47",
    "estado": "BOG", 
    "ciudad": "bog-001",
    "codigoPostal": "110221"
  },
  "descripcion": "Estilista profesional actualizada..."
}
```

**Response 200**:
```json
{
  "id": "1",
  "rol": "professional",
  "nombre": "María García López",
  "correo": "maria.nueva@email.com",
  "telefono": "+57 301 234 5678",
  "fotoUrl": "https://storage.beautygo.com/avatars/user1_new.jpg",
  "direccion": {
    "calle": "Carrera 15 # 93-47",
    "estado": "BOG",
    "ciudad": "bog-001",
    "codigoPostal": "110221"
  },
  "descripcion": "Estilista profesional actualizada...",
  "updatedAt": "2024-01-15T11:45:00Z"
}
```

**Response 400**:
```json
{
  "message": "Datos de entrada inválidos",
  "errors": {
    "correo": "Formato de email inválido",
    "telefono": "Formato de teléfono inválido"
  }
}
```

**Response 403**:
```json
{
  "message": "No tienes permisos para editar este perfil"
}
```

---

#### `DELETE /api/usuarios/{id}`
**Descripción**: Eliminar perfil de usuario

**Headers**:
```
Authorization: Bearer {token}
```

**Response 200**:
```json
{
  "success": true,
  "message": "Perfil eliminado correctamente",
  "deletedAt": "2024-01-15T12:00:00Z"
}
```

**Response 403**:
```json
{
  "message": "No tienes permisos para eliminar este perfil"
}
```

**Response 404**:
```json
{
  "message": "Usuario no encontrado"
}
```

---

### **📷 Gestión de Archivos**

#### `POST /api/upload/avatar`
**Descripción**: Subir foto de perfil

**Headers**:
```
Authorization: Bearer {token}
Content-Type: multipart/form-data
```

**Request Body** (FormData):
```
file: [archivo de imagen]
```

**Response 200**:
```json
{
  "success": true,
  "url": "https://storage.beautygo.com/avatars/user1_1642251600.jpg",
  "message": "Imagen subida exitosamente"
}
```

**Response 400**:
```json
{
  "message": "Formato de archivo no válido. Solo se permiten JPG, PNG, GIF"
}
```

**Response 413**:
```json
{
  "message": "El archivo es demasiado grande. Máximo 5MB"
}
```

---

### **🌍 Ubicaciones (Opcional)**

#### `GET /api/ubicaciones/departamentos`
**Descripción**: Obtener lista de departamentos de Colombia

**Response 200**:
```json
{
  "departamentos": [
    {
      "id": "BOG",
      "nombre": "Bogotá D.C."
    },
    {
      "id": "ANT", 
      "nombre": "Antioquia"
    }
  ]
}
```

---

#### `GET /api/ubicaciones/ciudades/{departamentoId}`
**Descripción**: Obtener ciudades por departamento

**Response 200**:
```json
{
  "ciudades": [
    {
      "id": "bog-001",
      "nombre": "Usaquén",
      "departamentoId": "BOG"
    },
    {
      "id": "bog-002",
      "nombre": "Chapinero", 
      "departamentoId": "BOG"
    }
  ]
}
```

---

## 🔧 Especificaciones Técnicas

### **Headers Comunes**
```
Content-Type: application/json
Authorization: Bearer {jwt_token}
```

### **Códigos de Estado HTTP**
- `200` - OK (éxito)
- `201` - Created (recurso creado)
- `400` - Bad Request (datos inválidos)
- `401` - Unauthorized (no autenticado)
- `403` - Forbidden (sin permisos)
- `404` - Not Found (recurso no encontrado)
- `413` - Payload Too Large (archivo muy grande)
- `422` - Unprocessable Entity (validación fallida)
- `500` - Internal Server Error (error del servidor)

### **Validaciones Requeridas**

#### **Campos de Usuario**:
- `nombre`: Obligatorio, min 2 caracteres
- `correo`: Obligatorio, formato email válido, único
- `telefono`: Obligatorio, formato colombiano `+57 3XX XXX XXXX`
- `password`: Min 8 caracteres, al menos 1 mayúscula y 1 número

#### **Campos de Profesional**:
- `direccion.calle`: Obligatorio
- `direccion.estado`: Obligatorio, debe existir en BD
- `direccion.ciudad`: Obligatorio, debe pertenecer al estado
- `direccion.codigoPostal`: Obligatorio, 6 dígitos
- `descripcion`: Obligatorio, min 20 caracteres

#### **Archivos**:
- Tipos permitidos: JPG, PNG, GIF
- Tamaño máximo: 5MB
- Resolución recomendada: 400x400px

### **Seguridad**

#### **JWT Token**:
```json
{
  "sub": "1",
  "email": "usuario@email.com",
  "role": "client",
  "iat": 1642251600,
  "exp": 1642338000
}
```

#### **Rate Limiting**:
- Login: 5 intentos por IP cada 15 minutos
- Upload: 10 archivos por usuario cada hora
- API general: 100 requests por usuario cada hora

### **Base de Datos**

#### **Tabla: usuarios**
```sql
CREATE TABLE usuarios (
  id UUID PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  correo VARCHAR(255) UNIQUE NOT NULL,
  telefono VARCHAR(20) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  rol ENUM('client', 'professional') NOT NULL,
  foto_url TEXT,
  calle VARCHAR(255),
  estado VARCHAR(10),
  ciudad VARCHAR(20), 
  codigo_postal VARCHAR(6),
  descripcion TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP NULL
);
```

#### **Tabla: departamentos**
```sql
CREATE TABLE departamentos (
  id VARCHAR(10) PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL
);
```

#### **Tabla: ciudades**
```sql
CREATE TABLE ciudades (
  id VARCHAR(20) PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  departamento_id VARCHAR(10) REFERENCES departamentos(id)
);
```

---

## 🚀 Implementación Sugerida

### **Stack Recomendado**:
- **Framework**: Node.js + Express / NestJS / FastAPI
- **Base de datos**: PostgreSQL / MySQL
- **Autenticación**: JWT + bcrypt
- **Storage**: AWS S3 / Cloudinary / Firebase Storage
- **Validación**: Joi / Yup / Zod

### **Ejemplo con Express.js**:
```javascript
// GET /api/usuarios/:id
app.get('/api/usuarios/:id', authenticate, async (req, res) => {
  try {
    const userId = req.params.id;
    const currentUser = req.user;
    
    // Verificar permisos
    if (currentUser.id !== userId && currentUser.role !== 'admin') {
      return res.status(403).json({
        message: 'No tienes permisos para ver este perfil'
      });
    }
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: 'Usuario no encontrado'
      });
    }
    
    res.json({
      id: user.id,
      rol: user.rol,
      nombre: user.nombre,
      correo: user.correo,
      telefono: user.telefono,
      fotoUrl: user.fotoUrl,
      direccion: user.direccion,
      descripcion: user.descripcion
    });
    
  } catch (error) {
    res.status(500).json({
      message: 'Error interno del servidor'
    });
  }
});
```

---

**🎯 Con esta especificación, el backend tendrá todo lo necesario para funcionar perfectamente con nuestro frontend de perfil de usuario.** 🚀 