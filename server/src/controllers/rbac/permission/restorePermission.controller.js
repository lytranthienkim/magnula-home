import db from '../../../config/db.js';

export const restorePermission = async (req, res) => {
  try {
    const permission = await db.models.Permission.findByPk(req.params.id, { paranoid: false });

    if (!permission)
      return res.status(404).json({ success: false, error: 'Permission not found' });

    if (!permission.deletedAt)
      return res.status(400).json({ success: false, error: 'Permission is not deleted' });

    await permission.restore();

    res.json({
      success: true,
      data: { permissionId: permission.id, permissionKey: permission.permissionKey },
      message: `Permission "${permission.permissionKey}" restored successfully`,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
