// Update Collection Image Controller

import db from '../../../config/db.js';

export const updateCollectionImage = async (req, res) => {
  try {
    const { CollectionImage } = db.models;
    const { imageId } = req.params;
    const { imageUrl } = req.body;

    // Get collection image
    const collectionImage = await CollectionImage.findByPk(imageId);
    if (!collectionImage) {
      return res.status(404).json({
        success: false,
        error: 'Collection image not found',
      });
    }

    // Update imageUrl
    if (imageUrl) collectionImage.imageUrl = imageUrl;

    await collectionImage.save();

    res.json({
      success: true,
      data: collectionImage,
      message: 'Collection image updated successfully',
    });
  } catch (error) {
    console.error('Update collection image error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
