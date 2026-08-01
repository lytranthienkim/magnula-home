import db from '../../../config/db.js';

export const getAllCollectionImages = async (req, res) => {
  try {
    const { CollectionImage, Collection } = db.models;

    const limit = req.query.limit ? Math.min(parseInt(req.query.limit, 10), 100) : 10;
    const offset = req.query.offset ? Math.max(parseInt(req.query.offset, 10), 0) : 0;

    const { count, rows: images } = await CollectionImage.findAndCountAll({
      include: [
        {
          model: Collection,
          attributes: ['id', 'collectionName'],
        },
      ],
      order: [['createdAt', 'ASC']],
      limit,
      offset,
    });

    res.json({
      success: true,
      data: images,
      total: count,
    });
  } catch (error) {
    console.error('Get all collection images error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
