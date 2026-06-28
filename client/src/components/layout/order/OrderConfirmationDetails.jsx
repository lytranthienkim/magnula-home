'use client'

export const OrderConfirmationDetails = ({ order }) => {
    if (!order) return null;

    return (
        <div className="border-[0.25px] border-[#272727] flex flex-col p-6 gap-12">
            {/* Order Code - Highlight */}
            <div className=" rounded-none text-center">
                <p className="body-03 font-display-regular text-gray-600 mb-2">Order Code</p>
                <p className="h3-neu font-display-semibold">{order.orderCode}</p>
            </div>

            {/* Order Details */}
            <div className=" rounded-none flex flex-col gap-2">
                <div className="flex justify-between items-center pb-4 border-b-[0.25px] border-[#272727]">
                    <p className="body-02 font-display-regular text-gray-600">Order Date</p>
                    <p className="body-02 font-display-semibold">
                        {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                </div>

                <div className="flex justify-between items-center pb-4 border-b-[0.25px] border-[#272727]">
                    <p className="body-02 font-display-regular text-gray-600">Status</p>
                    <p className="body-02 font-display-semibold">{order.status}</p>
                </div>

                <div className="flex justify-between items-center">
                    <p className="body-02 font-display-regular text-gray-600">Total Amount</p>
                    <p className="body-02 font-display-semibold">${parseFloat(order.totalPrice || 0).toFixed(2)}</p>
                </div>
            </div>

            {/* Customer Info */}
            <div className=" rounded-none flex flex-col gap-2">
                <p className="body-02 font-display-semibold uppercase">-/ Customer Information</p>

                <div className="flex flex-col gap-1">
                    <p className="body-02 font-display-semibold">{order.customerName}</p>
                    <p className="body-02 font-display-regular text-gray-600">{order.customerEmail}</p>
                </div>
            </div>

            {/* Order Items */}
            {order.items && order.items.length > 0 && (
                <div className=" rounded-none flex flex-col gap-2">
                    <p className="body-02 font-display-semibold uppercase">-/ Order Items</p>
                    <div className="flex flex-col gap-3">
                        {order.items.map((item, index) => (
                            <div
                                key={index}
                                className="flex justify-between items-start pb-3 border-b-[0.25px] border-[#272727]/50 last:border-b-0 last:pb-0"
                            >
                                <div className="flex-1">
                                    <p className="body-02 font-display-regular">{item.Product?.productName || `Product #${item.productId}`}</p>
                                    <p className="body-03 font-display-regular text-gray-600">
                                        Quantity: {item.quantity} 
                                    </p>
                                </div>
                                <p className="body-02 font-display-semibold ml-4">
                                    ${(item.quantity * parseFloat(item.priceAtPurchase || 0)).toFixed(2)}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
