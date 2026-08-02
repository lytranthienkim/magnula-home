'use client'

export const OrderConfirmationDetails = ({ order }) => {
    if (!order) return null;

    return (
        <div className="border-[0.25px] border-[#272727] flex flex-col p-6 gap-4">
            {/* Order code */}
            <div className=" rounded-none text-center">
                <p className="body-01 mb-2 font-[500]">Order Code</p>
                <p className="font-[500]">{order.orderCode}</p>
            </div>

            {/* Order details */}
            <div className=" rounded-none flex flex-col gap-2">
                <div className="flex justify-between items-center pb-4 border-b-[0.25px] border-[#272727]">
                    <p className="body-02 font-[500]">Order Date</p>
                    <p className="body-02 font-[500]">
                        {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                </div>

                <div className="flex justify-between items-center pb-4 border-b-[0.25px] border-[#272727]">
                    <p className="body-02 font-[500]">Status</p>
                    <p className="body-02 font-[500]">{order.status}</p>
                </div>

                <div className="flex justify-between items-center">
                    <p className="body-02 font-[500]">Total Amount</p>
                    <p className="body-02 font-[500]">${parseFloat(order.totalPrice || 0).toFixed(2)}</p>
                </div>
            </div>

            {/* Customer info */}
            <div className=" rounded-none flex flex-col gap-2">
                <p className="body-02  uppercase font-[500]">-/ Customer Information</p>

                <div className="flex flex-col gap-1">
                    <p className="body-02 font-[400]"><span className="font-[500]">Name:</span> {order.customerName}</p>
                    <p className="body-02 font-[400]"><span className="font-[500]">Email:</span> {order.customerEmail}</p>
                </div>
            </div>

            {/* Order items */}
            {order.items && order.items.length > 0 && (
                <div className=" rounded-none flex flex-col gap-2">
                    <p className="body-02  uppercase font-[500]">-/ Order Items</p>
                    <div className="flex flex-col gap-3">
                        {order.items.map((item, index) => (
                            <div
                                key={index}
                                className="flex justify-between items-start pb-3 border-b-[0.25px] border-[#272727]/50 last:border-b-0 last:pb-0"
                            >
                                <div className="flex-1 flex flex-col gap-1">
                                    <p className="body-02 font-[500]">{item.Product?.productName || `Product #${item.productId}`}</p>
                                    <p className="body-01 ">
                                        Quantity: {item.quantity} 
                                    </p>
                                </div>
                                <p className="body-02  ml-4 font-[500]">
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
