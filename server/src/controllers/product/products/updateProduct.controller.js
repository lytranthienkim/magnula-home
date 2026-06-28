// Update Product Controller - Update product info

import db from '../../../config/db.js';

export const updateProduct = async (req, res) => {
  try {
    const {
      Product,
      Category,
      Material,
      FabricType,
      RoomSuitability,
      Collection,
    } = db.models;
    const { id } = req.params;
    const {
      productName,
      categoryId,
      materialId,
      fabricTypeId,
      roomSuitabilityId,
      collectionId,
      status,
    } = req.body;

    // Get product
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found',
      });
    }

    // Validate productName if changing
    if (productName && typeof productName === 'string' && productName.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Product name cannot be empty',
      });
    }

    // Verify reference IDs if changing
    const updates = {};

    if (productName) updates.productName = productName.trim();

    if (categoryId !== undefined) {
      if (typeof categoryId !== 'number') {
        return res.status(400).json({
          success: false,
          error: 'Category ID must be a number',
        });
      }
      const category = await Category.findByPk(categoryId);
      if (!category) {
        return res.status(404).json({
          success: false,
          error: 'Category not found',
        });
      }
      updates.categoryId = categoryId;
    }

    if (materialId !== undefined) {
      if (typeof materialId !== 'number') {
        return res.status(400).json({
          success: false,
          error: 'Material ID must be a number',
        });
      }
      const material = await Material.findByPk(materialId);
      if (!material) {
        return res.status(404).json({
          success: false,
          error: 'Material not found',
        });
      }
      updates.materialId = materialId;
    }

    if (fabricTypeId !== undefined) {
      if (typeof fabricTypeId !== 'number') {
        return res.status(400).json({
          success: false,
          error: 'Fabric type ID must be a number',
        });
      }
      const fabricType = await FabricType.findByPk(fabricTypeId);
      if (!fabricType) {
        return res.status(404).json({
          success: false,
          error: 'Fabric type not found',
        });
      }
      updates.fabricTypeId = fabricTypeId;
    }

    if (roomSuitabilityId !== undefined) {
      if (typeof roomSuitabilityId !== 'number') {
        return res.status(400).json({
          success: false,
          error: 'Room suitability ID must be a number',
        });
      }
      const roomSuitability = await RoomSuitability.findByPk(roomSuitabilityId);
      if (!roomSuitability) {
        return res.status(404).json({
          success: false,
          error: 'Room suitability not found',
        });
      }
      updates.roomSuitabilityId = roomSuitabilityId;
    }

    if (collectionId !== undefined) {
      if (collectionId !== null && typeof collectionId !== 'number') {
        return res.status(400).json({
          success: false,
          error: 'Collection ID must be a number or null',
        });
      }
      if (collectionId !== null) {
        const collection = await Collection.findByPk(collectionId);
        if (!collection) {
          return res.status(404).json({
            success: false,
            error: 'Collection not found',
          });
        }
      }
      updates.collectionId = collectionId;
    }

    if (status && typeof status === 'string') {
      const validStatuses = ['in stock', 'out of stock', 'discontinued'];
      const statusLower = status.toLowerCase();

      if (validStatuses.includes(statusLower)) {
        updates.status = statusLower;
      } else {
        return res.status(400).json({
          success: false,
          error: `Invalid status. Allowed values: ${validStatuses.join(', ')}`,
        });
      }
    }

    // Update product
    await product.update(updates);

    res.json({
      success: true,
      data: product,
      message: 'Product updated successfully',
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update product',
      details: error.message,
    });
  }
};
