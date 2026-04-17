import swaggerJSDoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'A Little Bid API Documentation',
      version: '1.0.0',
      description: 'Shared documentation for our local dev environment',
    },
    servers: [
      {
        url: 'http://localhost:3000/api', 
      },
    ],
      components: {
      schemas: {
        // --- GLOBAL ADDRESS SCHEMA ---
        Address: {
          type: 'object',
          properties: {
            label: { type: 'string', example: 'SCHOOL' },
            street: { type: 'string', example: 'Wannasorn building' },
            city: { type: 'string', example: 'Bangkok' },
            state: { type: 'string', example: 'BKK city' },
            postalCode: { type: 'string', example: '01400' },
            country: { type: 'string', example: 'Bangkok' },
            isDefault: { type: 'boolean', example: false }
          }
        },
        Product: {
          type: 'object',
          properties: {
            name: { type: 'string', example: 'Garmin xo' },
            description: { type: 'string', example: 'excellent dive computer with geolocation tagging' },
            categoryId: { type: 'int', example: 2 },
            sellerId: { type: 'int', example: 8 }
          }
        },
      }
    },
  },
  apis: ['./src/routes/*.js'], // Path to the API docs or where routes are
};

export const swaggerSpec = swaggerJSDoc(options);
