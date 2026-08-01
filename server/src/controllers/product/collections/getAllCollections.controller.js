import db from '../../../config/db.js';
import { Op } from 'sequelize';

export const getAllCollections = async (req, res) => {
  try {
    const { Collection } = db.models;

    const limit = req.query.limit ? Math.min(parseInt(req.query.limit, 10), 100) : 10;
    const offset = req.query.offset ? Math.max(parseInt(req.query.offset, 10), 0) : 0;

    const isDeleted = req.query.deleted === 'true';

    const { count, rows: collections } = await Collection.findAndCountAll({
      where: isDeleted
        ? { deletedAt: { [Op.not]: null } }
        : { deletedAt: null },
      paranoid: !isDeleted,
      include: [
        {
          association: 'images',
          attributes: ['id', 'imageUrl'],
        },
      ],
      order: [['createdAt', 'DESC']],
      limit,
      offset,
    });

    res.status(200).json({
      success: true,
      data: collections,
      total: count,
    });
  } catch (error) {
    console.error('Get collections error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch collections',
    });
  }
};
