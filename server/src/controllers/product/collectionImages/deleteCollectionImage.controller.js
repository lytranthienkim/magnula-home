import db from '../../../config/db.js';

export const deleteCollectionImage = async (req, res) => {
  try {
    const { CollectionImage } = db.models;
    const { imageId } = req.params;

    const collectionImage = await CollectionImage.findByPk(imageId);
    if (!collectionImage) {
      return res.status(404).json({
        success: false,
        error: 'Collection image not found',
      });
    }

    await collectionImage.destroy();

    res.json({
      success: true,
      message: 'Collection image deleted successfully',
    });
  } catch (error) {
    console.error('Delete collection image error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
