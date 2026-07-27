import { API } from "./config";
import { getCache, setCache, generateCacheKey } from "../utils/cache";

export const getAllMaterials = async () => {
    const cacheKey = generateCacheKey('materials');
    const cached = getCache(cacheKey);

    if (cached) {
        return cached;
    }

    const res = await API.get('/products/materials');
    setCache(cacheKey, res.data, 7200000);
    return res.data;
};