// Get All Active Fabric Types Controller

import db from '../../../config/db.js';
import { Op } from 'sequelize';

export const getAllFabricTypes = async (req, res) => {
  try {
    const { FabricType } = db.models;

    // Check if requesting deleted items
    const isDeleted = req.query.deleted === 'true';

    const fabricTypes = await FabricType.findAll({
      where: isDeleted
        ? { deletedAt: { [Op.not]: null } }
        : { deletedAt: null },
      paranoid: !isDeleted,
      order: [['createdAt', 'DESC']],
    });

    res.status(200).json({
      success: true,
      data: fabricTypes,
    });
  } catch (error) {
    console.error('Get fabric types error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch fabric types',
    });
  }
};
