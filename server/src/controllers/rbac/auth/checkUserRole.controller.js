import db from '../../../config/db.js';
import { isValidEmail } from '../../../utils/validation.js';

export const checkUserRole = async (req, res) => {
  try {
    const { User, UserRole, Role } = db.models;
    const { email } = req.body;

    // Kiểm tra input
    if (!email) {
      return res.status(400).json({
        success: false,
        error: 'Email is required',
      });
    }

    // Kiểm tra format email
    if (!isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid email format',
      });
    }

    // Tìm user theo email với role
    const user = await User.findOne({
      where: { email },
      include: [{
        model: UserRole,
        as: 'userRoles',
        include: [{
          model: Role,
          attributes: ['roleName']
        }],
      }],
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'Email not found in system',
      });
    }

    // Lấy role chính của user
    const primaryRole = user.userRoles?.[0]?.Role?.roleName;

    res.json({
      success: true,
      data: {
        role: primaryRole,
      },
    });
  } catch (error) {
    console.error('Check user role error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to verify user',
    });
  }
};
