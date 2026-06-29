// Get All Active Room Suitabilities Controller

import db from '../../../config/db.js';
import { Op } from 'sequelize';

export const getAllRoomSuitabilities = async (req, res) => {
  try {
    const { RoomSuitability } = db.models;

    // Check if requesting deleted items
    const isDeleted = req.query.deleted === 'true';

    const roomSuitabilities = await RoomSuitability.findAll({
      where: isDeleted
        ? { deletedAt: { [Op.not]: null } }
        : { deletedAt: null },
      paranoid: !isDeleted,
      order: [['createdAt', 'DESC']],
    });

    res.status(200).json({
      success: true,
      data: roomSuitabilities,
    });
  } catch (error) {
    console.error('Get room suitabilities error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch room suitabilities',
    });
  }
};
