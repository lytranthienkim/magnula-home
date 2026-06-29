// Database Configuration - - Sequelize instance - - Connection settings

import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const db = new Sequelize(
  process.env.DB_NAME || 'magnula_db',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    pool: {
      max: 30,
      min: 4,
      acquire: 30000, //safe barrier
      idle: 10000, // clean up 10s
    },
  }
);

export default db;
