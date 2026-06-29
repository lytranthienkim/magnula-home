// Get All Roles Controller

import db from '../../../config/db.js';
import { Op } from 'sequelize';

export const getAllRoles = async (req, res) => {
  try {
    const { Role } = db.models;
    const isDeleted = req.query.deleted === 'true';

    const roles = await Role.findAll({
      where: isDeleted ? { deletedAt: { [Op.not]: null } } : { deletedAt: null },
      paranoid: !isDeleted,
      attributes: ['id', 'roleName', 'createdAt', ...(isDeleted ? ['deletedAt'] : [])],
    });

    res.json({ success: true, data: roles });
  } catch (error) {
    console.error('Get all roles error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};
