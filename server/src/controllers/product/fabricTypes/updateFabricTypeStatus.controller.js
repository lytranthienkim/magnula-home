// Update Fabric Type Status Controller - Activate/Deactivate only

import db from '../../../config/db.js';

export const updateFabricTypeStatus = async (req, res) => {
  try {
    const { FabricType } = db.models;
    const { id } = req.params;
    const { isActive } = req.body;

    if (isActive === undefined || typeof isActive !== 'boolean') {
      return res.status(400).json({
        success: false,
        error: 'isActive (boolean) is required',
      });
    }

    const fabricType = await FabricType.findByPk(id);
    if (!fabricType) {
      return res.status(404).json({
        success: false,
        error: 'Fabric type not found',
      });
    }

    if (fabricType.isActive === isActive) {
      return res.status(400).json({
        success: false,
        error: `Fabric type is already ${isActive ? 'activated' : 'deactivated'}`,
      });
    }

    await fabricType.update({ isActive });

    res.json({
      success: true,
      data: {
        fabricTypeId: fabricType.id,
        name: fabricType.name,
        isActive: fabricType.isActive,
      },
      message: `Fabric type "${fabricType.name}" ${isActive ? 'activated' : 'deactivated'} successfully`,
    });
  } catch (error) {
    console.error('Update fabric type status error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
