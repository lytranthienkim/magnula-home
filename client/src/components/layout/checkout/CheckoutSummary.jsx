'use client'

import { useSelector } from 'react-redux';
import { useMemo } from 'react';

export const CheckoutSummary = () => {
    const cartItems = useSelector((state) => state.cart.items);
    const totalQuantity = useSelector((state) => state.cart.totalQuantity);

    const subtotal = useMemo(() => {
        return cartItems.reduce((sum, item) => {
            const itemPrice = parseFloat(item.price || 0);
            const itemQuantity = item.quantity || 0;
            return sum + (itemPrice * itemQuantity);
        }, 0);
    }, [cartItems]);

    const total = useMemo(() => subtotal, [subtotal]);

    return (
        <div className="h-screen sticky top-0 flex flex-col justify-start gap-6">

            {/* Items List */}
            <div className="flex flex-col gap-4  overflow-y-auto no-scrollbar">
                {
                    cartItems.map((item) => (
                        <div key={item.id} className="flex flex-col gap-3 pb-4">
                            {/* Product Image */}
                            <div className="w-full overflow-hidden">
                                <img
                                    src={item.imageUrl || ''}
                                    alt={item.name}
                                    className="w-full h-full object-cover"
                                    loading="lazy"
                                />
                            </div>

                            {/* Product Info */}
                            <div className="flex flex-col justify-between flex-1 gap-2">
                                <p className="body-02 font-display-semibold line-clamp-2">
                                    {item.name}
                                </p>
                                <div className='flex flex-row items-center justify-between'>

                                    <p className="body-03 font-display-regular">
                                        Quantity: {item.quantity}
                                    </p>
                                    <p className="body-03 font-display-semibold">
                                        ${(parseFloat(item.price || 0) * item.quantity)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))
                }
            </div>

            <hr className='border-t-[0.25px] border-[#272727]/40'></hr>

            {/* Summary Totals */}
            <div className="flex flex-col gap-2">
                {/* Subtotal */}
                <div className="flex flex-row justify-between items-center">
                    <p className="body-02 font-display-regular">Quantiy:</p>
                    <p className="body-02 font-display-regular">
                        {totalQuantity}
                    </p>
                </div>

                {/* Subtotal */}
                <div className="flex flex-row justify-between items-center">
                    <p className="body-02 font-display-regular">Shipping fee:</p>
                    <p className="body-02 font-display-regular">
                        Excluded
                    </p>
                </div>

                {/* Total */}
                <div className="flex flex-row justify-between items-center pt-2 ">
                    <p className="font-display-semibold body-01">Total:</p>
                    <p className="font-display-semibold body-01">
                        ${total}
                    </p>
                </div>
            </div>
        </div>
    );
};
