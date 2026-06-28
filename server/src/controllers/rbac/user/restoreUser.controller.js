// Restore User Controller - Reactivate an inactive user

import db from '../../../config/db.js';

export const restoreUser = async (req, res) => {
  try {
    const { User } = db.models;
    const { id } = req.params;

    // Find user (including inactive)
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    // Reactivate user
    await user.update({ isActive: true });

    res.json({
      success: true,
      message: 'User restored successfully',
      data: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        isActive: user.isActive,
      },
    });
  } catch (error) {
    console.error('Restore user error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to restore user',
      details: error.message,
    });
  }
};
