// Check Auth Controller - Stateless auth verification
// When frontend loads or refreshes, it calls this endpoint
// Browser sends HttpOnly cookie automatically
// Server decodes JWT to restore user session without database query

import jwt from 'jsonwebtoken';
import db from '../../../config/db.js';

export const checkAuth = async (req, res) => {
  try {
    // Get token from HttpOnly cookie (set by verifyToken middleware)
    const token = req.cookies?.authToken;

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'No authentication token found',
      });
    }

    // Verify and decode JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Verify user still exists and is active in database
    const { User } = db.models;
    const user = await User.findByPk(decoded.userId, {
      attributes: ['id', 'isActive', 'email', 'fullName'],
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'User not found',
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        error: 'Account is deactivated',
      });
    }

    // Return user data and permissions from JWT
    res.json({
      success: true,
      data: {
        userId: decoded.userId,
        email: decoded.email,
        fullName: user.fullName,
        roles: decoded.roles,
        permissions: decoded.permissions || [],
      },
    });
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        error: 'Token expired',
      });
    }

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        error: 'Invalid token',
      });
    }

    res.status(401).json({
      success: false,
      error: 'Authentication check failed',
    });
  }
};
