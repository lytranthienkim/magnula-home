import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import routes from './routes/index.js';
import uploadRoute from './routes/upload.route.js';
import { corsConfig } from './config/cors.js';

export const createApp = () => {
  const app = express();

  app.use(cors(corsConfig));

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  app.use('/api', uploadRoute);
  app.use('/api', routes);

  app.use((req, res) => {
    res.status(404).json({
      success: false,
      error: 'Route not found',
    });
  });

  app.use((err, req, res, next) => {
    console.error('Error:', err);

    const statusCode = err.statusCode || err.status || 500;
    const message = err.message || 'Internal Server Error';

    res.status(statusCode).json({
      success: false,
      error: message,
    });
  });

  return app;
};

export default createApp;
