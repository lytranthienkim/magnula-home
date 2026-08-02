'use client'

export const TrackingOrderDetails = ({ trackedOrder, orderItems }) => {
    if (!trackedOrder) return null;

    return (
        <div className='flex flex-col  gap-1 w-full'>
            <div className="w-full flex flex-col  gap-4 md:gap-6 border-[0.25px] border-[#272727] py-3 md:py-4 px-3 md:px-4 rounded-none">

                {/* Order code */}
                <div className="grid grid-cols-1 md:grid-cols-2 justify-between items-start md:items-center gap-2 md:gap-4">
                    <p className="w-full body-02 md:body-01 text-left font-[500]">Order Code: {trackedOrder.orderCode}</p>
                    <p className="w-full body-02 md:body-01 text-left md:text-right font-[500]">Order Status: {trackedOrder.status}</p>
                </div>

                {/* Customer information */}
                <div className="flex flex-col gap-2">
                    <p className="body-03 md:body-02 uppercase font-[500]">-/ Customer Information</p>
                    <p className="body-02 md:body-02 "><span className='font-[500]'>Name:</span> {trackedOrder.customerName}</p>
                    <p className="body-02 md:body-02 break-all"><span className='font-[500]'>Email:</span> {trackedOrder.customerEmail}</p>
                </div>

                {/* Order items */}
                {orderItems && orderItems.length > 0 && (
                    <div className="flex flex-col gap-2">
                        <p className="body-03 md:body-02 uppercase font-[500]">-/ Items Ordered</p>
                        <div className="flex flex-col gap-2">
                            {orderItems.map((item, index) => (
                                <div
                                    key={index}
                                    className="flex justify-between items-start pb-2 gap-2"
                                >
                                    <div className="flex-1 flex flex-col gap-1">
                                        <p className="body-03 md:body-02  line-clamp-2 font-[500]">
                                            {item.Product?.productName || `Product #${item.productId}`}
                                        </p>
                                        <p className="body-03">
                                            Quantity: {item.quantity}
                                        </p>
                                    </div>
                                    <p className="body-03 md:body-03  whitespace-nowrap font-[500]">
                                        ${parseFloat(item.priceAtPurchase || 0).toFixed(2)}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Total amount */}
                <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-center pt-2 border-t-[0.25px] border-[#272727]">
                        <p className="body-02 md:body-02 font-[500]">Total Amount</p>
                        <p className="body-02 md:body-02 font-[500]">
                            ${parseFloat(trackedOrder.totalPrice || 0).toFixed(2)}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
