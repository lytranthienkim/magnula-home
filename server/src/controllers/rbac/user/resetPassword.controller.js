import bcrypt from 'bcryptjs';
import db from '../../../config/db.js';

export const resetPassword = async (req, res) => {
  try {
    const { User } = db.models;
    const userId = req.params.id;
    const { newPassword } = req.body;

    if (!newPassword) {
      return res.status(400).json({
        success: false,
        error: 'New password is required',
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        error: 'New password must be at least 6 characters',
      });
    }

    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);

    await user.update({ passwordHash });

    res.json({
      success: true,
      message: `Password reset successfully for ${user.email}`,
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to reset password',
    });
  }
};
