import { Op } from 'sequelize';

export const getProductStatusFilter = (req) => {
  // If user authenticated (Admin/Staff) → No filter, show all statuses
  if (req.user && req.user.userId) {
    return null; // No filter - show all products
  }

  return {
    status: {
      [Op.in]: ['in stock', 'out of stock'],
    },
  };
};

export const applyProductVisibilityFilter = (req, existingWhere = {}) => {
  const statusFilter = getProductStatusFilter(req);

  if (!statusFilter) {
    // No additional filter needed - return existing WHERE clause
    return existingWhere;
  }

  // Merge visibility filter with existing WHERE clause
  return {
    ...existingWhere,
    [Op.and]: [statusFilter],
  };
};
