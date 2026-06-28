// Update Collection Status Controller - Activate/Deactivate only

import db from '../../../config/db.js';

export const updateCollectionStatus = async (req, res) => {
  try {
    const { Collection } = db.models;
    const { id } = req.params;
    const { isActive } = req.body;

    if (isActive === undefined || typeof isActive !== 'boolean') {
      return res.status(400).json({
        success: false,
        error: 'isActive (boolean) is required',
      });
    }

    const collection = await Collection.findByPk(id);
    if (!collection) {
      return res.status(404).json({
        success: false,
        error: 'Collection not found',
      });
    }

    if (collection.isActive === isActive) {
      return res.status(400).json({
        success: false,
        error: `Collection is already ${isActive ? 'activated' : 'deactivated'}`,
      });
    }

    await collection.update({ isActive });

    res.json({
      success: true,
      data: {
        collectionId: collection.id,
        collectionName: collection.collectionName,
        isActive: collection.isActive,
      },
      message: `Collection "${collection.collectionName}" ${isActive ? 'activated' : 'deactivated'} successfully`,
    });
  } catch (error) {
    console.error('Update collection status error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
