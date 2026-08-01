import db from '../../../config/db.js';
import { invalidateProductCache } from '../../../middleware/cache/cacheInvalidation.js';

export const createProduct = async (req, res) => {
  const transaction = await db.transaction();

  try {
    const {
      Product,
      ProductVariant,
      ProductImage,
      FabricType,
      Material,
      RoomSuitability,
      Collection,
      Category
    } = db.models;

    const {
      productName,
      materialId,
      fabricTypeId,
      roomSuitabilityId,
      categoryId,
      collectionId,
      variants,
      images
    } = req.body;

    if (!productName || typeof productName !== 'string' || productName.trim().length === 0) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        error: 'Product name is required',
      });
    }

    if (!materialId || typeof materialId !== 'number') {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        error: 'Material ID is required',
      });
    }

    if (!fabricTypeId || typeof fabricTypeId !== 'number') {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        error: 'Fabric type ID is required',
      });
    }

    if (!roomSuitabilityId || typeof roomSuitabilityId !== 'number') {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        error: 'Room suitability ID is required',
      });
    }

    if (!categoryId || typeof categoryId !== 'number') {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        error: 'Category ID is required',
      });
    }

    if (!Array.isArray(variants) || variants.length === 0) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        error: 'At least one variant is required',
      });
    }

    if (!Array.isArray(images) || images.length === 0) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        error: 'At least one image is required',
      });
    }

    const [material, fabricType, roomSuitability, category] = await Promise.all([
      Material.findByPk(materialId, { transaction }),
      FabricType.findByPk(fabricTypeId, { transaction }),
      RoomSuitability.findByPk(roomSuitabilityId, { transaction }),
      Category.findByPk(categoryId, { transaction }),
    ]);

    if (!material) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        error: 'Material not found',
      });
    }

    if (!fabricType) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        error: 'Fabric type not found',
      });
    }

    if (!roomSuitability) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        error: 'Room suitability not found',
      });
    }

    if (!category) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        error: 'Category not found',
      });
    }

    if (collectionId) {
      const collection = await Collection.findByPk(collectionId, { transaction });
      if (!collection) {
        await transaction.rollback();
        return res.status(404).json({
          success: false,
          error: 'Collection not found',
        });
      }
    }

    const product = await Product.create(
      {
        productName: productName.trim(),
        materialId,
        fabricTypeId,
        roomSuitabilityId,
        categoryId,
        collectionId: collectionId || null,
        status: 'in stock',
      },
      { transaction }
    );

    const productVariants = await ProductVariant.bulkCreate(
      variants.map(v => ({
        productId: product.id,
        overallSize: v.overallSize || v.size,
        seatSize: v.seatSize || null,
        color: v.color || null,
        price: v.price,
        stockQuantity: v.stockQuantity || v.stock || 0,
      })),
      { transaction }
    );

    const productImages = await ProductImage.bulkCreate(
      images.map(img => ({
        productId: product.id,
        imageUrl: img.imageUrl,
      })),
      { transaction }
    );

    await transaction.commit();
    await invalidateProductCache();

    res.status(201).json({
      success: true,
      data: {
        product,
        variants: productVariants,
        images: productImages,
      },
      message: 'Product created successfully',
    });
  } catch (error) {
    await transaction.rollback();
    console.error('Create product error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create product',
      details: error.message,
    });
  }
};
