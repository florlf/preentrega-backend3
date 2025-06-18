const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Eclipse Store API',
      version: '1.0.0',
      description: 'Documentación de API para el módulo de usuarios',
    },
    servers: [
      {
        url: 'http://localhost:8080/api/sessions',
        description: 'Servidor local con prefijo /api/sessions'
      }
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            first_name: { type: 'string' },
            last_name: { type: 'string' },
            email: { type: 'string', format: 'email' },
            password: { type: 'string' },
            role: { type: 'string', enum: ['user', 'admin'] },
            pets: { 
              type: 'array',
              items: { type: 'string' },
              default: [] 
            }
          }
        }
      }
    }
  },
  apis: ['./routes/auth.routes.js'],
};

const specs = swaggerJsdoc(options);

module.exports = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
};