// Get All Active Materials Controller

import db from '../../../config/db.js';
import { Op } from 'sequelize';

export const getAllMaterials = async (req, res) => {
  try {
    const { Material } = db.models;

    // Check if requesting deleted items
    const isDeleted = req.query.deleted === 'true';

    const materials = await Material.findAll({
      where: isDeleted
        ? { deletedAt: { [Op.not]: null } }
        : { deletedAt: null },
      paranoid: !isDeleted,
      order: [['createdAt', 'DESC']],
    });

    res.status(200).json({
      success: true,
      data: materials,
    });
  } catch (error) {
    console.error('Get materials error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch materials',
    });
  }
};
