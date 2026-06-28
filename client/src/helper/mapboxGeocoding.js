const MAPBOX_ACCESS_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
const MAPBOX_API_URL = 'https://api.mapbox.com/geocoding/v5';

export const searchAddresses = async (query, country = null) => {
    if (!query || query.trim().length < 3) {
        return [];
    }

    if (!MAPBOX_ACCESS_TOKEN) {
        console.error('Mapbox Access Token not found. Add NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN to .env.local');
        return [];
    }

    try {
        // Build URL with optional country filter
        let url = `${MAPBOX_API_URL}/mapbox.places/${encodeURIComponent(query)}.json`;
        url += `?access_token=${MAPBOX_ACCESS_TOKEN}`;
        url += '&types=address,place';
        url += '&limit=10'; // Show 10 suggestions max

        if (country) {
            url += `&country=${country.toLowerCase()}`;
        }

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Mapbox API error: ${response.status}`);
        }

        const data = await response.json();

        // Transform Mapbox response to our format
        return data.features.map(feature => ({
            id: feature.id,
            address: feature.place_name,
            shortName: feature.text,
            coordinates: feature.geometry.coordinates,
            context: feature.context,
        })) || [];
    } catch (error) {
        console.error('Error fetching addresses from Mapbox:', error);
        return [];
    }
};

