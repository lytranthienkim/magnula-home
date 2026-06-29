import db from '../../../config/db.js';

export const deleteRole = async (req, res) => {
  try {
    const { Role, UserRole } = db.models;
    const { id } = req.params;

    // Get role
    const role = await Role.findByPk(id);
    if (!role) {
      return res.status(404).json({
        success: false,
        error: 'Role not found',
      });
    }

    // Check if any user has this role
    const usersWithRole = await UserRole.findOne({
      where: { roleId: id },
    });

    if (usersWithRole) {
      return res.status(403).json({
        success: false,
        error: `Cannot delete role "${role.roleName}" because there are users assigned to this role. Remove all users from this role first.`,
      });
    }

    // Soft delete using Sequelize's destroy method
    await role.destroy();

    // Verify deletion was successful by checking with paranoid: false
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
