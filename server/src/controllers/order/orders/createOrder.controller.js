import db from '../../../config/db.js';
import { v4 as uuidv4 } from 'uuid';
import { isValidPhone, sanitizePhone } from '../../../utils/validation.js';
import { validateShippingAddress } from '../../../utils/addressValidation.js';

export const createOrder = async (req, res) => {
  const transaction = await db.transaction();

  try {
    const { Order, OrderItem, ProductVariant, PaymentMethod } = db.models;
    const {
      fullName,
      email,
      phone,
      countryRegion,
      stateProvince,
      shippingAddress,
      items,
      paymentMethodId,
    } = req.body;

    // Validate required fields
    if (!fullName || !email || !phone || !countryRegion || !stateProvince || !shippingAddress) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        error: 'Required fields: fullName, email, phone, countryRegion, stateProvince, shippingAddress',
      });
    }

    // Validate shipping address (Layer 1: Regex & Logic)
    const addressValidation = validateShippingAddress(shippingAddress);
    if (!addressValidation.valid) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        error: addressValidation.error,
      });
    }

    // Validate phone format
    if (!isValidPhone(phone)) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        error: 'Invalid phone number. Phone must contain 7-15 digits (special characters will be removed).',
      });
    }

    if (!Array.isArray(items) || items.length === 0) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        error: 'At least one item is required',
      });
    }

    // Verify payment method if provided
    if (paymentMethodId) {
      const paymentMethod = await PaymentMethod.findByPk(paymentMethodId, { transaction });
      if (!paymentMethod) {
        await transaction.rollback();
        return res.status(404).json({
          success: false,
          error: 'Payment method not found',
        });
      }
    }

    let totalPrice = 0;
    const orderItemsData = [];

    // Validate all items first
    for (const item of items) {
      if (!item.productVariantId || !item.quantity) {
        await transaction.rollback();
        return res.status(400).json({
          success: false,
          error: 'Each item must have productVariantId and quantity',
        });
      }

      const variant = await ProductVariant.findByPk(item.productVariantId, { transaction });
      if (!variant) {
        await transaction.rollback();
        return res.status(404).json({
          success: false,
          error: `Variant ${item.productVariantId} not found`,
        });
      }

      if (variant.stockQuantity < item.quantity) {
        await transaction.rollback();
        return res.status(400).json({
          success: false,
          error: `Insufficient stock for variant ${item.productVariantId}. Available: ${variant.stockQuantity}, Requested: ${item.quantity}`,
        });
      }

      totalPrice += variant.price * item.quantity;
      orderItemsData.push({
        productId: variant.productId,
        productVariantId: item.productVariantId,
        quantity: item.quantity,
        priceAtPurchase: variant.price,
      });
    }

    // Tạo mã đơn hàng gồm: ORD + ngày hiện tại + 6 ký tự ngẫu nhiên
    const orderCode = `ORD-${new Date().toISOString().split('T')[0]}-${uuidv4().substring(0, 6).toUpperCase()}`;

    // Create order 
    const order = await Order.create(
      {
        orderCode,
        customerName: fullName,
        customerEmail: email,
        customerPhone: sanitizePhone(phone),
        countryRegion,
        stateProvince,
        shippingAddress,
        totalPrice,
        paymentMethodId: paymentMethodId || null,
        status: 'Pending',
      },
      { transaction }
    );

    // Create order items and update stock
    for (const itemData of orderItemsData) {
      await OrderItem.create({ orderId: order.id, ...itemData }, { transaction });
      const variant = await ProductVariant.findByPk(itemData.productVariantId, { transaction });
      await variant.update(
        { stockQuantity: variant.stockQuantity - itemData.quantity },
        { transaction }
      );
    }

    await transaction.commit();

    res.status(201).json({
      success: true,
      data: {
        orderId: order.id,
        orderCode: order.orderCode,
        customerEmail: order.customerEmail,
        totalPrice: order.totalPrice,
        status: order.status,
        message: 'Order created successfully. Check email for confirmation.',
      },
    });
  } catch (error) {
    await transaction.rollback();
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create order',
      details: error.message,
    });
  }
};
