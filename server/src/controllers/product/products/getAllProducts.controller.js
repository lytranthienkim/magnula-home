import db from '../../../config/db.js';
import { Op } from 'sequelize';
import { buildCompleteProductFilter, buildColorFilter, hasColorFilter } from '../../../utils/productFilter.js';

// Kết hợp color và price filters với logic AND
const mergeFilters = (colorFilter, priceFilter) => {
  if (!colorFilter && !priceFilter) return null;
  if (!colorFilter) return priceFilter;
  if (!priceFilter) return colorFilter;

  // Cả hai filters tồn tại - cần logic AND
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

    // Xây dựng WHERE clause từ query params (search, filters)
    const queryFilters = buildCompleteProductFilter(req.query);

    // Kiểm tra nếu yêu cầu deleted items
    const isDeleted = req.query.deleted === 'true';

    // Xây dựng WHERE clause từ visibility và query filters
    const visibilityFilter = isDeleted
      ? { deletedAt: { [Op.not]: null } } // Chỉ deleted items
      : {
          deletedAt: null, // Chỉ active items
          status: { [Op.ne]: 'discontinued' } // Loại bỏ discontinued products
        };

    const whereClause = { ...visibilityFilter, ...queryFilters };

    // Kiểm tra nếu cần color filter
    const colorFilter = hasColorFilter(req.query) ? buildColorFilter(req.query) : null;

    // Xây dựng price filter
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

    // Xây dựng category filter
    const categoryInclude = {
      model: Category,
      attributes: ['id', 'categoryName'],
    };

    // Nếu category query param tồn tại, thêm where clause để filter theo category name
    if (req.query.category) {
      categoryInclude.where = {
        categoryName: req.query.category,
      };
      categoryInclude.required = true;
    }

    // Xây dựng fabric type filter
    const fabricTypeInclude = {
      model: FabricType,
      attributes: ['id', 'name', 'description'],
    };

    // Nếu fabricTypeName query param tồn tại, thêm where clause
    if (req.query.fabricTypeName) {
      fabricTypeInclude.where = {
        name: req.query.fabricTypeName,
      };
      fabricTypeInclude.required = true;
    }

    // Xây dựng material filter
    const materialInclude = {
      model: Material,
      attributes: ['id', 'name', 'description'],
    };

    // Nếu materialName query param tồn tại, thêm where clause
    if (req.query.materialName) {
      materialInclude.where = {
        name: req.query.materialName,
      };
      materialInclude.required = true;
    }

    // Xây dựng room suitability filter
    const roomSuitabilityInclude = {
      model: RoomSuitability,
      attributes: ['id', 'name', 'description'],
    };

    // Nếu roomSuitabilityName query param tồn tại, thêm where clause
    if (req.query.roomSuitabilityName) {
      roomSuitabilityInclude.where = {
        name: req.query.roomSuitabilityName,
      };
      roomSuitabilityInclude.required = true;
    }

    const products = await Product.findAll({
      where: whereClause,
      paranoid: !isDeleted, // Tắt paranoid mode để bao gồm deleted items khi được yêu cầu
      subQuery: false, // Quan trọng để color filter hoạt động đúng với GROUP BY
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
          required: colorFilter || priceFilter ? true : false, 
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
    console.error('Error fetching data:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
