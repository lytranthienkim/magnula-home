// Create Room Suitability Controller

import db from '../../../config/db.js';

export const createRoomSuitability = async (req, res) => {
  try {
    const { RoomSuitability } = db.models;
    const { name, description } = req.body;

    // Validate input
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Room suitability name is required',
      });
    }

    // Check if room suitability already exists (only active)
    const existing = await RoomSuitability.findOne({
      where: { name: name.trim(), isActive: true, deletedAt: null },
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        error: 'Room suitability name already exists',
      });
    }

    // Create room suitability
    const roomSuitability = await RoomSuitability.create({
      name: name.trim(),
      description: description || null,
      isActive: true,
    });

    res.status(201).json({
      success: true,
      data: roomSuitability,
      message: 'Room suitability created successfully',
    });
  } catch (error) {
    console.error('Create room suitability error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create room suitability',
    });
  }
};
