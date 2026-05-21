// Middleware xử lý lỗi toàn cục
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Lỗi từ Prisma
  if (err.code && err.code.startsWith('P')) {
    if (err.code === 'P2025') {
      return res.status(404).json({
        success: false,
        error: 'Resource not found',
      });
    }
    if (err.code === 'P2002') {
      return res.status(409).json({
        success: false,
        error: 'This record already exists',
      });
    }
    return res.status(400).json({
      success: false,
      error: 'Database error occurred',
    });
  }

  // Lỗi validation
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      error: err.message,
    });
  }

  // Lỗi mặc định
  return res.status(err.statusCode || 500).json({
    success: false,
    error: err.message || 'Internal server error',
  });
};

export default errorHandler;
