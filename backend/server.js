const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./src/config/db');
const authRoutes = require('./src/routes/authRoutes');
const productRoutes = require('./src/routes/productRoutes');
const cartRoutes = require('./src/routes/cartRoutes');
const orderRoutes = require('./src/routes/orderRoutes');
const { notFound, errorHandler } = require('./src/middleware/errorMiddleware');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(express.json());

// Health check
app.get('/', (req, res) => {
    res.send('Server is running');
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);

// Error handling (must be registered last)
app.use(notFound);
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
