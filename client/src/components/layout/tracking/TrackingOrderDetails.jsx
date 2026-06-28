'use client'

export const TrackingOrderDetails = ({ trackedOrder, orderItems }) => {
    if (!trackedOrder) return null;

    return (
        <div className='flex flex-col  gap-1 w-full'>
            <div className="w-full flex flex-col  gap-4 md:gap-6 border-[0.25px] border-[#272727] py-3 md:py-4 px-3 md:px-4 rounded-none">

                {/* Order Code & Status */}
                <div className="grid grid-cols-1 md:grid-cols-2 justify-between items-start md:items-center gap-2 md:gap-4">
                    <p className="w-full body-02 md:body-01 font-display-semibold text-left">Order Code: {trackedOrder.orderCode}</p>
                    <p className="w-full body-02 md:body-01 font-display-semibold text-left md:text-right">Order Status: {trackedOrder.status}</p>
                </div>

                {/* Customer Information */}
                <div className="flex flex-col gap-2">
                    <p className="body-03 md:body-02 font-display-semibold uppercase">-/ Customer Information</p>
                    <p className="body-02 md:body-02 font-display-regular"><span className='font-display-semibold'>Full name:</span> {trackedOrder.customerName}</p>
                    <p className="body-02 md:body-02 font-display-regular break-all"><span className='font-display-semibold'>Email:</span> {trackedOrder.customerEmail}</p>
                </div>

                {/* Order Items */}
                {orderItems && orderItems.length > 0 && (
                    <div className="flex flex-col gap-2">
                        <p className="body-03 md:body-02 font-display-semibold uppercase">-/ Items Ordered</p>
                        <div className="flex flex-col gap-2">
                            {orderItems.map((item, index) => (
                                <div
                                    key={index}
                                    className="flex justify-between items-start pb-2 gap-2"
                                >
                                    <div className="flex-1">
                                        <p className="body-03 md:body-02 font-display-semibold line-clamp-2">
                                            {item.Product?.productName || `Product #${item.productId}`}
                                        </p>
                                        <p className="body-03 font-display-regular">
                                            Quantity: {item.quantity}
                                        </p>
                                    </div>
                                    <p className="body-03 md:body-03 font-display-semibold whitespace-nowrap">
                                        ${parseFloat(item.priceAtPurchase || 0).toFixed(2)}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Total Amount */}
                <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-center pt-2 border-t-[0.25px] border-[#272727]">
                        <p className="body-02 md:body-02 font-display-semibold">Total Amount</p>
                        <p className="body-02 md:body-02 font-display-semibold">
                            ${parseFloat(trackedOrder.totalPrice || 0).toFixed(2)}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
