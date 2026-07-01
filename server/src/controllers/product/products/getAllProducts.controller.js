import db from '../../../config/db.js';
import { Op } from 'sequelize';
import { buildCompleteProductFilter, buildColorFilter, hasColorFilter } from '../../../utils/productFilter.js';

// Hàm hỗ trợ filter color và price từ bảng Product Variant
const mergeFilters = (colorFilter, priceFilter) => {
  if (!colorFilter && !priceFilter) return null; // Không có filter nào
  if (!colorFilter) return priceFilter; // Chỉ có price filter
  if (!priceFilter) return colorFilter; // Chỉ có color filter

  // Cả hai filters tồn tại 
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

    // Xây dựng query filters từ các query params
    const queryFilters = buildCompleteProductFilter(req.query);

    // Kiểm tra nếu yêu cầu deleted items để hiển thị trong restore
    const isDeleted = req.query.deleted === 'true';

    // Xây dựng visibility filter dựa trên trạng thái deleted
    const visibilityFilter = isDeleted // kiểm tra xem có phải là yêu cầu hiển thị các sản phẩm đã bị xóa hay không
      ? { deletedAt: { [Op.not]: null } } // Nếu là yêu cầu hiển thị các sản phẩm đã bị xóa, chỉ lấy các sản phẩm có deletedAt khác null
      : {
          deletedAt: null, // Nếu là yêu cầu hiển thị toàn bộ sản phẩm gồm in stock và out of stock 
          status: { [Op.ne]: 'discontinued' } // loại bỏ sản phẩm ngừng kinh doanh
        };

    const whereClause = { ...visibilityFilter, ...queryFilters }; // Kết hợp visibility filter và các query filters khác

    // Kiểm tra nếu cần color filter
    const colorFilter = hasColorFilter(req.query) ? buildColorFilter(req.query) : null;

    // Xây dựng price filter
    let priceFilter = null; 
    if (req.query.minPrice || req.query.maxPrice) {
      priceFilter = {};
      const minPrice = req.query.minPrice ? parseFloat(req.query.minPrice) : null;
      const maxPrice = req.query.maxPrice ? parseFloat(req.query.maxPrice) : null;

      if (minPrice !== null && !isNaN(minPrice)) { // Trường hợp nhập giá thấp nhất
        priceFilter.price = { [Op.gte]: minPrice }; // Greater Than or Equal - Lớn hơn hoặc bằng
      }

      if (maxPrice !== null && !isNaN(maxPrice)) { // Trường hợp nhập giá cao nhất
        if (priceFilter.price) {
          priceFilter.price[Op.lte] = maxPrice; // Có minPrice và maxPrice, thêm điều kiện lte vào object hiện tại
        } else {
          priceFilter.price = { [Op.lte]: maxPrice }; // Nếu chỉ có maxPrice, tạo object mới
        }
      }
    }

    // Xây dựng category filter
    const categoryInclude = {
      model: Category, // Check bảng Category
      attributes: ['id', 'categoryName'],
    };

    // Nếu category query param tồn tại thì thêm where clause
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

    // Truy vấn sản phẩm với các filters và includes
    const products = await Product.findAll({
      where: whereClause,
      paranoid: !isDeleted, // Tắt paranoid mode để có thể bao gồm các sản phẩm đã bị xóa nếu isDeleted là true hoặc false tuỳ vào yêu cầu truy vấn
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
