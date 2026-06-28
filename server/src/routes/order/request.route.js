import express from 'express';
import { getAllProductRequests, getProductRequestById, createProductRequest, updateProductRequest, deleteProductRequest, restoreProductRequest } from '../../controllers/order/requests/index.js';
import { verifyToken } from '../../middleware/auth/index.js';

const router = express.Router();

// GET /api/product-requests - Staff view all requests
router.get('/', verifyToken, getAllProductRequests);
// GET /api/product-requests/:id - View request details
router.get('/:id', getProductRequestById);
// POST /api/product-requests - Create request (NO LOGIN - guest)
router.post('/', createProductRequest);
// PUT /api/product-requests/:id - Update request
router.put('/:id', verifyToken, updateProductRequest);
// DELETE /api/product-requests/:id - Delete request
router.delete('/:id', verifyToken, deleteProductRequest);
// PATCH /api/product-requests/:id/restore - Restore soft-deleted request
router.patch('/:id/restore', verifyToken, restoreProductRequest);

export default router;
