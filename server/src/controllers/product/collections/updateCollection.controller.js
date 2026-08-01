import db from '../../../config/db.js';
import { invalidateCollectionCache } from '../../../middleware/cache/cacheInvalidation.js';

export const updateCollection = async (req, res) => {
  const transaction = await db.transaction();

  try {
    const { Collection, CollectionImage } = db.models;
    const { id } = req.params;
    const { collectionName, colorHex, description, images } = req.body;

    const collection = await Collection.findByPk(id, { transaction });

    if (!collection) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        error: 'Collection not found',
      });
    }

    if (colorHex && !/^#[0-9A-F]{6}$/i.test(colorHex)) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        error: 'Invalid color format.',
      });
    }

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

    await collection.update(
      {
        collectionName: collectionName || collection.collectionName,
        colorHex: colorHex || collection.colorHex,
        description: description !== undefined ? description : collection.description,
      },
      { transaction }
    );

    if (images && Array.isArray(images)) {
      await CollectionImage.destroy({
        where: { collectionId: id },
        transaction,
      });

      if (images.length > 0) {
        const imageData = images.map((image) => ({
          collectionId: id,
          imageUrl: image.imageUrl,
        }));

        await CollectionImage.bulkCreate(imageData, { transaction });
      }
    }

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

    await invalidateCollectionCache();

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
