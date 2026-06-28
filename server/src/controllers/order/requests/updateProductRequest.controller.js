import db from '../../../config/db.js';

export const updateProductRequest = async (req, res) => {
  try {
    const { ProductRequest } = db.models;
    const { id } = req.params;
    const { status } = req.body;

    const request = await ProductRequest.findByPk(id);
    if (!request) {
      return res.status(404).json({
        success: false,
        error: 'Request not found',
      });
    }

    // Update status only (Sequelize validates against ENUM: pending, approved, rejected)
    if (status) {
      request.status = status;
    }

    await request.save();

    res.json({
      success: true,
      data: request,
      message: 'Product request status updated successfully',
    });
  } catch (error) {
    console.error('Update request error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update product request',
      details: error.message,
    });
  }
};
