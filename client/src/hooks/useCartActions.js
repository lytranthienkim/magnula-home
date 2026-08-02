'use client'

import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { decreaseQuantity, increaseQuantity, removeFromCart } from '@/redux/cartSlice';

export const useCartActions = () => {
    const dispatch = useDispatch();

    const handleDecreaseQuantity = useCallback((itemId) => {
        dispatch(decreaseQuantity(itemId));
    }, [dispatch]);

    const handleIncreaseQuantity = useCallback((itemId, stock) => {
        dispatch(increaseQuantity({ id: itemId, stock }));
    }, [dispatch]);

    const handleRemoveFromCart = useCallback((itemId) => {
        dispatch(removeFromCart(itemId));
    }, [dispatch]);

    return {
        handleDecreaseQuantity,
        handleIncreaseQuantity,
        handleRemoveFromCart
    };
};
