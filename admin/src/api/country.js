export const getAllCountries = async () => {
    try {
        if (!process.env.NEXT_PUBLIC_COUNTRY_API_KEY) {
            return [];
        }

        const res = await fetch('https://api.countrystatecity.in/v1/countries',
            {
                headers: { 'X-CSCAPI-KEY': `${process.env.NEXT_PUBLIC_COUNTRY_API_KEY}` },
                timeout: 5000
            }
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
        if (!process.env.NEXT_PUBLIC_COUNTRY_API_KEY) {
            return [];
        }

        const res = await fetch(`https://api.countrystatecity.in/v1/countries/${countryCode}/states`,
            {
                headers: { 'X-CSCAPI-KEY': `${process.env.NEXT_PUBLIC_COUNTRY_API_KEY}` },
                timeout: 5000
            }
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
