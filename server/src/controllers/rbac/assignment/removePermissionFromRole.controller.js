import db from '../../../config/db.js';

export const removePermissionFromRole = async (req, res) => {
  try {
    const { Role, Permission, RolePermission } = db.models;
    const { id, permissionId } = req.params;

    const role = await Role.findByPk(id);
    if (!role) {
      return res.status(404).json({
        success: false,
        error: 'Role not found',
      });
    }

    const permission = await Permission.findByPk(permissionId);
    if (!permission) {
      return res.status(404).json({
        success: false,
        error: 'Permission not found',
      });
    }

    const rolePermission = await RolePermission.findOne({
      where: { roleId: id, permissionId },
    });
    if (!rolePermission) {
      return res.status(404).json({
        success: false,
        error: 'Role does not have this permission',
      });
    }

    await rolePermission.destroy();

    res.json({
      success: true,
      message: `Permission "${permission.permissionKey}" removed from role successfully`,
    });
  } catch (error) {
    console.error('Remove permission error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to remove permission',
      details: error.message,
    });
  }
};
