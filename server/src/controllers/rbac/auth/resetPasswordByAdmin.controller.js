// Reset Password By Admin Controller - Admin override staff password without verification

import bcrypt from 'bcryptjs';
import db from '../../../config/db.js';

export const resetPasswordByAdmin = async (req, res) => {
  try {
    const { User } = db.models;
    const { userId, newPassword } = req.body;
    const adminId = req.user.userId; // From JWT token

    // Validate input
    if (!userId || !newPassword) {
      return res.status(400).json({
        success: false,
        error: 'User ID and new password are required',
      });
    }

    // Validate password strength
    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        error: 'Password must be at least 6 characters',
      });
    }

    // Get target user
    const targetUser = await User.findByPk(userId);
    if (!targetUser) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    // Prevent admin from resetting their own password via this endpoint
    // (admins should use changePassword which requires old password)
    if (adminId === userId) {
      return res.status(400).json({
        success: false,
        error: 'Use change-password endpoint to update your own password',
      });
    }

    // Hash new password
    const passwordHash = await bcrypt.hash(newPassword, 10);

    // Update password
    await targetUser.update({ passwordHash });

    res.json({
      success: true,
      message: 'Password reset successfully for user',
      data: {
        userId: targetUser.id,
        email: targetUser.email,
        fullName: targetUser.fullName,
      },
    });
  } catch (error) {
    console.error('Reset password by admin error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to reset password',
    });
  }
};
