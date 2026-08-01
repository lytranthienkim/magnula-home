import { API } from "./config";

export const getAllProducts = async (queryParams = '') => {
    const res = await API.get(`/products?${queryParams}`);
    return res.data;
};

export const getProductItem = async (id) => {
    const res = await API.get(`/products/${id}`);
    return res.data;
};

