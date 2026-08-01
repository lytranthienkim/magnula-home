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
import { cacheMiddleware } from '../../middleware/cache/index.js';

const router = express.Router();

router.get('/categories', cacheMiddleware(3600), getAllCategories);
router.get('/categories/:id', cacheMiddleware(3600), getCategoryById);

router.post('/categories', verifyToken, checkPermission('category:create'), createCategory);

router.put('/categories/:id', verifyToken, checkPermission('category:update'), updateCategory);

router.patch('/categories/:id/status', verifyToken, checkPermission('category:update'), updateCategoryStatus);
router.patch('/categories/:id/restore', verifyToken, checkPermission('category:delete'), restoreCategory);

router.delete('/categories/:id', verifyToken, checkPermission('category:delete'), deleteCategory);

export default router;
