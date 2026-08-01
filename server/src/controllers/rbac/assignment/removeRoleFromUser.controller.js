import db from '../../../config/db.js';

export const removeRoleFromUser = async (req, res) => {
  try {
    const { User, Role, UserRole } = db.models;
    const { id, roleId } = req.params;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }
    const role = await Role.findByPk(roleId);
    if (!role) {
      return res.status(404).json({
        success: false,
        error: 'Role not found',
      });
    }

    const userRole = await UserRole.findOne({
      where: { userId: id, roleId },
    });
    if (!userRole) {
      return res.status(404).json({
        success: false,
        error: 'User does not have this role',
      });
    }

    await userRole.destroy();

    res.json({
      success: true,
      message: `Role "${role.roleName}" removed from user successfully`,
    });
  } catch (error) {
    console.error('Remove role error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to remove role',
      details: error.message,
    });
  }
};
