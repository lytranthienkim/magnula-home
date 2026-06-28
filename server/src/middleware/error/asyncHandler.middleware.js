// Async Handler Middleware - - Wrapper để catch lỗi trong async handlers

export const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
