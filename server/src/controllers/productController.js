import { dbService } from '../services/dbService.js';
import cacheService from '../services/cacheService.js';

// Lấy tất cả sản phẩm (with cache)
const getAllProducts = async (req, res) => {
  try {
    const CACHE_KEY = 'products:all';

    const products = await cacheService.getOrSet(
      CACHE_KEY,
      () => dbService.getAllProducts(),
      600 // 10 minutes
    );

    return res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    console.error('Get All Products Error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch products',
    });
  }
};

// Lấy sản phẩm theo ID
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await dbService.getProductById(parseInt(id));

    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error('Get Product By ID Error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch product',
    });
  }
};

// Tạo sản phẩm mới
const createProduct = async (req, res) => {
  try {
    const {
      name,
      slug,
      price,
      images,
      stock,
      collectionId,
      overallInfo,
      seatInfo,
    } = req.body;

    if (!name || !slug || !price || !images) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: name, slug, price, images',
      });
    }

    const product = await dbService.createProduct({
      name,
      slug,
      price: parseInt(price),
      images,
      stock: stock ? parseInt(stock) : 10,
      collectionId: collectionId ? parseInt(collectionId) : null,
      overallInfo: overallInfo || null,
      seatInfo: seatInfo || null,
    });

    // Invalidate cache
    await cacheService.delete('products:all');

    return res.status(201).json({
      success: true,
      message: 'Product created successfully!',
      data: product,
    });
  } catch (error) {
    console.error('Create Product Error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to create product',
    });
  }
};

// Cập nhật sản phẩm
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      slug,
      price,
      images,
      stock,
      collectionId,
      overallInfo,
      seatInfo,
    } = req.body;

    const product = await dbService.updateProduct(parseInt(id), {
      name,
      slug,
      price: price ? parseInt(price) : undefined,
      images,
      stock: stock !== undefined ? parseInt(stock) : undefined,
      collectionId: collectionId ? parseInt(collectionId) : undefined,
      overallInfo,
      seatInfo,
    });

    // Invalidate cache
    await cacheService.delete('products:all');
    await cacheService.delete(`product:${id}`);

    return res.status(200).json({
      success: true,
      message: 'Product updated successfully!',
      data: product,
    });
  } catch (error) {
    console.error('Update Product Error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to update product',
    });
  }
};

// Xóa sản phẩm
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    await dbService.deleteProduct(parseInt(id));

    // Invalidate cache
    await cacheService.delete('products:all');
    await cacheService.delete(`product:${id}`);

    return res.status(200).json({
      success: true,
      message: 'Product deleted successfully!',
    });
  } catch (error) {
    console.error('Delete Product Error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to delete product',
    });
  }
};

// Lấy sản phẩm theo Collection
const getProductsByCollection = async (req, res) => {
  try {
    const { collectionId } = req.params;
    const products = await dbService.getProductsByCollection(parseInt(collectionId));

    return res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    console.error('Get Products By Collection Error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch products',
    });
  }
};

export {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductsByCollection,
};
