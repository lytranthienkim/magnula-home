import db from '../config/db.js';
import bcrypt from 'bcryptjs';

const seedAdmin = async () => {
  try {
    const { User, UserRole } = db.models;

    const existingAdmin = await User.findOne({
      where: { email: 'test@gmail.com' },
    });

    if (existingAdmin) {
      return;
    }

    const hashedPassword = await bcrypt.hash('admin123', 10);

    const newAdmin = await User.create({
      email: 'test@gmail.com',
      passwordHash: hashedPassword,
      fullName: 'Test',
      isActive: true,
    });

    await UserRole.create({
      userId: newAdmin.id,
      roleId: 1,
    });
  } catch (error) {
    console.error(error.message);
  } finally {
    await db.sequelize.close();
    process.exit(0);
  }
};

seedAdmin();
