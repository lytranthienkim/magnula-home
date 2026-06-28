import apiClient from './config';

// Login - now with rememberMe for cookie lifetime
export const loginAdmin = async (email, password, rememberMe = false) => {
  const res = await apiClient.post('/auth/login', { email, password, rememberMe });
  return res.data;
};

// Check auth status - verify cookie-based token on app load
export const checkAuth = async () => {
  const res = await apiClient.get('/auth/check-auth');
  return res.data;
};

// Logout
export const logoutAdmin = async () => {
  const res = await apiClient.post('/auth/logout');
  return res.data;
};

// Get current user
export const getCurrentUser = async () => {
  const res = await apiClient.get('/auth/me');
  return res.data;
};

// Forgot password - request reset
export const forgotPassword = async (email) => {
  const res = await apiClient.post('/auth/forgot-password', { email });
  return res.data;
};

// Change password
export const changePassword = async (oldPassword, newPassword) => {
  const res = await apiClient.post('/auth/change-password', {
    oldPassword,
    newPassword,
  });
  return res.data;
};

// Reset password with token
export const resetPassword = async (token, newPassword) => {
  const res = await apiClient.post('/auth/reset-password', {
    token,
    newPassword,
  });
  return res.data;
};

// Admin reset password for user (e.g., staff who forgot password)
export const adminResetPassword = async (userId, newPassword) => {
  const res = await apiClient.post('/auth/reset-password-by-admin', {
    userId,
    newPassword,
  });
  return res.data;
};
