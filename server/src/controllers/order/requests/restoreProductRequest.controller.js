// Restore Product Request Controller - Restore soft-deleted product request

import db from '../../../config/db.js';

export const restoreProductRequest = async (req, res) => {
  try {
    const { ProductRequest } = db.models;
    const { id } = req.params;

    // Find the soft-deleted request
    const request = await ProductRequest.findByPk(id, { paranoid: false });
    if (!request) {
      return res.status(404).json({
        success: false,
        error: 'Product request not found',
      });
    }

    // Check if request is actually deleted
    if (!request.deletedAt) {
      return res.status(400).json({
        success: false,
        error: 'Product request is not deleted',
      });
    }

    // Restore the request
    await request.restore();

    // Verify restoration
    const restoredRequest = await ProductRequest.findByPk(id);
    if (!restoredRequest) {
      return res.status(500).json({
        success: false,
        error: 'Failed to restore product request - verification failed',
      });
    }

    res.json({
      success: true,
      data: {
        requestId: restoredRequest.id,
        customerName: restoredRequest.customerName,
      },
      message: 'Product request restored successfully',
    });
  } catch (error) {
    console.error('Restore request error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
