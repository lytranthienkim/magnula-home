// Delete Fabric Type Controller - Soft delete with product reference check

import db from '../../../config/db.js';

export const deleteFabricType = async (req, res) => {
  try {
    const { FabricType, Product } = db.models;
    const { id } = req.params;

    const fabricType = await FabricType.findByPk(id);
    if (!fabricType) {
      return res.status(404).json({
        success: false,
        error: 'Fabric type not found',
      });
    }

    // Check if any product uses this fabric type (regardless of product status)
    const productCount = await Product.count({
      where: { fabricTypeId: id, deletedAt: null },
    });

    if (productCount > 0) {
      return res.status(403).json({
        success: false,
        error: `Cannot delete fabric type "${fabricType.name}" because there are ${productCount} products using it`,
      });
    }

    // Safe to soft delete using Sequelize's destroy method
    await fabricType.destroy();

    // Verify deletion was successful
    const deletedFabricType = await FabricType.findByPk(id, { paranoid: false });
    if (!deletedFabricType || !deletedFabricType.deletedAt) {
      return res.status(500).json({
        success: false,
        error: 'Failed to delete fabric type - verification failed',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Fabric type deleted successfully',
    });
  } catch (error) {
    console.error('Delete fabric type error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete fabric type',
    });
  }
};
