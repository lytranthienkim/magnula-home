import apiClient from './config';

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