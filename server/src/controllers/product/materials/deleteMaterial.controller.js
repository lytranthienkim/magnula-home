// Delete Material Controller - Soft delete with product reference check

import db from '../../../config/db.js';

export const deleteMaterial = async (req, res) => {
  try {
    const { Material, Product } = db.models;
    const { id } = req.params;

    // Get material
    const material = await Material.findByPk(id);
    if (!material) {
      return res.status(404).json({
        success: false,
        error: 'Material not found',
      });
    }

    // Check if any product uses this material (regardless of product status)
    const productCount = await Product.count({
      where: { materialId: id, deletedAt: null },
    });

    if (productCount > 0) {
      return res.status(403).json({
        success: false,
        error: `Cannot delete material "${material.name}" because there are ${productCount} products using it`,
      });
    }

    // Safe to soft delete using Sequelize's destroy method
    await material.destroy();

    // Verify deletion was successful
    const deletedMaterial = await Material.findByPk(id, { paranoid: false });
    if (!deletedMaterial || !deletedMaterial.deletedAt) {
      return res.status(500).json({
        success: false,
        error: 'Failed to delete material - verification failed',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Material deleted successfully',
    });
  } catch (error) {
    console.error('Delete material error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete material',
    });
  }
};
