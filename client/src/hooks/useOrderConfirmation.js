'use client'

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getOrderById } from '@/api/order';

export const useOrderConfirmation = () => {
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

    return {
        order,
        loading,
        error
    };
};
