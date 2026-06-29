import db from '../../../config/db.js';

export const updateOrder = async (req, res) => {
  try {
    const { Order } = db.models;
    const { id } = req.params;
    const { status, customerName, customerEmail, customerPhone, countryRegion, stateProvince, shippingAddress } = req.body;

    const order = await Order.findByPk(id);
    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found',
      });
    }

    // Build update payload - only update fields that are provided
    const updateData = {};
    if (status !== undefined) updateData.status = status;
    if (customerName !== undefined) updateData.customerName = customerName;
    if (customerEmail !== undefined) updateData.customerEmail = customerEmail;
    if (customerPhone !== undefined) updateData.customerPhone = customerPhone;
    if (countryRegion !== undefined) updateData.countryRegion = countryRegion;
    if (stateProvince !== undefined) updateData.stateProvince = stateProvince;
    if (shippingAddress !== undefined) updateData.shippingAddress = shippingAddress;

    // Validate at least one field is being updated
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No fields to update',
      });
    }

    await order.update(updateData);

    res.json({
      success: true,
      data: order,
      message: 'Order updated successfully',
    });
  } catch (error) {
    console.error('Update order error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update order',
      details: error.message,
    });
  }
};
