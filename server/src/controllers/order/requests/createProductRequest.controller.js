import db from '../../../config/db.js';
import { isValidPhone, sanitizePhone } from '../../../utils/validation.js';

export const createProductRequest = async (req, res) => {
  try {
    const { ProductRequest, Product, ProductVariant } = db.models;
    const { customerName, customerPhone, productId, productVariantId, requestedQuantity, description } = req.body;

    // Validate input
    if (!customerName || !customerPhone) {
      return res.status(400).json({
        success: false,
        error: 'Required fields: customerName, customerPhone',
      });
    }

    // Validate phone format
    if (!isValidPhone(customerPhone)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid phone number. Phone must contain 7-15 digits (special characters will be removed).',
      });
    }

    if (!productId && !productVariantId) {
      return res.status(400).json({
        success: false,
        error: 'Either productId or productVariantId is required',
      });
    }

    if (!requestedQuantity || requestedQuantity < 1) {
      return res.status(400).json({
        success: false,
        error: 'Requested quantity must be at least 1',
      });
    }

    // Verify product/variant exists if provided
    if (productId) {
      const product = await Product.findByPk(productId);
      if (!product) {
        return res.status(404).json({
          success: false,
          error: 'Product not found',
        });
      }
    }

    if (productVariantId) {
      const variant = await ProductVariant.findByPk(productVariantId);
      if (!variant) {
        return res.status(404).json({
          success: false,
          error: 'Product variant not found',
        });
      }
    }

    // Create product request (sanitize phone: remove special chars, keep only digits)
    const request = await ProductRequest.create({
      customerName,
      customerPhone: sanitizePhone(customerPhone),
      productId: productId || null,
      productVariantId: productVariantId || null,
      requestedQuantity,
      description: description || null,
      status: 'Pending',
    });

    res.status(201).json({
      success: true,
      data: {
        requestId: request.id,
        customerName: request.customerName,
        customerPhone: request.customerPhone,
        productId: request.productId,
        productVariantId: request.productVariantId,
        requestedQuantity: request.requestedQuantity,
        status: request.status,
        message: 'Product request created successfully. We will contact you soon.',
      },
    });
  } catch (error) {
    console.error('Create request error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create product request',
      details: error.message,
    });
  }
};
