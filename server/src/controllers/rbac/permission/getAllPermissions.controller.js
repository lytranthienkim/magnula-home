import db from '../../../config/db.js';
import { Op } from 'sequelize';

export const getAllPermissions = async (req, res) => {
  try {
    const { Permission } = db.models;

    const isDeleted = req.query.deleted === 'true';

    const permissions = await Permission.findAll({
      where: isDeleted
        ? { deletedAt: { [Op.not]: null } } 
        : { deletedAt: null }, 
      paranoid: !isDeleted, 
      attributes: isDeleted
        ? ['id', 'permissionKey', 'description', 'createdAt', 'deletedAt']
        : ['id', 'permissionKey', 'description', 'createdAt'],
    });

    const formattedPermissions = permissions.map(permission => ({
      id: permission.id,
      permissionKey: permission.permissionKey,
      description: permission.description,
      isActive: !permission.deletedAt,
      createdAt: permission.createdAt,
      ...(permission.deletedAt && { deletedAt: permission.deletedAt }),
    }));

    res.json({
      success: true,
      data: formattedPermissions,
    });
  } catch (error) {
    console.error('Get all permissions error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
