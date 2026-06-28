import { Op } from 'sequelize';

export const buildProductFilterWhere = (queryParams) => {
  const where = {};

  // Search by product name
  if (queryParams.search && queryParams.search.trim()) {
    where.productName = {
      [Op.like]: `%${queryParams.search.trim()}%`,
    };
  }

  // Filter by collection
  if (queryParams.collectionId) {
    const collectionId = parseInt(queryParams.collectionId, 10);
    if (!isNaN(collectionId)) {
      where.collectionId = collectionId;
    }
  }

  // Filter by material
  if (queryParams.materialId) {
    const materialId = parseInt(queryParams.materialId, 10);
    if (!isNaN(materialId)) {
      where.materialId = materialId;
    }
  }

  // Filter by fabric type
  if (queryParams.fabricTypeId) {
    const fabricTypeId = parseInt(queryParams.fabricTypeId, 10);
    if (!isNaN(fabricTypeId)) {
      where.fabricTypeId = fabricTypeId;
    }
  }

  // Filter by room suitability
  if (queryParams.roomSuitabilityId) {
    const roomSuitabilityId = parseInt(queryParams.roomSuitabilityId, 10);
    if (!isNaN(roomSuitabilityId)) {
      where.roomSuitabilityId = roomSuitabilityId;
    }
  }

  // Filter by status
  if (queryParams.status) {
    const validStatuses = ['in stock', 'out of stock', 'discontinued'];
    if (validStatuses.includes(queryParams.status)) {
      where.status = queryParams.status;
    }
  }

  return where;
};

export const buildPriceRangeFilter = (queryParams) => {
  const where = {};

  const minPrice = queryParams.minPrice ? parseFloat(queryParams.minPrice) : null;
  const maxPrice = queryParams.maxPrice ? parseFloat(queryParams.maxPrice) : null;

  if (minPrice !== null && !isNaN(minPrice)) {
    where.price = { [Op.gte]: minPrice };
  }

  if (maxPrice !== null && !isNaN(maxPrice)) {
    if (where.price) {
      where.price[Op.lte] = maxPrice;
    } else {
      where.price = { [Op.lte]: maxPrice };
    }
  }

  return where;
};

/**
 * Extract color filter from query parameters
 * @param {Object} queryParams - req.query
 * @returns {Object|null} Color filter WHERE clause or null
 *
 * Supports: ?color=red or ?color=red,blue,green
 */
export const buildColorFilter = (queryParams) => {
  if (!queryParams.color) return null;

  const colorString = queryParams.color.trim();
  if (!colorString) return null;

  // Split by comma if multiple colors
  const colors = colorString
    .split(',')
    .map(c => c.trim())
    .filter(c => c.length > 0);

  if (colors.length === 0) return null;

  // Return WHERE clause for ProductVariant color filter
  if (colors.length === 1) {
    return {
      color: {
        [Op.like]: `%${colors[0]}%`,
      },
    };
  }

  // Multiple colors - OR condition
  return {
    [Op.or]: colors.map(color => ({
      color: {
        [Op.like]: `%${color}%`,
      },
    })),
  };
};

/**
 * Build complete product filter (includes all query params)
 * Note: Color filtering requires checking ProductVariant, handled at controller level
 * @param {Object} queryParams - req.query
 * @returns {Object} Product WHERE clause
 */
export const buildCompleteProductFilter = (queryParams) => {
  return buildProductFilterWhere(queryParams);
};

/**
 * Check if color filter is present
 * @param {Object} queryParams - req.query
 * @returns {boolean}
 */
export const hasColorFilter = (queryParams) => {
  return !!(queryParams.color && queryParams.color.trim());
};
