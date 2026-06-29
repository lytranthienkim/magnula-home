export const checkPermission = (requiredPermission) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'User not authenticated',
        });
      }

      // Get permissions from JWT token 
      const userPermissions = req.user.permissions || [];

      // Check if user has the required permission
      const hasPermission = userPermissions.includes(requiredPermission);

      if (!hasPermission) {
        return res.status(403).json({
          success: false,
          error: `Permission denied: ${requiredPermission} required`,
        });
      }

      next();
    } catch (error) {
      console.error('Check permission error:', error);
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  };
};
