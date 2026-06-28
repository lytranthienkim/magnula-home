// Update User Status Controller - Activate/Deactivate only

import db from '../../../config/db.js';

export const updateUserStatus = async (req, res) => {
  try {
    const { User } = db.models;
    const { id } = req.params;
    const { isActive } = req.body;

    if (isActive === undefined || typeof isActive !== 'boolean') {
      return res.status(400).json({
        success: false,
        error: 'isActive (boolean) is required',
      });
    }

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    if (user.isActive === isActive) {
      return res.status(400).json({
        success: false,
        error: `User is already ${isActive ? 'activated' : 'deactivated'}`,
      });
    }

    await user.update({ isActive });

    res.json({
      success: true,
      data: {
        userId: user.id,
        email: user.email,
        fullName: user.fullName,
        isActive: user.isActive,
      },
      message: `User "${user.fullName}" ${isActive ? 'activated' : 'deactivated'} successfully`,
    });
  } catch (error) {
    console.error('Update user status error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
