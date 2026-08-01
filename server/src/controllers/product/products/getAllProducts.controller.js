import db from '../../../config/db.js';
import { Op } from 'sequelize';
import { buildProductFilterWhere, buildColorFilter, hasColorFilter } from '../../../utils/filter/index.js';

const mergeFilters = (colorFilter, priceFilter) => {
  if (!colorFilter && !priceFilter) return null;
  if (!colorFilter) return priceFilter;
  if (!priceFilter) return colorFilter;

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

    const queryFilters = buildProductFilterWhere(req.query);

    const isDeleted = req.query.deleted === 'true';

    const visibilityFilter = isDeleted
      ? { deletedAt: { [Op.not]: null } }
      : {
          deletedAt: null,
          status: { [Op.ne]: 'discontinued' }
        };

    const whereClause = { ...visibilityFilter, ...queryFilters };

    const colorFilter = hasColorFilter(req.query) ? buildColorFilter(req.query) : null;

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

    const categoryInclude = {
      model: Category,
      attributes: ['id', 'categoryName'],
    };

    if (req.query.category) {
      categoryInclude.where = {
        categoryName: req.query.category,
      };
      categoryInclude.required = true;
    }

    const fabricTypeInclude = {
      model: FabricType,
      attributes: ['id', 'name', 'description'],
    };

    if (req.query.fabricTypeName) {
      fabricTypeInclude.where = {
        name: req.query.fabricTypeName,
      };
      fabricTypeInclude.required = true;
    }

    const materialInclude = {
      model: Material,
      attributes: ['id', 'name', 'description'],
    };

    if (req.query.materialName) {
      materialInclude.where = {
        name: req.query.materialName,
      };
      materialInclude.required = true;
    }

    const roomSuitabilityInclude = {
      model: RoomSuitability,
      attributes: ['id', 'name', 'description'],
    };

    if (req.query.roomSuitabilityName) {
      roomSuitabilityInclude.where = {
        name: req.query.roomSuitabilityName,
      };
      roomSuitabilityInclude.required = true;
    }

    const count = await Product.count({
      where: whereClause,
      paranoid: !isDeleted,
    });

    const products = await Product.findAll({
      where: whereClause,
      paranoid: !isDeleted,
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
          attributes: ['id', 'overallSize', 'seatSize', 'price', 'color'],
          ...(colorFilter || priceFilter ? {
            where: mergeFilters(colorFilter, priceFilter),
            required: true,
          } : {}),
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