import apiClient from './config';

// Materials
export const getAllMaterials = async () => {
  const res = await apiClient.get('/products/materials');
  return res.data;
};

export const createMaterial = async (materialData) => {
  const res = await apiClient.post('/products/materials', materialData);
  return res.data;
};

export const updateMaterial = async (materialId, materialData) => {
  const res = await apiClient.put(`/products/materials/${materialId}`, materialData);
  return res.data;
};

export const updateMaterialStatus = async (materialId, status) => {
  const res = await apiClient.patch(`/products/materials/${materialId}/status`, { status });
  return res.data;
};

export const deleteMaterial = async (materialId) => {
  const res = await apiClient.delete(`/products/materials/${materialId}`);
  return res.data;
};

export const restoreMaterial = async (materialId) => {
  const res = await apiClient.post(`/products/materials/${materialId}/restore`);
  return res.data;
};

// Fabric Types
export const getAllFabricTypes = async () => {
  const res = await apiClient.get('/products/fabric-types');
  return res.data;
};

export const createFabricType = async (fabricTypeData) => {
  const res = await apiClient.post('/products/fabric-types', fabricTypeData);
  return res.data;
};

export const updateFabricType = async (fabricTypeId, fabricTypeData) => {
  const res = await apiClient.put(`/products/fabric-types/${fabricTypeId}`, fabricTypeData);
  return res.data;
};

export const updateFabricTypeStatus = async (fabricTypeId, status) => {
  const res = await apiClient.patch(`/products/fabric-types/${fabricTypeId}/status`, { status });
  return res.data;
};

export const deleteFabricType = async (fabricTypeId) => {
  const res = await apiClient.delete(`/products/fabric-types/${fabricTypeId}`);
  return res.data;
};

export const restoreFabricType = async (fabricTypeId) => {
  const res = await apiClient.post(`/products/fabric-types/${fabricTypeId}/restore`);
  return res.data;
};

// Room Suitabilities
export const getAllRoomSuitabilities = async () => {
  const res = await apiClient.get('/products/room-suitabilities');
  return res.data;
};

export const createRoomSuitability = async (suitabilityData) => {
  const res = await apiClient.post('/products/room-suitabilities', suitabilityData);
  return res.data;
};

export const updateRoomSuitability = async (suitabilityId, suitabilityData) => {
  const res = await apiClient.put(`/products/room-suitabilities/${suitabilityId}`, suitabilityData);
  return res.data;
};

export const updateRoomSuitabilityStatus = async (suitabilityId, status) => {
  const res = await apiClient.patch(`/products/room-suitabilities/${suitabilityId}/status`, { status });
  return res.data;
};

export const deleteRoomSuitability = async (suitabilityId) => {
  const res = await apiClient.delete(`/products/room-suitabilities/${suitabilityId}`);
  return res.data;
};

export const restoreRoomSuitability = async (suitabilityId) => {
  const res = await apiClient.post(`/products/room-suitabilities/${suitabilityId}/restore`);
  return res.data;
};
