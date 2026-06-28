// Restore Role Controller - Restore soft-deleted role

import db from '../../../config/db.js';

export const restoreRole = async (req, res) => {
  try {
    const { Role } = db.models;
    const { id } = req.params;

    // Find the soft-deleted role
    const role = await Role.findByPk(id, { paranoid: false });
    if (!role) {
      return res.status(404).json({
        success: false,
        error: 'Role not found',
      });
    }

    // Check if role is actually deleted
    if (!role.deletedAt) {
      return res.status(400).json({
        success: false,
        error: 'Role is not deleted',
      });
    }

    // Restore the role
    await role.restore();

    // Verify restoration
    const restoredRole = await Role.findByPk(id);
    if (!restoredRole) {
      return res.status(500).json({
        success: false,
        error: 'Failed to restore role - verification failed',
      });
    }

    res.json({
      success: true,
      data: {
        roleId: restoredRole.id,
        roleName: restoredRole.roleName,
      },
      message: `Role "${restoredRole.roleName}" restored successfully`,
    });
  } catch (error) {
    console.error('Restore role error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
