const nodeEnv = process.env.NODE_ENV || 'development';
const appEnv = process.env.NEXT_PUBLIC_APP_ENV || nodeEnv;

export const config = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',

  siteUrl: process.env.NEXT_PUBLIC_CLIENT_URL || 'http://localhost:3000',

  countryApiKey: process.env.NEXT_PUBLIC_COUNTRY_API_KEY,
  mapboxToken: process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN,

  environment: nodeEnv,
  appEnv: appEnv,
};
