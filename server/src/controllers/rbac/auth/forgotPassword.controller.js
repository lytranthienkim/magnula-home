
import bcrypt from 'bcryptjs';
import db from '../../../config/db.js';
import { isValidEmail } from '../../../utils/validation.js';

export const forgotPassword = async (req, res) => {
  try {
    const { User } = db.models;
    const { email, newPassword } = req.body;

    // Validate input
    if (!email || !newPassword) {
      return res.status(400).json({
        success: false,
        error: 'Email and new password are required',
      });
    }

    // Validate email format
    if (!isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid email format',
      });
    }

    // Validate password strength
    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        error: 'Password must be at least 6 characters',
      });
    }

    // Find user by email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'Email not found in system',
      });
    }

    // Hash new password
    const passwordHash = await bcrypt.hash(newPassword, 10);

    // Update password
    await user.update({ passwordHash });

    res.json({
      success: true,
      message: 'Password reset successfully.',
      data: {
        email: user.email,
        userId: user.id,
      },
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      error: 'Password reset failed',
    });
  }
};
