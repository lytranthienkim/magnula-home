// Bulk Create Collections Controller - Create multiple collections at once

import db from '../../../config/db.js';

export const bulkCreateCollections = async (req, res) => {
  try {
    const { Collection } = db.models;
    const { collections } = req.body;

    // Validate input
    if (!Array.isArray(collections) || collections.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Collections must be a non-empty array',
      });
    }

    // Validate each collection
    for (const collection of collections) {
      if (!collection.collectionName || !collection.colorHex) {
        return res.status(400).json({
          success: false,
          error: 'Each collection requires collectionName and colorHex',
        });
      }

      // Validate color format (#RRGGBB)
      if (!/^#[0-9A-F]{6}$/i.test(collection.colorHex)) {
        return res.status(400).json({
          success: false,
          error: `Invalid color format: ${collection.colorHex}. Use #RRGGBB format`,
        });
      }

      // Check for duplicates (only active collections)
      const existing = await Collection.findOne({
        where: { collectionName: collection.collectionName, deletedAt: null },
      });
      if (existing) {
        return res.status(400).json({
          success: false,
          error: `Collection "${collection.collectionName}" already exists`,
        });
      }
    }

    // Bulk create collections
    const createdCollections = await Collection.bulkCreate(collections);

    res.status(201).json({
      success: true,
      data: createdCollections,
      message: `${createdCollections.length} collections created successfully`,
    });
  } catch (error) {
    console.error('Bulk create collections error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create collections',
    });
  }
};
