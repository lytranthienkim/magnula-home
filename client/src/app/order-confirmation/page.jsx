'use client'

import { useOrderConfirmation } from '@/hooks/useOrderConfirmation';
import { Navbar } from '@/components/common/navigation/Navbar';
import { Footer } from '@/components/common/navigation/Footer';
import { OrderConfirmationDetails, OrderConfirmationActions } from '@/components/layout/order';
import { Error } from '@/components/common/display/Error';
import { SkeletonOrderConfirmation } from '@/components/skeleton';

export default function OrderConfirmationPage() {
    const { order, loading, error } = useOrderConfirmation();

    if (loading) {
        return (
            <div className="w-full min-h-screen flex flex-col">
                <Navbar />
                <main className="flex-1 padding-wide flex items-center justify-center">
                    <SkeletonOrderConfirmation />
                </main>
                <Footer />
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="w-full min-h-screen flex flex-col">
                <Navbar />
                <main className="flex-1 padding-wide flex items-center justify-center">
                    <Error message={error || 'Order not found'} />
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1 padding-wide py-10">
                <div className="max-w-[700px] mx-auto">
                    {/* Title */}
                    <h2 className="h2-neu font-display-semibold mb-6 text-center">
                        Order Confirmed
                    </h2>

                    {/* Order Details Component */}
                    <OrderConfirmationDetails order={order} />

                    {/* Action Buttons Component */}
                    <div className="mt-8">
                        <OrderConfirmationActions />
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
