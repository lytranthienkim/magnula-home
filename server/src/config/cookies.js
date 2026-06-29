// Cookie name constant
export const COOKIE_NAMES = {
  AUTH_TOKEN: 'authToken',
};

export const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
};

export const getCookieOptions = (rememberMe = false) => {
  const options = { ...COOKIE_OPTIONS };

  if (rememberMe) {
    options.maxAge = 30 * 24 * 60 * 60 * 1000; // 30 ngày
  }

  return options;
};
