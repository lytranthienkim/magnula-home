import db from '../../../config/db.js';

export const updateMaterialStatus = async (req, res) => {
  try {
    const { Material } = db.models;
    const { id } = req.params;
    const { isActive } = req.body;

    if (isActive === undefined || typeof isActive !== 'boolean') {
      return res.status(400).json({
        success: false,
        error: 'isActive (boolean) is required',
      });
    }

    const material = await Material.findByPk(id);
    if (!material) {
      return res.status(404).json({
        success: false,
        error: 'Material not found',
      });
    }

    if (material.isActive === isActive) {
      return res.status(400).json({
        success: false,
        error: `Material is already ${isActive ? 'activated' : 'deactivated'}`,
      });
    }

    await material.update({ isActive });

    res.json({
      success: true,
      data: {
        materialId: material.id,
        name: material.name,
        isActive: material.isActive,
      },
      message: `Material "${material.name}" ${isActive ? 'activated' : 'deactivated'} successfully`,
    });
  } catch (error) {
    console.error('Update material status error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
