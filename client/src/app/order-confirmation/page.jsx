'use client'

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getOrderById } from '@/api/order';
import { Navbar } from '@/components/common/navigation/Navbar';
import { OrderConfirmationDetails, OrderConfirmationActions } from '@/components/layout/order';
import { Error } from '@/components/common/display/Error';
import { SkeletonOrderConfirmation } from '@/components/skeleton';

export default function OrderConfirmationPage() {
    const searchParams = useSearchParams();
    const orderId = searchParams.get('orderId');

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!orderId) {
            setError('Order not found');
            setLoading(false);
            return;
        }

        const fetchOrder = async () => {
            try {
                const data = await getOrderById(orderId);
                setOrder(data.data);
            } catch (err) {
                setError('Failed to fetch order details');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();
    }, [orderId]);

    const renderContent = () => {
        if (loading) {
            return <SkeletonOrderConfirmation />;
        }

        if (error || !order) {
            return <Error message={error || 'Order not found'} />;
        }

        return (
            <div className="max-w-[700px] mx-auto w-full">
                <h2 className="mb-6 text-center">
                    Order Confirmed
                </h2>
                <OrderConfirmationDetails order={order} />

                {/* Action container */}
                <div className="mt-8">
                    <OrderConfirmationActions />
                </div>
            </div>
        );
    };

    return (
        <div className="w-full min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1 padding-wide py-10 flex items-center justify-center">
                {renderContent()}
            </main>
        </div>
    );
}