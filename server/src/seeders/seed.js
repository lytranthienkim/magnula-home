import db from '../config/db.js';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';

const seedAdmin = async () => {
  try {
    const hashedPassword = await bcrypt.hash('admin123', 10);

    const existingAdmin = await User.findOne({
      where: { email: 'test@gmail.com' },
    });

    if (existingAdmin) {
      existingAdmin.password_hash = hashedPassword;
      existingAdmin.is_active = true;
      await existingAdmin.save();

    } else {
      await User.create({
        email: 'test@gmail.com',
        password_hash: hashedPassword,
        full_name: 'Test Admin',
        is_active: true,
      });
    }
  } catch (error) {
  } finally {
    if (typeof db.close === 'function') {
      await db.close();
    } else if (db.sequelize && typeof db.sequelize.close === 'function') {
      await db.sequelize.close();
    }
    process.exit(0);
  }
};

seedAdmin();
