import { API } from "./config";
import { getCache, setCache, generateCacheKey } from "../utils/cache";

export const getAllCollection = async () => {
    const cacheKey = generateCacheKey('collections');
    const cached = getCache(cacheKey);

    if (cached) {
        return cached;
    }

    const res = await API.get('/products/collections');
    setCache(cacheKey, res.data, 7200000);
    return res.data;
}