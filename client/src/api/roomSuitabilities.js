import { API } from "./config";
import { getCache, setCache, generateCacheKey } from "../utils/cache";

export const getAllRoomSuitabilities = async () => {
    const cacheKey = generateCacheKey('roomSuitabilities');
    const cached = getCache(cacheKey);

    if (cached) {
        return cached;
    }

    const res = await API.get('/products/room-suitabilities');
    setCache(cacheKey, res.data, 7200000);
    return res.data;
};