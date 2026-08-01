import db from '../../../config/db.js';

export const assignRoleToUser = async (req, res) => {
  try {
    const { User, Role, UserRole } = db.models;
    const { id } = req.params;
    const { roleId } = req.body;

    if (!roleId) {
      return res.status(400).json({
        success: false,
        error: 'Role ID is required',
      });
    }

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

    await UserRole.destroy({ where: { userId: id } });

    const userRole = await UserRole.create({
      userId: id,
      roleId,
    });

    res.json({
      success: true,
      data: userRole,
      message: `Role "${role.roleName}" assigned to user successfully`,
    });
  } catch (error) {
    console.error('Assign role error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to assign role',
      details: error.message,
    });
  }
};
