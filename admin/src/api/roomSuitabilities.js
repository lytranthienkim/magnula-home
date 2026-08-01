import apiClient from './config';

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