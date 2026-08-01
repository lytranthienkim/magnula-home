import apiClient from './config';

export const getAllCategories = async () => {
    const res = await apiClient.get('/products/categories');
    return res.data;
};

export const createCategory = async (categoryData) => {
    const res = await apiClient.post('/products/categories', categoryData);
    return res.data;
};

export const updateCategory = async (categoryId, categoryData) => {
    const res = await apiClient.put(`/products/categories/${categoryId}`, categoryData);
    return res.data;
};

export const updateCategoryStatus = async (categoryId, status) => {
    const res = await apiClient.patch(`/products/categories/${categoryId}/status`, { status });
    return res.data;
};

export const deleteCategory = async (categoryId) => {
    const res = await apiClient.delete(`/products/categories/${categoryId}`);
    return res.data;
};

export const restoreCategory = async (categoryId) => {
    const res = await apiClient.post(`/products/categories/${categoryId}/restore`);
    return res.data;
};