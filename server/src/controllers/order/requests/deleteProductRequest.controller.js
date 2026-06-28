import db from '../../../config/db.js';

export const deleteProductRequest = async (req, res) => {
  try {
    const { ProductRequest } = db.models;
    const { id } = req.params;

    const request = await ProductRequest.findByPk(id);
    if (!request) {
      return res.status(404).json({
        success: false,
        error: 'Request not found',
      });
    }

    // Soft delete - preserve lead data in archive
    await request.destroy();

    // Verify deletion was successful by checking with paranoid: false
    const deletedRequest = await ProductRequest.findByPk(id, { paranoid: false });
    if (!deletedRequest || !deletedRequest.deletedAt) {
      return res.status(500).json({
        success: false,
        error: 'Failed to delete product request - verification failed',
      });
    }

    res.json({
      success: true,
      message: 'Product request deleted successfully',
    });
  } catch (error) {
    console.error('Delete request error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete product request',
      details: error.message,
    });
  }
};
