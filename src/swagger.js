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
            categoryId: { type: 'integer', example: 2 }
          }
        },
        User: {
          type: 'object',
          properties: {
            username: { type: 'string', example: 'benjaminbutton' },
            email: { type: 'string', example: 'egghead@arc.com' },
            firstname: { type: 'string', example: 'benjamin' },
            lastname: { type: 'string', example: 'button' },
            phone:  { type: 'string', example: '0947392909' }
          }
        },  
        Auction: {
          type: 'object',
          properties: {
            productId: { type: 'integer', example: 10 },
            startTime: { type: 'datetime', example: "2026-06-06T06:13:00.000Z" },
            endTime: { type: 'datetime', example: "2026-06-09T06:13:00.000Z" },
            startingPrice: { type: 'decimal', example: 10 },
            reservePrice:  { type: 'decimal', example: 5500 },
            minIncrement:  { type: 'decimal', example: 100 },
            status:  { type: 'string', example: 'WAITING' }
          }
        },  
        Bid: {
          type: 'object',
          properties: {
            bidderId: { type: 'integer', example: 10 },
            auctionId: { type: 'datetime', example: "2026-06-06T06:13:00.000Z" },
            amount: { type: 'decimal', example: 10 },
            isWinning: {type: 'boolean', example: false}
          }
        }, 
        Login: {
          type: 'object',
          properties: {
            email: { type: 'string', example: 'egghead@arc.com' },
            password:  { type: 'string', example: 'lucky7in*myhead' }
          }
        },   
        Register: {
          type: 'object',
          properties: {
            username: { type: 'string', example: 'benjaminbutton' },
            email: { type: 'string', example: 'egghead@arc.com' },
            password:  { type: 'string', example: 'lucky7in*myhead' },
            firstname: { type: 'string', example: 'benjamin' },
            lastname: { type: 'string', example: 'button' },
            phone:  { type: 'string', example: '0947392909' },
            role: { type: 'string', example: "BUYER" },
            label: { type: 'string', example: 'SCHOOL' },
            street: { type: 'string', example: 'Wannasorn building' },
            city: { type: 'string', example: 'Bangkok' },
            state: { type: 'string', example: 'BKK city' },
            postalCode: { type: 'string', example: '01400' },
            country: { type: 'string', example: 'Bangkok' },
          }
        },
        Image: {
          type: 'object',
          properties: {
            productId: { type: 'integer', example: 10 },
            imageUrl: { type: 'string', example: "https://res.cloudinary.com/demo/image/upload/sample.jpg" },
          }
        },    
      }
    },
  },
  apis: ['./src/routes/*.js'], // Path to the API docs or where routes are
};

export const swaggerSpec = swaggerJSDoc(options);
