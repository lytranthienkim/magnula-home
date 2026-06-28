import db from '../../../config/db.js';

export const updateOrderItem = async (req, res) => {
  const transaction = await db.transaction();

  try {
    const { itemId } = req.params;
    const { quantity } = req.body;
    const { OrderItem, ProductVariant, Order } = db.models;

    // Validate input
    if (quantity === undefined || quantity < 1) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        error: 'Quantity must be at least 1',
      });
    }

    // Find the order item
    const orderItem = await OrderItem.findByPk(itemId, { transaction });
    if (!orderItem) {
      await transaction.rollback();
      return res.status(404).json({ success: false, error: 'Order item not found' });
    }

    // Find the product variant to check stock
    const variant = await ProductVariant.findByPk(orderItem.productVariantId, { transaction });
    if (!variant) {
      await transaction.rollback();
      return res.status(404).json({ success: false, error: 'Product variant not found' });
    }

    // Calculate stock difference
    const oldQuantity = orderItem.quantity;
    const quantityDifference = quantity - oldQuantity;

    // Check if enough stock available
    if (quantityDifference > 0 && variant.stockQuantity < quantityDifference) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        error: `Insufficient stock. Available: ${variant.stockQuantity}`,
      });
    }

    // Update variant stock
    await variant.update(
      { stockQuantity: variant.stockQuantity - quantityDifference },
      { transaction }
    );

    // Update order item quantity
    await orderItem.update({ quantity }, { transaction });

    // Recalculate order total
    const order = await Order.findByPk(orderItem.orderId, { transaction });
    const allItems = await OrderItem.findAll(
      {
        where: { orderId: orderItem.orderId },
        transaction,
      }
    );

    let newTotal = 0;
    for (const item of allItems) {
      newTotal += item.priceAtPurchase * (item.id === itemId ? quantity : item.quantity);
    }

    await order.update({ totalPrice: newTotal }, { transaction });

    await transaction.commit();

    res.json({
      success: true,
      data: {
        ...orderItem.toJSON(),
        quantity,
      },
      message: 'Order item updated successfully',
    });
  } catch (error) {
    await transaction.rollback();
    console.error('Update order item error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};
