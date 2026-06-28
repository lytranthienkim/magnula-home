// Verify Token Middleware - Stateless auth using HttpOnly Cookies
// Extracts JWT from cookie and validates it
// Does NOT query DB - all info is in the JWT payload

import jwt from 'jsonwebtoken';
import db from '../../config/db.js';

export const verifyToken = async (req, res, next) => {
  try {
    // Get token from HttpOnly cookie
    const token = req.cookies?.authToken;

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'No authentication token found',
      });
    }

    // Verify and decode JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if user account is still active in DB (only check, don't fetch full user)
    const { User } = db.models;
    const user = await User.findByPk(decoded.userId, {
      attributes: ['id', 'isActive'], // Only fetch isActive flag
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

    // Attach decoded token data to request (includes permissions from JWT)
    req.user = {
      id: decoded.userId,
      userId: decoded.userId,
      email: decoded.email,
      roles: decoded.roles,
      permissions: decoded.permissions || [], // Permissions from JWT token
    };

    next();
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
      error: 'Unauthorized',
    });
  }
};
