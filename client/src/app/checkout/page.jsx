'use client'

import { useCheckout } from '@/hooks/useCheckout';
import { CheckoutForm } from '@/components/layout/checkout/CheckoutForm';
import { CheckoutSummary } from '@/components/layout/checkout/CheckoutSummary';
import { Navbar } from '@/components/common/navigation/Navbar';
import { Footer } from '@/components/common/navigation/Footer';

export default function CheckoutPage() {
    const { cartItems, cartTotal, isLoading, error, handleCheckoutSubmit } = useCheckout();

    return (
        <div className="w-full min-h-screen flex flex-col">
            <Navbar />
            <main className='padding-wide'>

                {/* Main Content Grid - Hidden on Mobile */}
                <div className="hidden lg:grid lg:grid-cols-[1fr_0.5px_350px] gap-10 lg:gap-16">
                    {/* Left Column - Checkout Form */}
                    <div>
                        <CheckoutForm onSubmit={handleCheckoutSubmit} isLoading={isLoading} error={error} cartItems={cartItems} />
                    </div>

                    {/* Divider */}
                    <div className='h-full w-[0.25px] bg-[#272727] opacity-20'></div>

                    {/* Right Column - Order Summary */}
                    <div>
                        <CheckoutSummary />
                    </div>
                </div>

                {/* Mobile Layout - Show only on mobile */}
                <div className='lg:hidden flex flex-col gap-6'>
                    <CheckoutForm onSubmit={handleCheckoutSubmit} isLoading={isLoading} error={error} cartItems={cartItems} />
                </div>

                {/* Mobile Cart Items Preview - Show only on mobile */}
                <div className='lg:hidden mt-10 flex flex-col gap-4'>
                    <h2 className="font-display-semibold body-01 uppercase">Order Items</h2>

                    {/* Horizontal Scroll Cart Items */}
                    <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                        {cartItems.length === 0 ? (
                            <p className="body-02 font-display-regular text-gray-500">No items in cart</p>
                        ) : (
                            cartItems.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex-shrink-0 w-[140px] flex flex-col gap-2"
                                >
                                    {/* Product Image */}
                                    <div className="w-full aspect-square bg-gray-100 overflow-hidden rounded-none">
                                        <img
                                            src={item.imageUrl}
                                            alt={item.name}
                                            className="w-full h-full object-cover"
                                            loading="lazy"
                                        />
                                    </div>

                                    {/* Product Info */}
                                    <div className="flex flex-col gap-1">
                                        <p className="body-03 font-display-semibold truncate">
                                            {item.name}
                                        </p>
                                        <p className="body-03 font-display-regular text-gray-600">
                                            x{item.quantity}
                                        </p>
                                        <p className="body-03 font-display-semibold">
                                            ${(parseFloat(item.price || 0) * item.quantity).toFixed(2)}
                                        </p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Mobile Summary */}
                    <div className="flex flex-col gap-4 mt-6 p-4 border-t-[0.25px] border-[#272727]">
                        <div className="flex justify-between items-center">
                            <p className="font-display-semibold body-01">Total:</p>
                            <p className="font-display-semibold body-01">
                                ${cartTotal}
                            </p>
                        </div>
                    </div>
                </div>
            </main>
            <Footer/>
        </div>
    );
}
