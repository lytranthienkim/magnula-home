import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import routes from './src/routes/index.js';
import db from './src/config/db.js';
import { initializeModels } from './src/config/models.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize models and associations
initializeModels();

// Initialize database
const initializeDatabase = async () => {
  try {
    await db.authenticate();
    await db.sync({ alter: false });
  } catch (error) {
    console.error('Database error:', error.message);
    throw error;
  }
};

// Middleware
app.use(cors({
  origin: function(origin, callback) {
    const allowedOrigins = [
      'http://localhost:3000',  // Client
      'http://localhost:3002',  // Admin
      process.env.CLIENT_URL,
    ].filter(Boolean);

    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); 

// Routes
app.use('/api', routes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
  });
});

// Error handler
app.use((err, req, res) => {
  console.error(err);
  res.status(err.statusCode || 500).json({
    success: false,
    error: err.message || 'Server error',
  });
});

// Start server
const startServer = async () => {
  try {
    await initializeDatabase();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Server error:', error.message);
    process.exit(1);
  }
};

startServer();

export default app;
