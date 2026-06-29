// Get Permission By ID Controller

import db from '../../../config/db.js';

export const getPermissionById = async (req, res) => {
  try {
    const { Permission } = db.models;
    const { id } = req.params;

    const permission = await Permission.findByPk(id, {
      attributes: ['id', 'permissionKey', 'description', 'createdAt', 'deletedAt'],
    });

    if (!permission) {
      return res.status(404).json({
        success: false,
        error: 'Permission not found',
      });
    }

    // Format response - add isActive based on deletedAt
    const formattedPermission = {
      id: permission.id,
      permissionKey: permission.permissionKey,
      description: permission.description,
      isActive: !permission.deletedAt,
      createdAt: permission.createdAt,
      ...(permission.deletedAt && { deletedAt: permission.deletedAt }),
    };

    res.json({
      success: true,
      data: formattedPermission,
    });
  } catch (error) {
    console.error('Get permission by ID error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
