// Update Material Controller

import db from '../../../config/db.js';

export const updateMaterial = async (req, res) => {
  try {
    const { Material } = db.models;
    const { id } = req.params;
    const { name, description, isActive } = req.body;

    // Get material
    const material = await Material.findByPk(id);

    if (!material) {
      return res.status(404).json({
        success: false,
        error: 'Material not found',
      });
    }

    // Validate name if changing
    if (name && name.trim() !== material.name) {
      if (typeof name !== 'string' || name.trim().length === 0) {
        return res.status(400).json({
          success: false,
          error: 'Material name cannot be empty',
        });
      }

      const existing = await Material.findOne({
        where: { name: name.trim(), isActive: true, deletedAt: null },
      });

      if (existing) {
        return res.status(400).json({
          success: false,
          error: 'Material name already exists',
        });
      }
    }

    // Update fields
    if (name) material.name = name.trim();
    if (description !== undefined) material.description = description || null;
    if (isActive !== undefined) material.isActive = isActive;

    await material.save();

    res.status(200).json({
      success: true,
      data: material,
      message: 'Material updated successfully',
    });
  } catch (error) {
    console.error('Update material error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update material',
    });
  }
};
