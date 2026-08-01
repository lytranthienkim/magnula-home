const getAllowedOrigins = () => {
  const allowedOrigins = [];

  if (process.env.CLIENT_URL) {
    const clientUrls = process.env.CLIENT_URL
      .split(',')
      .map(url => url.trim())
      .filter(Boolean);
    allowedOrigins.push(...clientUrls);
  }

  if (process.env.ADMIN_URL) {
    const adminUrls = process.env.ADMIN_URL
      .split(',')
      .map(url => url.trim())
      .filter(Boolean);
    allowedOrigins.push(...adminUrls);
  }

  return [...new Set(allowedOrigins)];
};

export const corsConfig = {
  origin: (origin, callback) => {
    const allowedOrigins = getAllowedOrigins();

    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
