import db from '../../../config/db.js';

export const restoreRole = async (req, res) => {
  try {
    const role = await db.models.Role.findByPk(req.params.id, { paranoid: false });

    if (!role)
      return res.status(404).json({ success: false, error: 'Role not found' });

    if (!role.deletedAt)
      return res.status(400).json({ success: false, error: 'Role is not deleted' });

    await role.restore();

    res.json({
      success: true,
      data: { roleId: role.id, roleName: role.roleName },
      message: `Role "${role.roleName}" restored successfully`,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
