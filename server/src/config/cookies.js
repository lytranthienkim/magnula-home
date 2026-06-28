// Cookie Configuration - HttpOnly Cookie Settings
// Production-ready configuration with security best practices

// Cookie name constant
export const COOKIE_NAMES = {
  AUTH_TOKEN: 'authToken',
};

// Core cookie options (without the cookie name)
// NOTE: DO NOT add `name` field here - it's passed as separate parameter to res.cookie()
export const COOKIE_OPTIONS = {
  // HttpOnly - Prevent JavaScript access (XSS protection)
  httpOnly: true,

  // Secure - Only send over HTTPS in production, HTTP in development
  secure: process.env.NODE_ENV === 'production',

  // SameSite - Use 'lax' for production balance between security and UX
  // 'strict' breaks UX when user clicks external links (Gmail, Facebook, etc.)
  // 'lax' allows top-level navigations while still protecting against CSRF
  sameSite: 'lax',
};

// Get cookie options with lifetime based on rememberMe flag
// This is the ONLY function needed for setting cookies
export const getCookieOptions = (rememberMe = false) => {
  const options = { ...COOKIE_OPTIONS };

  if (rememberMe) {
    // 30 days in milliseconds
    options.maxAge = 30 * 24 * 60 * 60 * 1000;
  }
  // If no maxAge: browser treats as session cookie (deleted when browser closes)

  return options;
};
