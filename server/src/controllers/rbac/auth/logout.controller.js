// Logout Controller - Stateless logout (just clear cookie)

import { COOKIE_OPTIONS } from '../../../config/cookies.js';

export const logout = async (req, res) => {
  try {
    // Clear the authToken cookie using standard cookie options
    res.clearCookie('authToken', COOKIE_OPTIONS);

    res.json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to logout',
      details: error.message,
    });
  }
};
