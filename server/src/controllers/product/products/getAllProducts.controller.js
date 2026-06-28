import db from '../../../config/db.js';
import { Op } from 'sequelize';
import { applyProductVisibilityFilter } from '../../../utils/productVisibility.js';
import { buildCompleteProductFilter, buildColorFilter, hasColorFilter } from '../../../utils/productFilter.js';

// Merge color and price filters with AND logic
const mergeFilters = (colorFilter, priceFilter) => {
  if (!colorFilter && !priceFilter) return null;
  if (!colorFilter) return priceFilter;
  if (!priceFilter) return colorFilter;

  // Both filters exist - need AND logic
  return {
    [Op.and]: [colorFilter, priceFilter]
  };
};

export const getAllProducts = async (req, res) => {
  try {
    const {
      Category,
      Collection,
      Product,
      ProductVariant,
      ProductImage,
      Material,
      FabricType,
      RoomSuitability,
    } = db.models;

    // Build WHERE clause from query params (search, filters)
    const queryFilters = buildCompleteProductFilter(req.query);

    // Check if requesting deleted items
    const isDeleted = req.query.deleted === 'true';

    // Apply visibility filter: Guest sees only ['in stock', 'out of stock'], Staff/Admin see all
    const visibilityFilter = isDeleted
      ? { deletedAt: { [Op.not]: null } } // Only deleted items
      : { deletedAt: null }; // Only active items

    const whereClause = applyProductVisibilityFilter(req, { ...visibilityFilter, ...queryFilters });

    // Check if color filter is needed
    const colorFilter = hasColorFilter(req.query) ? buildColorFilter(req.query) : null;

    // Build price filter
    let priceFilter = null;
    if (req.query.minPrice || req.query.maxPrice) {
      priceFilter = {};
      const minPrice = req.query.minPrice ? parseFloat(req.query.minPrice) : null;
      const maxPrice = req.query.maxPrice ? parseFloat(req.query.maxPrice) : null;

      if (minPrice !== null && !isNaN(minPrice)) {
        priceFilter.price = { [Op.gte]: minPrice };
      }

      if (maxPrice !== null && !isNaN(maxPrice)) {
        if (priceFilter.price) {
          priceFilter.price[Op.lte] = maxPrice;
        } else {
          priceFilter.price = { [Op.lte]: maxPrice };
        }
      }
    }

    // Build category filter
    const categoryInclude = {
      model: Category,
      attributes: ['id', 'categoryName'],
    };

    // If category query param exists, add where clause to filter by category name
    if (req.query.category) {
      categoryInclude.where = {
        categoryName: req.query.category,
      };
      categoryInclude.required = true; // Inner join to filter
    }

    // Build fabric type filter
    const fabricTypeInclude = {
      model: FabricType,
      attributes: ['id', 'name', 'description'],
    };

    // If fabricTypeName query param exists, add where clause
    if (req.query.fabricTypeName) {
      fabricTypeInclude.where = {
        name: req.query.fabricTypeName,
      };
      fabricTypeInclude.required = true; // Inner join to filter
    }

    // Build material filter
    const materialInclude = {
      model: Material,
      attributes: ['id', 'name', 'description'],
    };

    // If materialName query param exists, add where clause
    if (req.query.materialName) {
      materialInclude.where = {
        name: req.query.materialName,
      };
      materialInclude.required = true; // Inner join to filter
    }

    // Build room suitability filter
    const roomSuitabilityInclude = {
      model: RoomSuitability,
      attributes: ['id', 'name', 'description'],
    };

    // If roomSuitabilityName query param exists, add where clause
    if (req.query.roomSuitabilityName) {
      roomSuitabilityInclude.where = {
        name: req.query.roomSuitabilityName,
      };
      roomSuitabilityInclude.required = true; // Inner join to filter
    }

    const products = await Product.findAll({
      where: whereClause,
      paranoid: !isDeleted, // Disable paranoid mode to include deleted items when requested
      subQuery: false, // Important for color filter to work correctly with GROUP BY
      include: [
        categoryInclude,
        {
          model: Collection,
          attributes: ['id', 'collectionName', 'colorHex', 'description'],
          include: [
            {
              model: db.models.CollectionImage,
              as: 'images',
              attributes: ['id', 'imageUrl'],
            },
          ],
        },
        materialInclude,
        fabricTypeInclude,
        roomSuitabilityInclude,
        {
          model: ProductVariant,
          as: 'variants',
          attributes: ['id', 'overallSize', 'seatSize', 'price', 'stockQuantity', 'color'],
          where: mergeFilters(colorFilter, priceFilter) || undefined,
          required: colorFilter || priceFilter ? true : false, // Inner join if filters exist
        },
        {
          model: ProductImage,
          as: 'images',
          attributes: ['id', 'imageUrl', 'isMain'],
          where: { deletedAt: null },
          required: false,
        },
      ],
      order: [['id', 'ASC']],
    });

    res.json({
      success: true,
      data: products,
    });
  } catch (error) {
    console.error('Get all products error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
