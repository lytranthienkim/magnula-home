'use client'

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { createOrder } from '@/api/order';
import { clearCart } from '@/redux/cartSlice';

export const useCheckout = () => {
    const router = useRouter();
    const dispatch = useDispatch();
    const cartItems = useSelector((state) => state.cart.items);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const cartTotal = useMemo(() => {
        return cartItems.reduce((sum, item) => sum + (parseFloat(item.price || 0) * item.quantity), 0).toFixed(2);
    }, [cartItems]);

    const handleCheckoutSubmit = async (formData) => {
        setIsLoading(true);
        setError('');

        try {
            // Map cart items to order items format
            const orderItems = cartItems.map(item => ({
                productVariantId: item.productVariantId,
                quantity: item.quantity,
            }));

            const orderData = {
                ...formData,
                items: orderItems,
                paymentMethodId: formData.paymentMethodId || null,
            };

            const response = await createOrder(orderData);

            if (response.success) {
                // Clear cart and redirect to order confirmation
                dispatch(clearCart());
                router.push(`/order-confirmation?orderCode=${response.data.orderCode}&orderId=${response.data.orderId}`);
            } else {
                setError(response.error || 'Failed to create order');
            }
        } catch (err) {
            // Extract error message from API response (for stock validation errors)
            const errorMessage = err.response?.data?.error || err?.error || err?.message || 'An error occurred during checkout';
            setError(errorMessage);
            console.error('Checkout error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    return {
        cartItems,
        cartTotal,
        isLoading,
        error,
        handleCheckoutSubmit,
        setError
    };
};
