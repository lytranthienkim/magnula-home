import db from '../../../config/db.js';
import { invalidateCollectionCache } from '../../../middleware/cache/cacheInvalidation.js';

export const deleteCollection = async (req, res) => {
  try {
    const { Collection, Product } = db.models;
    const { id } = req.params;

    const collection = await Collection.findByPk(id);
    if (!collection) {
      return res.status(404).json({
        success: false,
        error: 'Collection not found',
      });
    }

    const productCount = await Product.count({
      where: { collectionId: id, deletedAt: null },
    });

    if (productCount > 0) {
      return res.status(403).json({
        success: false,
        error: `Cannot delete collection "${collection.collectionName}" because there are ${productCount} products using it`,
      });
    }

    await collection.destroy();

    const deletedCollection = await Collection.findByPk(id, { paranoid: false });
    if (!deletedCollection || !deletedCollection.deletedAt) {
      return res.status(500).json({
        success: false,
        error: 'Failed to delete collection - verification failed',
      });
    }

    await invalidateCollectionCache();

    res.status(200).json({
      success: true,
      message: 'Collection deleted successfully',
    });
  } catch (error) {
    console.error('Delete collection error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete collection',
    });
  }
};
