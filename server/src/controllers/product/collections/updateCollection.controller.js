// Update Collection Controller

import db from '../../../config/db.js';

export const updateCollection = async (req, res) => {
  const transaction = await db.transaction();

  try {
    const { Collection, CollectionImage } = db.models;
    const { id } = req.params;
    const { collectionName, colorHex, description, images } = req.body;

    // Check if collection exists
    const collection = await Collection.findByPk(id, { transaction });

    if (!collection) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        error: 'Collection not found',
      });
    }

    // Validate color format if provided
    if (colorHex && !/^#[0-9A-F]{6}$/i.test(colorHex)) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        error: 'Invalid color format.',
      });
    }

    // Check if new collection name already exists (if changing - only active collections)
    if (collectionName && collectionName !== collection.collectionName) {
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
    }

    // Update collection
    await collection.update(
      {
        collectionName: collectionName || collection.collectionName,
        colorHex: colorHex || collection.colorHex,
        description: description !== undefined ? description : collection.description,
      },
      { transaction }
    );

    if (images && Array.isArray(images)) {
      // Xoa 1 image
      await CollectionImage.destroy({
        where: { collectionId: id },
        transaction,
      });

      // Create new images if array is not empty
      if (images.length > 0) {
        const imageData = images.map((image) => ({
          collectionId: id,
          imageUrl: image.imageUrl,
        }));

        await CollectionImage.bulkCreate(imageData, { transaction });
      }
    }

    // Fetch updated collection with images
    const updatedCollection = await Collection.findByPk(id, {
      include: [
        {
          association: 'images',
          attributes: ['id', 'imageUrl'],
        },
      ],
      transaction,
    });

    await transaction.commit();

    res.status(200).json({
      success: true,
      data: updatedCollection,
      message: 'Collection updated successfully',
    });
  } catch (error) {
    await transaction.rollback();
    console.error('Update collection error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to update collection',
    });
  }
};
