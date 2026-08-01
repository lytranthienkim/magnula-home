import db from '../config/db.js';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const seedAdmin = async () => {
  try {
    const hashedPassword = await bcrypt.hash('admin123', 10);

    await db.query(`
      INSERT IGNORE INTO users (email, password_hash, full_name, is_active, created_at, updated_at)
      VALUES ('test@gmail.com', '${hashedPassword}', 'Test Admin', 1, NOW(), NOW())
    `);

    const user = await db.query(`SELECT id FROM users WHERE email = 'test@gmail.com'`);
    const userId = user[0][0]?.id;

    if (userId) {
      await db.query(`
        INSERT IGNORE INTO user_roles (user_id, role_id)
        VALUES (${userId}, 1)
      `);
    }
  } catch (error) {
    console.error(error.message);
  } finally {
    await db.close();
    process.exit(0);
  }
};

seedAdmin();
