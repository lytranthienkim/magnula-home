// Restore Collection Controller - Restore soft-deleted collection

import db from '../../../config/db.js';

export const restoreCollection = async (req, res) => {
  try {
    const { Collection } = db.models;
    const { id } = req.params;

    // Find the soft-deleted collection
    const collection = await Collection.findByPk(id, { paranoid: false });
    if (!collection) {
      return res.status(404).json({
        success: false,
        error: 'Collection not found',
      });
    }

    // Check if collection is actually deleted
    if (!collection.deletedAt) {
      return res.status(400).json({
        success: false,
        error: 'Collection is not deleted',
      });
    }

    // Restore the collection
    await collection.restore();

    // Verify restoration
    const restoredCollection = await Collection.findByPk(id);
    if (!restoredCollection) {
      return res.status(500).json({
        success: false,
        error: 'Failed to restore collection - verification failed',
      });
    }

    res.json({
      success: true,
      data: {
        collectionId: restoredCollection.id,
        collectionName: restoredCollection.collectionName,
      },
      message: `Collection "${restoredCollection.collectionName}" restored successfully`,
    });
  } catch (error) {
    console.error('Restore collection error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
