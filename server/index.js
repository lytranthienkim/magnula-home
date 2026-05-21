import dotenv from 'dotenv';

// Load environment variables FIRST before importing other modules
dotenv.config();

import express from 'express';
import cors from 'cors';

// Import Routes
import checkoutRoutes from './src/routes/checkoutRoutes.js';
import productRoutes from './src/routes/productRoutes.js';
import collectionRoutes from './src/routes/collectionRoutes.js';
import orderRoutes from './src/routes/orderRoutes.js';
import customerRoutes from './src/routes/customerRoutes.js';

// Import Middleware
import errorHandler from './src/middleware/errorHandler.js';

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Routes
app.use('/api', checkoutRoutes);
app.use('/api', productRoutes);
app.use('/api', collectionRoutes);
app.use('/api', orderRoutes);
app.use('/api', customerRoutes);

// Health check
app.get('/health', async (req, res) => {
  res.status(200).json({ success: true, message: 'Server is running' });
});

// Database health check
app.get('/api/health/db', async (req, res) => {
  try {
    const result = await (await import('./src/services/dbService.js')).dbService.testConnection();
    return res.status(result.success ? 200 : 500).json(result);
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Database connection failed: ' + error.message
    });
  }
});

// 404 Not Found
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
  });
});

// Global Error Handler
app.use(errorHandler);

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Available at http://localhost:${PORT}`);
});
