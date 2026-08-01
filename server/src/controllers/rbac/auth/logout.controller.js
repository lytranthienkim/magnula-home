import { COOKIE_OPTIONS } from '../../../config/cookies.js';

export const logout = async (req, res) => {
  try {
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
