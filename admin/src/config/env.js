const nodeEnv = process.env.NODE_ENV || 'development';
const appEnv = process.env.NEXT_PUBLIC_APP_ENV || nodeEnv;

export const config = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL,
  adminUrl: process.env.NEXT_PUBLIC_ADMIN_URL,
  countryApiKey: process.env.NEXT_PUBLIC_COUNTRY_API_KEY || '',

  environment: nodeEnv,
  appEnv: appEnv,
};