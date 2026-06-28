import { API } from "./config";

export const getAllCategories = async () => {
    const res = await API.get('/api/products/categories');
    return res.data;
}