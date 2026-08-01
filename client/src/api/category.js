import { API } from "./config";

export const getAllCategories = async () => {
    const res = await API.get('/products/categories');
    return res.data;
}