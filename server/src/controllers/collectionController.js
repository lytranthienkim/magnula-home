import { dbService } from '../services/dbService.js';
import cacheService from '../services/cacheService.js';

// Lấy tất cả bộ sưu tập (with cache)
const getAllCollections = async (req, res) => {
  try {
    const CACHE_KEY = 'collections:all';

    // Thử lấy từ cache trước
    const collections = await cacheService.getOrSet(
      CACHE_KEY,
      () => dbService.getAllCollections(),
      600 // 10 minutes cache
    );

    return res.status(200).json({
      success: true,
      data: collections,
    });
  } catch (error) {
    console.error('Get All Collections Error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch collections',
    });
  }
};

// Lấy bộ sưu tập theo ID
const getCollectionById = async (req, res) => {
  try {
    const { id } = req.params;
    const collection = await dbService.getCollectionById(parseInt(id));

    if (!collection) {
      return res.status(404).json({
        success: false,
        error: 'Collection not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: collection,
    });
  } catch (error) {
    console.error('Get Collection By ID Error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch collection',
    });
  }
};

// Lấy bộ sưu tập theo slug
const getCollectionBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const collection = await dbService.getCollectionBySlug(slug);

    if (!collection) {
      return res.status(404).json({
        success: false,
        error: 'Collection not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: collection,
    });
  } catch (error) {
    console.error('Get Collection By Slug Error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch collection',
    });
  }
};

// Tạo bộ sưu tập mới
const createCollection = async (req, res) => {
  try {
    const { name, slug, images } = req.body;

    if (!name || !slug || !images) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: name, slug, images',
      });
    }

    const collection = await dbService.createCollection({ name, slug, images });

    // Invalidate cache khi tạo collection mới
    await cacheService.delete('collections:all');

    return res.status(201).json({
      success: true,
      message: 'Collection created successfully!',
      data: collection,
    });
  } catch (error) {
    console.error('Create Collection Error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to create collection',
    });
  }
};

// Cập nhật bộ sưu tập
const updateCollection = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, slug, images } = req.body;

    const collection = await dbService.updateCollection(parseInt(id), { name, slug, images });

    // Invalidate cache
    await cacheService.delete('collections:all');
    await cacheService.delete(`collection:${id}`);

    return res.status(200).json({
      success: true,
      message: 'Collection updated successfully!',
      data: collection,
    });
  } catch (error) {
    console.error('Update Collection Error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to update collection',
    });
  }
};

// Xóa bộ sưu tập
const deleteCollection = async (req, res) => {
  try {
    const { id } = req.params;
    await dbService.deleteCollection(parseInt(id));

    // Invalidate cache
    await cacheService.delete('collections:all');
    await cacheService.delete(`collection:${id}`);

    return res.status(200).json({
      success: true,
      message: 'Collection deleted successfully!',
    });
  } catch (error) {
    console.error('Delete Collection Error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to delete collection',
    });
  }
};

export {
  getAllCollections,
  getCollectionById,
  getCollectionBySlug,
  createCollection,
  updateCollection,
  deleteCollection,
};
