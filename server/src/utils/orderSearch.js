
import { Op } from 'sequelize';

export const buildOrderSearchWhere = (queryParams) => {
  const where = {};

  // Search by phone number
  if (queryParams.phone && queryParams.phone.trim()) {
    where.customerPhone = {
      [Op.like]: `%${queryParams.phone.trim()}%`,
    };
  }

  // Search by order code
  if (queryParams.orderCode && queryParams.orderCode.trim()) {
    where.orderCode = {
      [Op.like]: `%${queryParams.orderCode.trim().toUpperCase()}%`,
    };
  }

  // Search by email
  if (queryParams.email && queryParams.email.trim()) {
    where.customerEmail = {
      [Op.like]: `%${queryParams.email.trim()}%`,
    };
  }

  // Filter by status
  if (queryParams.status) {
    const validStatuses = ['Pending', 'Processing', 'Shipping', 'Completed', 'Cancelled'];
    if (validStatuses.includes(queryParams.status)) {
      where.status = queryParams.status;
    }
  }

  return where;
};

export const buildCompleteOrderSearch = (queryParams) => {
  return buildOrderSearchWhere(queryParams);
};
