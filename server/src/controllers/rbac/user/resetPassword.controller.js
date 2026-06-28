// Reset Password Controller - Authorized user resets password for another user
//
// SECURITY:
// - Requires verifyToken + checkPermission('users:update_password') middleware
// - Cannot reset your own password here (use /auth/change-password during session)
// - Caller must have users:update_password permission
//
// SCENARIO:
// - User forgot password and cannot log in
// - Authorized admin/staff with users:update_password permission resets it
// - New temporary password is generated
// - User logs in with new password
// - User can change password after logging in (if needed)
//
// FLOW:
// 1. Validate new password strength
// 2. Get target user
// 3. Hash and update password
// 4. Return confirmation

import bcrypt from 'bcryptjs';
import db from '../../../config/db.js';

export const resetPassword = async (req, res) => {
  try {
    const { User } = db.models;
    const callerUserId = req.user.userId;
    const targetUserId = req.params.id;
    const { newPassword } = req.body;

    // Validate input
    if (!newPassword) {
      return res.status(400).json({
        success: false,
        error: 'New password is required',
      });
    }

    // Validate password strength
    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        error: 'New password must be at least 6 characters',
      });
    }

    // Prevent resetting own password (use /auth/change-password instead)
    if (callerUserId === parseInt(targetUserId)) {
      return res.status(400).json({
        success: false,
        error: 'Cannot reset your own password here. Use /auth/change-password instead.',
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

    // Hash new password
    const passwordHash = await bcrypt.hash(newPassword, 10);

    // Update password
    await user.update({ passwordHash });

    res.json({
      success: true,
      message: `Password reset successfully for ${user.email}`,
      data: {
        targetUserEmail: user.email,
        targetUserId: user.id
      },
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to reset password',
    });
  }
};
