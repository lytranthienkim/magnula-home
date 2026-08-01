import { config } from '@/config/env';

export const getAllCountries = async () => {
    try {
        if (!config.countryApiKey) {
            return [];
        }

        const res = await fetch('https://api.countrystatecity.in/v1/countries',
            { headers: { 'X-CSCAPI-KEY': config.countryApiKey } }
        );

        if (!res.ok) {
            console.error(`Country API error: ${res.status} ${res.statusText}`);
            return [];
        }

        return res.json();
    } catch (error) {
        console.error('Failed to fetch countries:', error.message);
        return [];
    }
}

export const getAllStateByCountry = async (countryCode) => {
    try {
        if (!config.countryApiKey) {
            return [];
        }

        const res = await fetch(`https://api.countrystatecity.in/v1/countries/${countryCode}/states`,
            { headers: { 'X-CSCAPI-KEY': config.countryApiKey } }
        );

        if (!res.ok) {
            console.error(`State API error: ${res.status} ${res.statusText}`);
            return [];
        }

        return res.json();
    } catch (error) {
        console.error('Failed to fetch states:', error.message);
        return [];
    }
}
