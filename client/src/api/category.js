import { API } from "./config";
import { getCache, setCache, generateCacheKey } from "../utils/cache";

export const getAllCategories = async () => {
    const cacheKey = generateCacheKey('categories');
    const cached = getCache(cacheKey);

    if (cached) {
        return cached;
    }

    const res = await API.get('/products/categories');
    setCache(cacheKey, res.data, 7200000);
    return res.data;
}