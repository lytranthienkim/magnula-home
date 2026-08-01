import db from '../../../config/db.js';

export const deleteRole = async (req, res) => {
  try {
    const { Role, UserRole } = db.models;
    const { id } = req.params;

    const role = await Role.findByPk(id);
    if (!role) {
      return res.status(404).json({
        success: false,
        error: 'Role not found',
      });
    }

    const usersWithRole = await UserRole.findOne({
      where: { roleId: id },
    });

    if (usersWithRole) {
      return res.status(403).json({
        success: false,
        error: `Cannot delete role "${role.roleName}" because there are users assigned to this role. Remove all users from this role first.`,
      });
    }

    await role.destroy();

    const deletedRole = await Role.findByPk(id, { paranoid: false });
    if (!deletedRole || !deletedRole.deletedAt) {
      return res.status(500).json({
        success: false,
        error: 'Failed to delete role - verification failed',
      });
    }

    res.json({
      success: true,
      data: {
        roleId: role.id,
        roleName: role.roleName,
      },
      message: `Role "${role.roleName}" deleted successfully`,
    });
  } catch (error) {
    console.error('Delete role error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
