// Bootstrap Admin Controller - Create first admin account
//
// SECURITY:
// - Only works if NO admin exists in system
// - Automatically creates admin role + permissions if needed
// - After first admin created, this endpoint becomes unavailable
// - Must be disabled/removed in production after setup

import bcrypt from 'bcryptjs';
import db from '../../../config/db.js';
import { getAllPermissionKeys } from '../../../constants/permissions.js';

export const bootstrapAdmin = async (req, res) => {
  try {
    // Check database connection
    if (!db.models || !db.models.User) {
      return res.status(503).json({
        success: false,
        error: 'Database connection failed',
        note: 'Please ensure MySQL is running and database is connected',
      });
    }

    const { User, UserRole, Role, Permission, RolePermission } = db.models;
    const { email, password, fullName } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email and password are required',
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid email format',
      });
    }

    // Validate password strength
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        error: 'Password must be at least 6 characters',
      });
    }

    // ========== SECURITY CHECK ==========
    // Check if any admin already exists - if yes, deny bootstrap
    const existingAdmin = await UserRole.findOne({
      include: [{
        model: Role,
        where: { roleName: 'admin' },
      }],
    });

    if (existingAdmin) {
      return res.status(403).json({
        success: false,
        error: 'Admin account already exists. Bootstrap is no longer available.',
        note: 'Use /api/users endpoint with admin permissions to create new accounts',
      });
    }

    // Check email not already used
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'Email already registered',
      });
    }

    // ========== CREATE/GET ADMIN ROLE ==========
    let adminRole = await Role.findOne({ where: { roleName: 'admin' } });
    if (!adminRole) {
      adminRole = await Role.create({ roleName: 'admin' });
    }

    // ========== CREATE/GET CORE PERMISSIONS ==========
    // Use standardized permission keys from constants
    const corePermissions = getAllPermissionKeys();

    const permissions = {};
    for (const permKey of corePermissions) {
      let perm = await Permission.findOne({ where: { permissionKey: permKey } });
      if (!perm) {
        perm = await Permission.create({
          permissionKey: permKey,
          description: `Permission to ${permKey.replace(/_/g, ' ')}`,
        });
      }
      permissions[permKey] = perm.id;
    }

    // ========== ASSIGN PERMISSIONS TO ADMIN ROLE ==========
    for (const permId of Object.values(permissions)) {
      const existing = await RolePermission.findOne({
        where: { roleId: adminRole.id, permissionId: permId },
      });
      if (!existing) {
        await RolePermission.create({
          roleId: adminRole.id,
          permissionId: permId,
        });
      }
    }

    // ========== CREATE ADMIN USER ==========
    const passwordHash = await bcrypt.hash(password, 10);

    const newAdmin = await User.create({
      email,
      passwordHash,
      fullName: fullName || 'Admin',
    });

    // Assign admin role
    await UserRole.create({
      userId: newAdmin.id,
      roleId: adminRole.id,
    });

    res.status(201).json({
      success: true,
      data: {
        userId: newAdmin.id,
        email: newAdmin.email,
        fullName: newAdmin.fullName,
        role: 'admin',
        credentials: {
          email: newAdmin.email,
          password: password, // Returned ONCE for initial setup
        },
      },
      message: 'First admin account created successfully',
      note: 'Use /api/users endpoint to create additional accounts.',
    });
  } catch (error) {
    console.error('Bootstrap admin error:', error);
    console.error('Error details:', {
      message: error.message,
      name: error.name,
      stack: error.stack,
    });
    res.status(500).json({
      success: false,
      error: 'Failed to create admin account',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};
