const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Sistema de Citas',
      version: '1.0.0',
      description: 'API para gestión de citas y turnos gubernamentales',
      contact: {
        name: 'Soporte API',
        email: 'soporte@gobierno.gob'
      }
    },
    servers: [
      {
        url: `http://localhost:4000`,
        description: 'Servidor de desarrollo'
      },
      {
        url: `https://api.citas.gob.ar`,
        description: 'Servidor de producción'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Ingrese el token JWT en el formato: Bearer {token}'
        }
      },
      responses: {
        UnauthorizedError: {
          description: 'Token de acceso faltante o inválido',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  error: {
                    type: 'string',
                    example: 'Token de acceso requerido'
                  }
                }
              }
            }
          }
        },
        NotFoundError: {
          description: 'Recurso no encontrado',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  error: {
                    type: 'string',
                    example: 'Recurso no encontrado'
                  }
                }
              }
            }
          }
        },
        ValidationError: {
          description: 'Error de validación de datos',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  error: {
                    type: 'string',
                    example: 'Datos inválidos'
                  }
                }
              }
            }
          }
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: ['./routes/*.js'], // archivos que contienen las anotaciones de Swagger
};

const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;