// Delete Permission Controller (Soft Delete)

import db from '../../../config/db.js';

export const deletePermission = async (req, res) => {
  try {
    const { Permission, RolePermission } = db.models;
    const { id } = req.params;

    // Get permission
    const permission = await Permission.findByPk(id);
    if (!permission) {
      return res.status(404).json({
        success: false,
        error: 'Permission not found',
      });
    }

    // Check if any role has this permission
    const rolesWithPermission = await RolePermission.findOne({
      where: { permissionId: id },
    });

    if (rolesWithPermission) {
      return res.status(403).json({
        success: false,
        error: `Cannot delete permission "${permission.permissionKey}" because there are roles assigned to this permission. Remove all roles from this permission first.`,
      });
    }

    // Soft delete using Sequelize's destroy method
    await permission.destroy();

    // Verify deletion was successful by checking with paranoid: false
    const deletedPermission = await Permission.findByPk(id, { paranoid: false });
    if (!deletedPermission || !deletedPermission.deletedAt) {
      return res.status(500).json({
        success: false,
        error: 'Failed to delete permission - verification failed',
      });
    }

    res.json({
      success: true,
      data: {
        permissionId: permission.id,
        permissionKey: permission.permissionKey,
      },
      message: `Permission "${permission.permissionKey}" deleted successfully`,
    });
  } catch (error) {
    console.error('Delete permission error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
