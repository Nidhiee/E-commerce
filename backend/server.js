const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const swaggerUi = require('swagger-ui-express');
require('dotenv').config();

const connectDB = require('./src/config/db');
const seedAdmin = require('./src/config/seedAdmin');
const swaggerSpec = require('./src/config/swagger');
const requestLogger = require('./src/middleware/requestLogger');
const authRoutes = require('./src/routes/authRoutes');
const productRoutes = require('./src/routes/productRoutes');
const cartRoutes = require('./src/routes/cartRoutes');
const orderRoutes = require('./src/routes/orderRoutes');
const { notFound, errorHandler } = require('./src/middleware/errorMiddleware');

const app = express();

async function start() {
  // Connect to MongoDB, then make sure the admin account from .env exists
  await connectDB();
  await seedAdmin();

  // Middleware
  app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
  app.use(express.json());
  app.use(cookieParser());
  app.use(requestLogger);

  // Health check
  app.get('/', (req, res) => {
    res.send('Server is running');
  });

  // Interactive API docs: UI at /api-docs, raw OpenAPI JSON at /api-docs.json
  app.get('/api-docs.json', (req, res) => res.json(swaggerSpec));
  app.use(
    '/api-docs',
    ...swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
      explorer: true,
      customSiteTitle: 'Nidhie API Docs'
    })
  );

  // Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/products', productRoutes);
  app.use('/api/cart', cartRoutes);
  app.use('/api/orders', orderRoutes);

  // Error handling (must be registered last)
  app.use(notFound);
  app.use(errorHandler);

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

start();
