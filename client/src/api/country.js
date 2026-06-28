export const getAllCountries = async () => {
    const res = await fetch('https://api.countrystatecity.in/v1/countries',
        {headers: { 'X-CSCAPI-KEY': `${process.env.NEXT_PUBLIC_COUNTRY_API_KEY}` }}
    );
    return res.json();
}

export const getAllStateByCountry = async (countryCode) => {
    const res = await fetch(`https://api.countrystatecity.in/v1/countries/${countryCode}/states`,
        {headers: { 'X-CSCAPI-KEY': `${process.env.NEXT_PUBLIC_COUNTRY_API_KEY}` }}
    );
    return res.json();
}
