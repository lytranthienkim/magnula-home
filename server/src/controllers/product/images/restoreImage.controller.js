import db from '../../../config/db.js';

export const restoreImage = async (req, res) => {
  try {
    const { ProductImage } = db.models;
    const { imageId } = req.params;

    const image = await ProductImage.findByPk(imageId, {
      paranoid: false,
    });

    if (!image) {
      return res.status(404).json({
        success: false,
        error: 'Image not found',
      });
    }

    if (!image.deletedAt) {
      return res.status(400).json({
        success: false,
        error: 'Image is not deleted',
      });
    }

    await image.restore();

    res.json({
      success: true,
      message: 'Image restored successfully',
      data: image,
    });
  } catch (error) {
    console.error('Restore image error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to restore image',
    });
  }
};
