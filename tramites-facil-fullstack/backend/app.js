const express = require("express");
const cors = require('cors');
require('dotenv').config();

// Rutas
const authRoutes = require('./routes/authRoutes');
const oficinaRoutes = require('./routes/oficinaRoutes');
const tramiteRoutes = require('./routes/tramiteRoutes');
const citaRoutes = require('./routes/citaRoutes');

// Swagger
const swaggerUI = require('swagger-ui-express');
const swaggerSpec = require('./config/swaggerConfig');

const api = express();

// Middlewares
api.use(cors());
api.use(express.json());

// Documentación
api.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));

// Rutas de la API
api.use('/api', authRoutes);
api.use('/api/oficinas', oficinaRoutes);
api.use('/api/tramites', tramiteRoutes);
api.use('/api/citas', citaRoutes);

// Ruta de bienvenida
api.get('/', (req, res) => {
    res.json({
        message: 'API Sistema de Citas v1.0',
        documentation: '/docs',
        endpoints: {
            auth: {
                register: 'POST /api/register',
                login: 'POST /api/login',
                profile: 'GET /api/profile'
            },
            oficinas: {
                list: 'GET /api/oficinas',
                detail: 'GET /api/oficinas/:id',
                availability: 'GET /api/oficinas/:id/disponibilidad',
                schedules: 'GET /api/oficinas/:id/horarios',
                appointments: 'GET /api/oficinas/:id/citas'
            },
            tramites: {
                list: 'GET /api/tramites',
                detail: 'GET /api/tramites/:id',
                availability: 'GET /api/tramites/:id/disponibilidad'
            },
            citas: {
                create: 'POST /api/citas',
                list: 'GET /api/citas',
                detail: 'GET /api/citas/:id',
                update: 'PUT /api/citas/:id',
                confirm: 'PUT /api/citas/:id/confirmar',
                cancel: 'DELETE /api/citas/:id',
                status: 'GET /api/citas/:id/estado'
            }
        }
    });
});

// Manejo de errores
api.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        error: 'Algo salió mal!',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Error interno del servidor'
    });
});

// Manejo de rutas no encontradas
api.use('*', (req, res) => {
    res.status(404).json({ 
        error: 'Endpoint no encontrado',
        suggestion: 'Visita /docs para ver la documentación de la API'
    });
});

module.exports = api;