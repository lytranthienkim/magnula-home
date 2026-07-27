import { API } from "./config";
import { getCache, setCache, generateCacheKey } from "../utils/cache";

export const getAllFabricTypes = async () => {
    const cacheKey = generateCacheKey('fabricTypes');
    const cached = getCache(cacheKey);

    if (cached) {
        return cached;
    }

    const res = await API.get('/products/fabric-types');
    setCache(cacheKey, res.data, 7200000);
    return res.data;
};