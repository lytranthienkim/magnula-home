// Restore Permission Controller - Restore soft-deleted permission

import db from '../../../config/db.js';

export const restorePermission = async (req, res) => {
  try {
    const { Permission } = db.models;
    const { id } = req.params;

    // Find the soft-deleted permission
    const permission = await Permission.findByPk(id, { paranoid: false });
    if (!permission) {
      return res.status(404).json({
        success: false,
        error: 'Permission not found',
      });
    }

    // Check if permission is actually deleted
    if (!permission.deletedAt) {
      return res.status(400).json({
        success: false,
        error: 'Permission is not deleted',
      });
    }

    // Restore the permission
    await permission.restore();

    // Verify restoration
    const restoredPermission = await Permission.findByPk(id);
    if (!restoredPermission) {
      return res.status(500).json({
        success: false,
        error: 'Failed to restore permission - verification failed',
      });
    }

    res.json({
      success: true,
      data: {
        permissionId: restoredPermission.id,
        permissionKey: restoredPermission.permissionKey,
      },
      message: `Permission "${restoredPermission.permissionKey}" restored successfully`,
    });
  } catch (error) {
    console.error('Restore permission error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
