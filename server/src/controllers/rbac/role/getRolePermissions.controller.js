import db from '../../../config/db.js';

export const getRolePermissions = async (req, res) => {
  try {
    const { Role, Permission, RolePermission } = db.models;
    const { id } = req.params;

    // Verify role exists
    const role = await Role.findByPk(id);
    if (!role) {
      return res.status(404).json({ success: false, error: 'Role not found' });
    }

    // Get all permissions
    const allPermissions = await Permission.findAll({
      attributes: ['id', 'permissionKey', 'description'],
      raw: true,
    });

    // Get permissions assigned to this role
    const assignedPermissions = await RolePermission.findAll({
      where: { roleId: id },
      attributes: ['permissionId'],
      raw: true,
    });

    const assignedPermIds = new Set(assignedPermissions.map((ap) => ap.permissionId));

    // Format all permissions with assigned flag
    const formattedPermissions = allPermissions.map((perm) => ({
      id: perm.id,
      permissionKey: perm.permissionKey,
      description: perm.description,
      assigned: assignedPermIds.has(perm.id),
    }));

    res.json({ success: true, data: formattedPermissions });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
