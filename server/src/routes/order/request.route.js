import express from 'express';
import { getAllProductRequests, getProductRequestById, createProductRequest, updateProductRequest, deleteProductRequest, restoreProductRequest } from '../../controllers/order/requests/index.js';
import { verifyToken } from '../../middleware/auth/index.js';

const router = express.Router();

router.get('/', verifyToken, getAllProductRequests);
router.get('/:id', getProductRequestById);

router.post('/', createProductRequest);

router.put('/:id', verifyToken, updateProductRequest);

router.patch('/:id/restore', verifyToken, restoreProductRequest);

router.delete('/:id', verifyToken, deleteProductRequest);

export default router;
