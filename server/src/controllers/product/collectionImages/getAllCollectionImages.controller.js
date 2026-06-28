// Get All Collection Images Controller

import db from '../../../config/db.js';

export const getAllCollectionImages = async (req, res) => {
  try {
    const { CollectionImage, Collection } = db.models;

    const images = await CollectionImage.findAll({
      include: [
        {
          model: Collection,
          attributes: ['id', 'collectionName'],
        },
      ],
      order: [['createdAt', 'ASC']],
    });

    res.json({
      success: true,
      data: images,
      total: images.length,
    });
  } catch (error) {
    console.error('Get all collection images error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
