import { dbService } from '../services/dbService.js';

// Lấy tất cả đơn hàng
const getAllOrders = async (req, res) => {
  try {
    const orders = await dbService.getAllOrders();
    return res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (error) {
    console.error('Get All Orders Error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch orders',
    });
  }
};

// Lấy đơn hàng theo ID
const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await dbService.getOrderById(parseInt(id));

    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error('Get Order By ID Error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch order',
    });
  }
};

// Lấy đơn hàng của khách hàng
const getOrdersByCustomerId = async (req, res) => {
  try {
    const { customerId } = req.params;
    const orders = await dbService.getOrdersByCustomerId(parseInt(customerId));

    return res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (error) {
    console.error('Get Orders By Customer ID Error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch orders',
    });
  }
};

// Cập nhật trạng thái đơn hàng
const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['pending', 'processing', 'shipped', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
      });
    }

    const order = await dbService.updateOrderStatus(parseInt(id), status);

    return res.status(200).json({
      success: true,
      message: 'Order status updated successfully!',
      data: order,
    });
  } catch (error) {
    console.error('Update Order Status Error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to update order status',
    });
  }
};

// Xóa đơn hàng
const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    await dbService.deleteOrder(parseInt(id));

    return res.status(200).json({
      success: true,
      message: 'Order deleted successfully!',
    });
  } catch (error) {
    console.error('Delete Order Error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to delete order',
    });
  }
};

// Lấy đơn hàng theo trạng thái
const getOrdersByStatus = async (req, res) => {
  try {
    const { status } = req.params;
    const orders = await dbService.getOrdersByStatus(status);

    return res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (error) {
    console.error('Get Orders By Status Error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch orders',
    });
  }
};

export {
  getAllOrders,
  getOrderById,
  getOrdersByCustomerId,
  updateOrderStatus,
  deleteOrder,
  getOrdersByStatus,
};
