const swaggerJsdoc = require('swagger-jsdoc');
const path = require('path');

const PORT = process.env.PORT || 5000;

const definition = {
  openapi: '3.0.3',
  info: {
    title: 'Nidhie Backend API',
    version: '1.0.0',
    description:
      'Electronics store API: auth (access + refresh tokens), products, cart, and orders.'
  },
  servers: [
    { url: `http://localhost:${PORT}`, description: 'Local dev server' }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Access token returned by /api/auth/login or /api/auth/register'
      }
    },
    schemas: {
      User: {
        type: 'object',
        properties: {
          _id: { type: 'string', example: '651f1c2b8e2b3a0012a3b456' },
          name: { type: 'string', example: 'Jane Doe' },
          email: { type: 'string', format: 'email', example: 'jane@example.com' },
          role: { type: 'string', enum: ['customer', 'admin'], example: 'customer' }
        }
      },
      AuthResponse: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          name: { type: 'string' },
          email: { type: 'string', format: 'email' },
          role: { type: 'string', enum: ['customer', 'admin'] },
          accessToken: {
            type: 'string',
            description: 'JWT access token, 15 minute expiry. Send as `Authorization: Bearer <token>`.'
          }
        }
      },
      RegisterRequest: {
        type: 'object',
        required: ['name', 'email', 'password'],
        properties: {
          name: { type: 'string', example: 'Jane Doe' },
          email: { type: 'string', format: 'email', example: 'jane@example.com' },
          password: { type: 'string', format: 'password', minLength: 6, example: 'secret123' }
        }
      },
      LoginRequest: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', format: 'email', example: 'jane@example.com' },
          password: { type: 'string', format: 'password', example: 'secret123' }
        }
      },
      ProductMedia: {
        type: 'object',
        required: ['url'],
        properties: {
          type: { type: 'string', enum: ['image', 'video'], default: 'image' },
          url: { type: 'string', format: 'uri' },
          altText: { type: 'string' }
        }
      },
      Product: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          name: { type: 'string', example: 'Wireless Headphones' },
          description: { type: 'string', example: 'Noise-cancelling over-ear headphones' },
          price: { type: 'number', example: 2999 },
          category: { type: 'string', example: 'Electronics' },
          subCategory: { type: 'string', example: 'Headphones' },
          brand: { type: 'string', example: 'Acme' },
          stock: { type: 'number', example: 25 },
          imageUrl: { type: 'string', format: 'uri' },
          media: {
            type: 'array',
            items: { $ref: '#/components/schemas/ProductMedia' }
          },
          ratings: {
            type: 'object',
            properties: {
              average: { type: 'number', example: 4.5 },
              count: { type: 'number', example: 12 }
            }
          },
          warranty: { type: 'string', example: '1 year manufacturer warranty' },
          color: { type: 'string', example: 'Black' },
          weight: { type: 'number', example: 250 },
          isActive: { type: 'boolean', default: true },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' }
        }
      },
      ProductInput: {
        type: 'object',
        required: ['name', 'description', 'price', 'category'],
        properties: {
          name: { type: 'string' },
          description: { type: 'string' },
          price: { type: 'number', minimum: 0 },
          category: { type: 'string' },
          subCategory: { type: 'string' },
          brand: { type: 'string' },
          stock: { type: 'number', minimum: 0, default: 0 },
          imageUrl: { type: 'string', format: 'uri' },
          media: {
            type: 'array',
            items: { $ref: '#/components/schemas/ProductMedia' }
          },
          warranty: { type: 'string' },
          color: { type: 'string' },
          weight: { type: 'number' }
        }
      },
      ProductListResponse: {
        type: 'object',
        properties: {
          products: {
            type: 'array',
            items: { $ref: '#/components/schemas/Product' }
          },
          page: { type: 'number', example: 1 },
          totalPages: { type: 'number', example: 4 },
          totalProducts: { type: 'number', example: 37 }
        }
      },
      CartItem: {
        type: 'object',
        properties: {
          product: { $ref: '#/components/schemas/Product' },
          quantity: { type: 'number', example: 2 }
        }
      },
      Cart: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          user: { type: 'string' },
          items: {
            type: 'array',
            items: { $ref: '#/components/schemas/CartItem' }
          },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' }
        }
      },
      AddToCartRequest: {
        type: 'object',
        required: ['productId'],
        properties: {
          productId: { type: 'string', example: '651f1c2b8e2b3a0012a3b456' },
          quantity: { type: 'number', minimum: 1, default: 1, example: 1 }
        }
      },
      UpdateCartItemRequest: {
        type: 'object',
        required: ['quantity'],
        properties: {
          quantity: { type: 'number', minimum: 1, example: 3 }
        }
      },
      ShippingAddress: {
        type: 'object',
        required: ['address', 'city', 'postalCode', 'country'],
        properties: {
          address: { type: 'string', example: '221B Baker Street' },
          city: { type: 'string', example: 'London' },
          postalCode: { type: 'string', example: 'NW1 6XE' },
          country: { type: 'string', example: 'UK' }
        }
      },
      CreateOrderRequest: {
        type: 'object',
        required: ['shippingAddress'],
        properties: {
          shippingAddress: { $ref: '#/components/schemas/ShippingAddress' },
          paymentMethod: { type: 'string', default: 'COD', example: 'COD' }
        }
      },
      OrderItem: {
        type: 'object',
        properties: {
          product: { type: 'string' },
          name: { type: 'string' },
          image: { type: 'string' },
          price: { type: 'number' },
          qty: { type: 'number' }
        }
      },
      Order: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          user: { type: 'string' },
          orderItems: {
            type: 'array',
            items: { $ref: '#/components/schemas/OrderItem' }
          },
          shippingAddress: { $ref: '#/components/schemas/ShippingAddress' },
          paymentMethod: { type: 'string' },
          itemsPrice: { type: 'number' },
          shippingPrice: { type: 'number' },
          taxPrice: { type: 'number' },
          totalPrice: { type: 'number' },
          isPaid: { type: 'boolean' },
          paidAt: { type: 'string', format: 'date-time', nullable: true },
          isDelivered: { type: 'boolean' },
          deliveredAt: { type: 'string', format: 'date-time', nullable: true },
          status: {
            type: 'string',
            enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled']
          },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' }
        }
      },
      UpdateOrderStatusRequest: {
        type: 'object',
        required: ['status'],
        properties: {
          status: {
            type: 'string',
            enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled']
          }
        }
      },
      ErrorResponse: {
        type: 'object',
        properties: {
          message: { type: 'string', example: 'Not authorized, no token' }
        }
      }
    }
  },
  tags: [
    { name: 'Auth', description: 'Registration, login, token refresh' },
    { name: 'Products', description: 'Product catalog' },
    { name: 'Cart', description: "Logged-in user's cart" },
    { name: 'Orders', description: 'Checkout and order management (unchanged, documented as-is)' }
  ]
};

const options = {
  definition,
  // Forward-slash globs are required — Windows backslashes make swagger-jsdoc
  // match zero files, so the UI loads with empty endpoint dropdowns.
  apis: [path.join(__dirname, '..', 'routes', '*.js').replace(/\\/g, '/')]
};

module.exports = swaggerJsdoc(options);
