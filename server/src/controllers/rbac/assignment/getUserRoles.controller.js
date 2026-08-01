import db from '../../../config/db.js';

export const getUserRoles = async (req, res) => {
  try {
    const { User, Role, UserRole } = db.models;
    const { id } = req.params;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    const userRoles = await UserRole.findAll({
      where: { userId: id },
      include: [
        {
          model: Role,
          attributes: ['id', 'roleName'],
        },
      ],
    });

    res.json({
      success: true,
      data: userRoles,
      message: `Retrieved ${userRoles.length} role(s) for user`,
    });
  } catch (error) {
    console.error('Get user roles error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch user roles',
      details: error.message,
    });
  }
};
