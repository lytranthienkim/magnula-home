// Update Profile Controller - User/Admin update profile
//
// DUAL PURPOSE:
// 1. User update own profile: PUT /api/profile
//    - Update: fullName, email
//    - Cannot update: password, role
//
// 2. Admin update any user: PUT /api/profile/:id
//    - Update: fullName, email, roleId
//    - Cannot update: password (use /users/:id/reset-password)
//    - Protected: isAdmin middleware
//
// FLOW:
// 1. Determine target: self or other user (if :id param + isAdmin)
// 2. Validate input (fullName, email, roleId for admin)
// 3. Check email uniqueness
// 4. Update fields
// 5. If roleId provided (admin only) → update role
// 6. Return updated profile

import db from '../../../config/db.js';
import { isValidEmail, checkEmailUniqueness } from '../../../utils/validation.js';

export const updateProfile = async (req, res) => {
  try {
    const { User, UserRole, Role } = db.models;
    const currentUserId = req.user.userId;
    const targetUserId = req.params.id || currentUserId;
    const { fullName, email, roleId } = req.body;

    // If :id param exists → admin is updating another user (middleware isAdmin already verified)
    // If no :id param → user updating own profile
    const isUpdatingOther = !!req.params.id;

    // Validate input - at least one field required
    if (!fullName && !email && !roleId) {
      return res.status(400).json({
        success: false,
        error: 'At least one field is required (fullName, email, or roleId)',
      });
    }

    // Get target user
    const user = await User.findByPk(targetUserId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    // Validate email format if provided
    if (email) {
      if (!isValidEmail(email)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid email format',
        });
      }

      // Check email uniqueness
      const existingUser = await checkEmailUniqueness(User, email, targetUserId);
      if (existingUser) {
        return res.status(400).json({
          success: false,
          error: 'Email already in use',
        });
      }
    }

    // Update basic fields
    const updateData = {};
    if (fullName) updateData.fullName = fullName;
    if (email) updateData.email = email;

    await user.update(updateData);

    // Update role (admin only)
    let assignedRole = null;
    if (roleId && isUpdatingOther) {
      assignedRole = await Role.findByPk(roleId);
      if (!assignedRole) {
        return res.status(404).json({
          success: false,
          error: 'Specified role not found',
        });
      }

      // Remove existing roles and assign new one
      await UserRole.destroy({ where: { userId: targetUserId } });
      await UserRole.create({
        userId: targetUserId,
        roleId: assignedRole.id,
      });
    }

    // Build response
    const responseData = {
      userId: user.id,
      fullName: user.fullName,
      email: user.email,
    };

    if (assignedRole) {
      responseData.roleName = assignedRole.roleName;
    }

    res.json({
      success: true,
      data: responseData,
      message: isUpdatingOther
        ? `User ${user.email} updated successfully${assignedRole ? ` with role: ${assignedRole.roleName}` : ''}`
        : 'Profile updated successfully',
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update profile',
    });
  }
};
