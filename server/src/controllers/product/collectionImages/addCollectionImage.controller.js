// Add Collection Image Controller

import db from '../../../config/db.js';

export const addCollectionImage = async (req, res) => {
  try {
    const { CollectionImage, Collection } = db.models;
    const { collectionId } = req.params;
    const { imageUrl } = req.body;

    // Validate required fields
    if (!imageUrl) {
      return res.status(400).json({
        success: false,
        error: 'imageUrl is required',
      });
    }

    // Verify collection exists
    const collection = await Collection.findByPk(collectionId);
    if (!collection) {
      return res.status(404).json({
        success: false,
        error: 'Collection not found',
      });
    }

    // Create collection image
    const collectionImage = await CollectionImage.create({
      collectionId,
      imageUrl,
    });

    res.status(201).json({
      success: true,
      data: collectionImage,
      message: 'Collection image added successfully',
    });
  } catch (error) {
    console.error('Add collection image error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
