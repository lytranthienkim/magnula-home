import db from '../../../config/db.js';

export const restoreUser = async (req, res) => {
  try {
    const user = await db.models.User.findByPk(req.params.id);

    if (!user)
      return res.status(404).json({ success: false, error: 'User not found' });

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
    res.status(500).json({ success: false, error: error.message });
  }
};
