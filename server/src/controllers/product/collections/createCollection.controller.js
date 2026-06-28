// Create Collection Controller - Create collection with images using transaction

import db from '../../../config/db.js';

export const createCollection = async (req, res) => {
  const transaction = await db.transaction();

  try {
    const { Collection, CollectionImage } = db.models;
    const { collectionName, colorHex, description, images } = req.body;

    // Validate input
    if (!collectionName || !colorHex) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        error: 'Collection name and color hex are required',
      });
    }

    // Validate color format
    if (!/^#[0-9A-F]{6}$/i.test(colorHex)) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        error: 'Invalid color format. Use #RRGGBB',
      });
    }

    // Check if collection name already exists
    const existingCollection = await Collection.findOne({
      where: { collectionName, deletedAt: null },
      transaction,
    });

    if (existingCollection) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        error: 'Collection name already exists',
      });
    }

    // Create collection
    const collection = await Collection.create(
      {
        collectionName,
        colorHex,
        description: description || null,
      },
      { transaction }
    );

    // Create collection images if provided
    if (Array.isArray(images) && images.length > 0) {
      await CollectionImage.bulkCreate(
        images.map((img) => ({
          collectionId: collection.id,
          imageUrl: typeof img === 'string' ? img : img.imageUrl,
        })),
        { transaction }
      );
    }

    // Fetch created collection with images
    const createdCollection = await Collection.findByPk(collection.id, {
      include: [
        {
          association: 'images',
          attributes: ['id', 'imageUrl'],
        },
      ],
      transaction,
    });

    await transaction.commit();

    res.status(201).json({
      success: true,
      data: createdCollection,
      message: 'Collection created successfully',
    });
  } catch (error) {
    await transaction.rollback();
    console.error('Create collection error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create collection',
      details: error.message,
    });
  }
};
