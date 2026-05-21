import express from 'express';
import * as collectionController from '../controllers/collectionController.js';

const router = express.Router();

// Lấy tất cả bộ sưu tập
router.get('/collections', collectionController.getAllCollections);

// Lấy bộ sưu tập theo ID
router.get('/collections/:id', collectionController.getCollectionById);

// Lấy bộ sưu tập theo slug
router.get('/collections/slug/:slug', collectionController.getCollectionBySlug);

// Tạo bộ sưu tập mới
router.post('/collections', collectionController.createCollection);

// Cập nhật bộ sưu tập
router.put('/collections/:id', collectionController.updateCollection);

// Xóa bộ sưu tập
router.delete('/collections/:id', collectionController.deleteCollection);

export default router;
