// Create User Controller - With transaction for data integrity

import bcrypt from 'bcryptjs';
import db from '../../../config/db.js';
import { isValidEmail, checkEmailUniqueness } from '../../../utils/validation.js';

export const createUser = async (req, res) => {
  const transaction = await db.transaction();

  try {
    const { User, UserRole, Role } = db.models;
    const { email, password, fullName, roleId } = req.body;

    // Validate input
    if (!email || !password) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        error: 'Email and password are required',
      });
    }

    // Validate email format
    if (!isValidEmail(email)) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        error: 'Invalid email format',
      });
    }

    // Validate password strength
    if (password.length < 6) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        error: 'Password must be at least 6 characters',
      });
    }

    // Check email uniqueness
    const existingUser = await checkEmailUniqueness(User, email);
    if (existingUser) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        error: 'Email already registered',
      });
    }

    // Verify role exists (if roleId provided)
    let assignedRole = null;
    if (roleId) {
      assignedRole = await Role.findByPk(roleId, { transaction });
      if (!assignedRole) {
        await transaction.rollback();
        return res.status(404).json({
          success: false,
          error: 'Specified role not found',
        });
      }
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user within transaction
    const newUser = await User.create(
      {
        email,
        passwordHash,
        fullName: fullName || null,
      },
      { transaction }
    );

    // Assign role (if provided) - within same transaction
    if (assignedRole) {
      await UserRole.create(
        {
          userId: newUser.id,
          roleId: assignedRole.id,
        },
        { transaction }
      );
    }

    await transaction.commit();

    // Build response - DO NOT include plain password in response
    const responseData = {
      userId: newUser.id,
      email: newUser.email,
      fullName: newUser.fullName,
      temporaryPassword: password, // Only for display - NOT stored/logged
    };

    // Add role info if assigned
    if (assignedRole) {
      responseData.assignedRole = assignedRole.roleName;
    }

    res.status(201).json({
      success: true,
      data: responseData,
      message: assignedRole
        ? `User created successfully with role: ${assignedRole.roleName}.`
        : 'User created successfully.',
    });
  } catch (error) {
    await transaction.rollback();
    console.error('Create user error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create user',
      details: error.message,
    });
  }
};
