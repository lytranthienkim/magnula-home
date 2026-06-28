// Category Routes

import express from 'express';
import {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  restoreCategory,
  updateCategoryStatus,
} from '../../controllers/product/categories/index.js';
import { verifyToken, checkPermission } from '../../middleware/auth/index.js';

const router = express.Router();

// GET /api/products/categories - Get all active categories (PUBLIC)
router.get('/categories', getAllCategories);

// GET /api/products/categories/:id - Get category by ID (PUBLIC)
router.get('/categories/:id', getCategoryById);

// POST /api/products/categories - Create category
router.post('/categories', verifyToken, checkPermission('categories:create'), createCategory);

// PUT /api/products/categories/:id - Update category
router.put('/categories/:id', verifyToken, checkPermission('categories:update'), updateCategory);

// PATCH /api/products/categories/:id/status - Activate/Deactivate (update isActive)
router.patch('/categories/:id/status', verifyToken, checkPermission('categories:update'), updateCategoryStatus);

// DELETE /api/products/categories/:id - Delete category (soft delete with check)
router.delete('/categories/:id', verifyToken, checkPermission('categories:delete'), deleteCategory);

// PATCH /api/products/categories/:id/restore - Restore soft-deleted category
router.patch('/categories/:id/restore', verifyToken, checkPermission('categories:delete'), restoreCategory);

export default router;
