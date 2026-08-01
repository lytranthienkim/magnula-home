import jwt from 'jsonwebtoken';
import db from '../../../config/db.js';

export const checkAuth = async (req, res) => {
  try {
    const token = req.cookies?.authToken;

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'No authentication token found',
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

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
