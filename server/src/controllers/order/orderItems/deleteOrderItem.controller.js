import db from '../../../config/db.js';

export const deleteOrderItem = async (req, res) => {
  const transaction = await db.transaction();

  try {
    const { itemId } = req.params;
    const { OrderItem, ProductVariant, Order } = db.models;

    // Find the order item
    const orderItem = await OrderItem.findByPk(itemId, { transaction });
    if (!orderItem) {
      await transaction.rollback();
      return res.status(404).json({ success: false, error: 'Order item not found' });
    }

    const orderId = orderItem.orderId;
    const quantity = orderItem.quantity;
    const productVariantId = orderItem.productVariantId;

    // Restore stock
    const variant = await ProductVariant.findByPk(productVariantId, { transaction });
    if (variant) {
      await variant.update(
        { stockQuantity: variant.stockQuantity + quantity },
        { transaction }
      );
    }

    // Delete the order item
    await orderItem.destroy({ transaction });

    // Recalculate order total
    const order = await Order.findByPk(orderId, { transaction });
    const remainingItems = await OrderItem.findAll(
      {
        where: { orderId },
        transaction,
      }
    );

    let newTotal = 0;
    for (const item of remainingItems) {
      newTotal += item.priceAtPurchase * item.quantity;
    }

    await order.update({ totalPrice: newTotal }, { transaction });

    await transaction.commit();

    res.json({
      success: true,
      message: 'Order item deleted successfully',
      data: { orderId, itemId },
    });
  } catch (error) {
    await transaction.rollback();
    console.error('Delete order item error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};
