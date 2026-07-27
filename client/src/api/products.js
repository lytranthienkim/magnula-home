import { API } from "./config";
import { getCache, setCache, generateCacheKey } from "../utils/cache";

export const getAllProducts = async (queryParams = '') => {
    const cacheKey = generateCacheKey('products', queryParams);
    const cached = getCache(cacheKey);

    if (cached) {
        return cached;
    }

    const res = await API.get(`/products?${queryParams}`);
    setCache(cacheKey, res.data, 3600000);
    return res.data;
};

export const getProductItem = async (id) => {
    const cacheKey = generateCacheKey(`products/${id}`);
    const cached = getCache(cacheKey);

    if (cached) {
        return cached;
    }

    const res = await API.get(`/products/${id}`);
    setCache(cacheKey, res.data, 3600000);
    return res.data;
};

