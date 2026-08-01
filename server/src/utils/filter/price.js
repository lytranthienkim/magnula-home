import { Op } from 'sequelize';

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
