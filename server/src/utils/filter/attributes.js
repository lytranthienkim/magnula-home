import { Op } from 'sequelize';

export const buildProductFilterWhere = (queryParams) => {
  const where = {};

  if (queryParams.search && queryParams.search.trim()) {
    where.productName = {
      [Op.like]: `%${queryParams.search.trim()}%`,
    };
  }

  if (queryParams.collectionId) {
    const collectionId = parseInt(queryParams.collectionId, 10);
    if (!isNaN(collectionId)) {
      where.collectionId = collectionId;
    }
  }

  if (queryParams.materialId) {
    const materialId = parseInt(queryParams.materialId, 10);
    if (!isNaN(materialId)) {
      where.materialId = materialId;
    }
  }

  if (queryParams.fabricTypeId) {
    const fabricTypeId = parseInt(queryParams.fabricTypeId, 10);
    if (!isNaN(fabricTypeId)) {
      where.fabricTypeId = fabricTypeId;
    }
  }

  if (queryParams.roomSuitabilityId) {
    const roomSuitabilityId = parseInt(queryParams.roomSuitabilityId, 10);
    if (!isNaN(roomSuitabilityId)) {
      where.roomSuitabilityId = roomSuitabilityId;
    }
  }

  if (queryParams.status) {
    const validStatuses = ['in stock', 'out of stock', 'discontinued'];
    if (validStatuses.includes(queryParams.status)) {
      where.status = queryParams.status;
    }
  }

  return where;
};
