import dotenv from 'dotenv';
import db from './src/config/db.js';
import { initializeModels } from './src/config/models.js';
import { createApp } from './src/app.js';

dotenv.config();

const PORT = process.env.PORT || 3001;

const initializeDatabase = async () => {
  try {
    initializeModels();
    await db.authenticate();
    await db.sync({ alter: false });
  } catch (error) {
    console.error(error.message);
    throw error;
  }
};

const startServer = async () => {
  try {
    await initializeDatabase();

    const app = createApp();

    app.listen(PORT, () => {});

  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
};

startServer();
