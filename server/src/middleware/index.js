// Middleware Index - Export all middleware from subdirectories

// Auth Middleware
export { verifyToken, checkPermission } from './auth/index.js';

// Error Middleware
export { asyncHandler, ApiError, errorHandler } from './error/index.js';

// NOTE: Validation middleware removed - controllers and middleware use utils/validation.js directly
// See COMPLETE_AUDIT_REDUNDANT_FILES.md for details
