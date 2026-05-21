import { dbService } from '../services/dbService.js';

const createOrder = async (req, res) => {
  try {
    const { customerInfo, cartItems, shippingFee, totalPrice, paymentMethod } = req.body;

    // Kiểm tra dữ liệu bắt buộc
    if (!customerInfo || !cartItems || !totalPrice || !paymentMethod) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: customerInfo, cartItems, totalPrice, paymentMethod',
      });
    }

    // 1. Tạo khách hàng mới
    const customer = await dbService.createCustomer({
      firstname: customerInfo.firstname,
      lastname: customerInfo.lastname,
      email: customerInfo.email,
      phone: customerInfo.phone,
      country: customerInfo.country,
      address: customerInfo.address,
      apartment: customerInfo.apartment || null,
      city: customerInfo.city,
      postalCode: customerInfo.postalCode || null,
    });

    // 2. Tạo đơn hàng
    const order = await dbService.createOrder({
      customerId: customer.id,
      shippingFee: shippingFee || 0,
      totalPrice: totalPrice,
      paymentMethod: paymentMethod,
      status: 'pending',
    });

    // 3. Tạo các item trong đơn hàng
    const orderItems = [];
    for (const item of cartItems) {
      const orderItem = await dbService.createOrderItem({
        orderId: order.id,
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
        selectedOverall: item.selectedOverall || null,
        selectedSeat: item.selectedSeat || null,
      });
      orderItems.push(orderItem);
    }

    // 4. Trả về đơn hàng hoàn chỉnh
    const completeOrder = {
      ...order,
      customer,
      orderItems,
    };

    return res.status(201).json({
      success: true,
      message: 'Order placed successfully!',
      data: completeOrder,
    });
  } catch (error) {
    console.error('Checkout Controller Error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to process order',
    });
  }
};

export { createOrder };
