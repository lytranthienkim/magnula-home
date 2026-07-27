import { getCache, setCache, generateCacheKey } from "../utils/cache";

export const getAllCountries = async () => {
    const cacheKey = generateCacheKey('countries');
    const cached = getCache(cacheKey);

    if (cached) {
        return cached;
    }

    const res = await fetch('https://api.countrystatecity.in/v1/countries',
        {headers: { 'X-CSCAPI-KEY': `${process.env.NEXT_PUBLIC_COUNTRY_API_KEY}` }}
    );
    const data = await res.json();
    setCache(cacheKey, data, 86400000);
    return data;
}

export const getAllStateByCountry = async (countryCode) => {
    const cacheKey = generateCacheKey(`states/${countryCode}`);
    const cached = getCache(cacheKey);

    if (cached) {
        return cached;
    }

    const res = await fetch(`https://api.countrystatecity.in/v1/countries/${countryCode}/states`,
        {headers: { 'X-CSCAPI-KEY': `${process.env.NEXT_PUBLIC_COUNTRY_API_KEY}` }}
    );
    const data = await res.json();
    setCache(cacheKey, data, 86400000);
    return data;
}
