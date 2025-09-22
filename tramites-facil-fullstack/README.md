# Sistema de Citas - API REST

API completa para gestión de citas y turnos gubernamentales con autenticación JWT, construida con Node.js, Express y MySQL.

## 🚀 Características

- **Autenticación completa**: Registro, login y autenticación con JWT
- **Gestión de oficinas**: CRUD de oficinas con horarios y disponibilidad
- **Sistema de trámites**: Gestión de diferentes tipos de trámites
- **Citas de usuarios**: Crear, modificar, confirmar y cancelar citas
- **Documentación interactiva**: Swagger UI integrado
- **Base de datos local**: Compatible con XAMPP/MySQL

## 📋 Endpoints Disponibles

### Autenticación
- `POST /api/register` - Registrar usuario
- `POST /api/login` - Iniciar sesión
- `GET /api/profile` - Obtener perfil (requiere auth)

### Oficinas
- `GET /api/oficinas` - Listar todas las oficinas
- `GET /api/oficinas/:id` - Ver detalle de una oficina
- `GET /api/oficinas/:id/disponibilidad` - Ver horarios libres
- `GET /api/oficinas/:id/horarios` - Ver todos los horarios
- `GET /api/oficinas/:id/horarios/:fecha` - Horarios para fecha específica
- `GET /api/oficinas/:id/citas` - Ver citas de la oficina

### Trámites
- `GET /api/tramites` - Listar todos los trámites
- `GET /api/tramites/:id` - Ver detalle de un trámite
- `GET /api/tramites/:id/disponibilidad` - Ver horarios disponibles por trámite

### Citas (Usuario)
- `POST /api/citas` - Crear una cita
- `GET /api/citas` - Listar todas mis citas
- `GET /api/citas/:id` - Ver detalle de una cita
- `PUT /api/citas/:id` - Modificar cita (reagendar)
- `PUT /api/citas/:id/confirmar` - Confirmar asistencia
- `DELETE /api/citas/:id` - Cancelar cita
- `GET /api/citas/:id/estado` - Ver estado de una cita

## 🛠️ Instalación

### Prerrequisitos
- Node.js 16+ 
- XAMPP (Apache + MySQL)
- npm o yarn

### 1. Configurar XAMPP
1. Instalar y ejecutar XAMPP
2. Iniciar Apache y MySQL
3. Abrir phpMyAdmin (http://localhost/phpmyadmin)

### 2. Crear la base de datos
1. En phpMyAdmin, crear nueva base de datos llamada `sistema_citas`
2. Ejecutar el script SQL completo proporcionado

### 3. Configurar el proyecto
```bash
# Clonar o descargar el proyecto
cd sistema-citas-api

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus configuraciones
```

### 4. Ejecutar la aplicación
```bash
# Modo desarrollo
npm run dev

# Modo producción
npm start
```

## 📊 Base de Datos

La base de datos incluye las siguientes tablas:

- `usuarios` - Información de usuarios
- `oficinas` - Oficinas disponibles
- `tramites` - Tipos de trámites
- `oficina_tramites` - Relación muchos a muchos
- `horarios_disponibles` - Slots de tiempo disponibles
- `citas` - Citas agendadas

### Datos de ejemplo incluidos:
- 3 oficinas con horarios
- 4 tipos de trámites
- Horarios generados para los próximos 30 días
- Usuario de prueba: `juan.perez@email.com` / `123456`

## 🔐 Autenticación

La API usa JWT (JSON Web Tokens) para autenticación:

1. **Registro**: `POST /api/register` - Devuelve token
2. **Login**: `POST /api/login` - Devuelve token
3. **Uso**: Incluir header `Authorization: Bearer {token}`

### Ejemplo de uso:
```javascript
// Login
const response = await fetch('/api/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'juan.perez@email.com',
    password: '123456'
  })
});

const { token } = await response.json();

// Usar token en siguientes requests
fetch('/api/citas', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});
```

## 📖 Documentación

Accede a la documentación interactiva en: `http://localhost:4000/docs`

La documentación incluye:
- Descripción de todos los endpoints
- Esquemas de request/response
- Ejemplos de uso
- Interfaz para probar la API

## 🧪 Pruebas

### Probar la API con cURL:

```bash
# Registro
curl -X POST http://localhost:4000/api/register \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Juan","apellido":"Pérez","email":"test@email.com","dni":"12345678","password":"123456"}'

# Login
curl -X POST http://localhost:4000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@email.com","password":"123456"}'

# Obtener oficinas (requiere token)
curl -X GET http://localhost:4000/api/oficinas \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 🏗️ Estructura del Proyecto

```
sistema-citas-api/
├── config/
│   ├── db.js              # Configuración de base de datos
│   └── swaggerConfig.js   # Configuración de Swagger
├── controllers/
│   ├── authController.js    # Autenticación
│   ├── citaController.js    # Gestión de citas
│   ├── oficinaController.js # Gestión de oficinas
│   └── tramiteController.js # Gestión de trámites
├── middlewares/
│   └── authMiddleware.js  # Middleware de autenticación JWT
├── models/
│   ├── userModel.js       # Modelo de usuarios
│   ├── citaModel.js       # Modelo de citas
│   ├── oficinaModel.js    # Modelo de oficinas
│   └── tramiteModel.js    # Modelo de trámites
├── routes/
│   ├── authRoutes.js      # Rutas de autenticación
│   ├── citaRoutes.js      # Rutas de citas
│   ├── oficinaRoutes.js   # Rutas de oficinas
│   └── tramiteRoutes.js   # Rutas de trámites
├── app.js                 # Configuración de Express
├── server.js             # Punto de entrada
├── package.json          # Dependencias
└── .env.example         # Variables de entorno ejemplo
```

## 🔧 Configuración

### Variables de entorno (.env):
```env
# Base de datos
HOST=localhost
USER=root
PASSWORD=
DATABASE=sistema_citas

# Servidor
PORT=4000
NODE_ENV=development

# JWT
JWT_SECRET=tu-clave-secreta
JWT_EXPIRES_IN=24h
```

## 🚨 Solución de Problemas

### Error: "ER_BAD_DB_ERROR"
- Crear la base de datos `sistema_citas` en phpMyAdmin

### Error: "ECONNREFUSED"
- Verificar que MySQL esté ejecutándose en XAMPP

### Error: "jwt must be provided"
- Incluir header Authorization con token válido

### Error: "Token inválido"
- Verificar que el JWT_SECRET sea el mismo
- Obtener un nuevo token con login

## 📝 Notas de Desarrollo

- Los tokens JWT expiran en 24 horas por defecto
- Las contraseñas se encriptan con bcrypt
- La API usa transacciones para operaciones críticas
- Los horarios se validan para evitar conflictos
- Incluye manejo de errores centralizado

## 🤝 Contribución

1. Fork del proyecto
2. Crear rama feature (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia ISC.