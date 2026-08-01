import apiClient from './config';

export const loginAdmin = async (email, password, rememberMe = false) => {
  const res = await apiClient.post('/auth/auth/login', { email, password, rememberMe });
  return res.data;
};

export const checkAuth = async () => {
  const res = await apiClient.get('/auth/check-auth');
  return res.data;
};

export const logoutAdmin = async () => {
  const res = await apiClient.post('/auth/auth/logout');
  return res.data;
};

export const getCurrentUser = async () => {
  const res = await apiClient.get('/auth/me');
  return res.data;
};

export const forgotPassword = async (email) => {
  const res = await apiClient.post('/auth/forgot-password', { email });
  return res.data;
};

export const changePassword = async (oldPassword, newPassword) => {
  const res = await apiClient.post('/auth/change-password', {
    oldPassword,
    newPassword,
  });
  return res.data;
};

export const resetPassword = async (token, newPassword) => {
  const res = await apiClient.post('/auth/reset-password', {
    token,
    newPassword,
  });
  return res.data;
};

export const adminResetPassword = async (userId, newPassword) => {
  const res = await apiClient.post('/auth/reset-password-by-admin', {
    userId,
    newPassword,
  });
  return res.data;
};
