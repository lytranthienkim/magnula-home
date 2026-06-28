// Restore Material Controller - Restore soft-deleted material

import db from '../../../config/db.js';

export const restoreMaterial = async (req, res) => {
  try {
    const { Material } = db.models;
    const { id } = req.params;

    // Find the soft-deleted material
    const material = await Material.findByPk(id, { paranoid: false });
    if (!material) {
      return res.status(404).json({
        success: false,
        error: 'Material not found',
      });
    }

    // Check if material is actually deleted
    if (!material.deletedAt) {
      return res.status(400).json({
        success: false,
        error: 'Material is not deleted',
      });
    }

    // Restore the material
    await material.restore();

    // Verify restoration
    const restoredMaterial = await Material.findByPk(id);
    if (!restoredMaterial) {
      return res.status(500).json({
        success: false,
        error: 'Failed to restore material - verification failed',
      });
    }

    res.json({
      success: true,
      data: {
        materialId: restoredMaterial.id,
        name: restoredMaterial.name,
      },
      message: `Material "${restoredMaterial.name}" restored successfully`,
    });
  } catch (error) {
    console.error('Restore material error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
