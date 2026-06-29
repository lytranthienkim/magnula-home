//checkUserRole, register, forgotPassword, createUser, updateProfile, createOrder, createProductRequest

import { Op } from 'sequelize';

export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidPhone = (phone) => {
  if (!phone || typeof phone !== 'string') {
    return false;
  }

  if (phone.includes('@')) {
    return false;
  }

  const digitsOnly = phone.replace(/\D/g, '');

  if (digitsOnly.length < 7 || digitsOnly.length > 15) {
    return false;
  }

  return true;
};


export const sanitizePhone = (phone) => {
  return phone.replace(/\D/g, '');
};


export const checkEmailUniqueness = async (User, email, excludeUserId = null) => {
  const where = { email };
  if (excludeUserId) {
    where.id = { [Op.ne]: excludeUserId };
  }
  return await User.findOne({ where });
};