'use client'

import { useRouter } from 'next/navigation';

export const OrderConfirmationActions = () => {
    const router = useRouter();

    return (
        <div className="flex flex-col gap-3">
            <button
                onClick={() => router.push('/products')}
                className="w-full bg-black text-third body-02 font-display-semibold py-3 rounded-none cursor-pointer"
            >
                Continue Shopping
            </button>
            <button
                onClick={() => router.push('/tracking-order')}
                className="w-full border-[0.25px] border-[#272727] body-02 font-display-semibold py-3 rounded-none cursor-pointer"
            >
                Track Order
            </button>
            <button
                onClick={() => router.push('/')}
                className="w-full border-[0.25px] border-[#272727] body-02 font-display-semibold py-3 rounded-none cursor-pointer"
            >
                Back to Home
            </button>
        </div>
    );
};
