// Change Password Controller - User change their own password
//
// REQUIREMENTS:
// - Staff can ONLY change password during active login session
// - Requires verification of old password
// - Admin cannot see/know the new password
// - No logging of actual password values
// - Staff who forgets password after logout must contact admin
//
// FLOW:
// 1. Verify user is authenticated (has active session/token)
// 2. Validate old password against current hash
// 3. Hash new password
// 4. Update without logging password value
// 5. Return success without exposing password

import bcrypt from 'bcryptjs';
import db from '../../../config/db.js';

export const changePassword = async (req, res) => {
  try {
    const { User } = db.models;
    const { oldPassword, newPassword } = req.body;
    const userId = req.user.userId;

    // Validate input
    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        error: 'Old password and new password are required',
      });
    }

    // Validate new password strength (minimum 6 characters)
    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        error: 'New password must be at least 6 characters',
      });
    }

    // Prevent using same password
    if (oldPassword === newPassword) {
      return res.status(400).json({
        success: false,
        error: 'New password must be different from old password',
      });
    }

    // Get user
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    // Verify old password
    const isOldPasswordValid = await bcrypt.compare(oldPassword, user.passwordHash);
    if (!isOldPasswordValid) {
      return res.status(401).json({
        success: false,
        error: 'Current password is incorrect',
      });
    }

    // Hash new password
    const newPasswordHash = await bcrypt.hash(newPassword, 10);
    await user.update({ passwordHash: newPasswordHash });

    res.json({
      success: true,
      message: 'Password changed successfully.',
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      error: 'Password change failed',
    });
  }
};
