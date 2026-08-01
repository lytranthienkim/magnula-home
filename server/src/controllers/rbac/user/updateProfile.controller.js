import db from '../../../config/db.js';
import { isValidEmail, checkEmailUniqueness } from '../../../utils/validation.js';

export const updateProfile = async (req, res) => {
  try {
    const { User } = db.models;
    const currentUserId = req.user.userId;
    const targetUserId = req.params.id || currentUserId;
    const { fullName, email } = req.body;

    if (!fullName && !email) {
      return res.status(400).json({
        success: false,
        error: 'At least one field is required',
      });
    }

    const user = await User.findByPk(targetUserId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    if (email) {
      if (!isValidEmail(email)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid email format',
        });
      }

      const existingUser = await checkEmailUniqueness(User, email, targetUserId);
      if (existingUser) {
        return res.status(400).json({
          success: false,
          error: 'Email already in use',
        });
      }
    }

    const updateData = {};
    if (fullName) updateData.fullName = fullName;
    if (email) updateData.email = email;

    await user.update(updateData);

    res.json({
      success: true,
      data: {
        userId: user.id,
        fullName: user.fullName,
        email: user.email,
      },
      message: 'Profile updated successfully',
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update profile',
    });
  }
};
