'use client'

import { useState } from 'react';
import { getOrderByOrderCode, getOrderItemByOrderId } from '@/api/order';

export const useTrackingOrder = () => {
    const [trackingCode, setTrackingCode] = useState('');
    const [trackedOrder, setTrackedOrder] = useState(null);
    const [orderItems, setOrderItems] = useState([]);
    const [trackingLoading, setTrackingLoading] = useState(false);
    const [trackingError, setTrackingError] = useState('');

    // Handle tracking form submission
    const handleTrackingSubmit = async (e) => {
        e.preventDefault();
        setTrackingLoading(true);
        setTrackingError('');
        setTrackedOrder(null);
        setOrderItems([]);

        try {
            const data = await getOrderByOrderCode(trackingCode);
            if (data.success) {
                setTrackedOrder(data.data);

                // Fetch order items
                try {
                    const itemsData = await getOrderItemByOrderId(data.data.id);
                    if (itemsData.success) {
                        setOrderItems(itemsData.data);
                    }
                } catch (itemsErr) {
                    console.error('Failed to fetch order items:', itemsErr);
                    // Continue without items if fetch fails
                }
            } else {
                setTrackingError('Order code not found. Please check and try again.');
            }
        } catch (err) {
            setTrackingError('Order code not found. Please check and try again.');
            console.error(err);
        } finally {
            setTrackingLoading(false);
        }
    };

    return {
        trackingCode,
        setTrackingCode,
        trackedOrder,
        orderItems,
        trackingLoading,
        trackingError,
        handleTrackingSubmit
    };
};
