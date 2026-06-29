import bcrypt from 'bcryptjs';
import db from '../../../config/db.js';

export const resetPasswordByAdmin = async (req, res) => {
  try {
    const { User } = db.models;
    const { userId, newPassword } = req.body;
    const adminId = req.user.userId; // Lấy từ JWT token

    // Kiểm tra dữ liệu đầu vào
    if (!userId || !newPassword) {
      return res.status(400).json({
        success: false,
        error: 'User ID and new password are required',
      });
    }

    // Kiểm tra độ mạnh của mật khẩu
    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        error: 'Password must be at least 6 characters', 
      });
    }

    // Lấy thông tin người dùng cần đặt lại mật khẩu
    const targetUser = await User.findByPk(userId);
    if (!targetUser) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    // Ngăn chặn admin đặt lại mật khẩu của chính họ thông qua endpoint này
    // admin nên sử dụng endpoint changePassword yêu cầu mật khẩu cũ
    if (adminId === userId) {
      return res.status(400).json({
        success: false,
        error: 'Use change-password endpoint to update your own password',
      });
    }

    // Mã hóa mật khẩu mới
    const passwordHash = await bcrypt.hash(newPassword, 10);

    // Cập nhật mật khẩu trong cơ sở dữ liệu
    await targetUser.update({ passwordHash });

    res.json({
      success: true,
      message: 'Password reset successfully for user',
      data: {
        userId: targetUser.id,
        email: targetUser.email,
        fullName: targetUser.fullName,
      },
    });
  } catch (error) {
    console.error('Reset password by admin error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to reset password',
    });
  }
};
