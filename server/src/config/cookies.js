// Cookie name constant
export const COOKIE_NAMES = {
  AUTH_TOKEN: 'authToken',
};

export const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: true, // ✅ Always true vì cross-domain
  sameSite: 'none', // ✅ Cho phép cross-site cookies
};

export const getCookieOptions = (rememberMe = false) => {
  const options = { ...COOKIE_OPTIONS };

  if (rememberMe) {
    options.maxAge = 30 * 24 * 60 * 60 * 1000; // 30 ngày
  }

  return options;
};
