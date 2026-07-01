'use client'

import { AnimatePresence, motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState, useCallback, useMemo } from 'react';
import { AiOutlineClose } from "react-icons/ai";
import { PiTrashSimple } from "react-icons/pi";
import { useRouter } from 'next/navigation';
import { decreaseQuantity, increaseQuantity, removeFromCart } from '@/redux/cartSlice';

export const CartModal = ({ isOpen, onClose }) => {
    const [mounted, setMounted] = useState(false);
    const cartItems = useSelector((state) => state.cart.items);
    const totalQuantity = useSelector((state) => state.cart.totalQuantity);

    const dispatch = useDispatch();
    const router = useRouter();

    const handleBrowseBoutiques = useCallback(() => {
        router.push('/products');
    }, [router]);

    const handleCheckout = useCallback(() => {
        onClose();
        router.push('/checkout');
    }, [router, onClose]);

    const handleDecreaseQuantity = useCallback((itemId) => {
        dispatch(decreaseQuantity(itemId));
    }, [dispatch]);

    const handleIncreaseQuantity = useCallback((itemId, stock) => {
        dispatch(increaseQuantity({ id: itemId, stock }));
    }, [dispatch]);

    const handleRemoveFromCart = useCallback((itemId) => {
        dispatch(removeFromCart(itemId));
    }, [dispatch]);

    useEffect(() => {
        setMounted(true);
    }, []);

    /*useEffect(() => {
        // Lock body scroll when modal is open
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);*/

    if (!mounted) return null;

    // Calculate totals
    const subtotal = useMemo(() => {
        return cartItems.reduce((sum, item) => {
            const itemPrice = parseFloat(item.price || 0);
            const itemQuantity = item.quantity || 0;
            return sum + (itemPrice * itemQuantity);
        }, 0);
    }, [cartItems]);

    const total = useMemo(() => subtotal, [subtotal]);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        key="backdrop"
                        className="fixed inset-0 bg-black/20 z-[1000]"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                    />

                    {/* Cart Modal */}
                    <motion.div
                        key="cart"
                        className="fixed w-full h-screen top-0 right-0 md:right-2 md:top-2 xl:right-2 xl:top-2 h-[100vh] md:h-[98vh] md:w-[50vw] xl:w-[28vw] bg-background-primary z-[1001] flex flex-col overflow-hidden rounded-none md:rounded-md xl:rounded-lg"
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'easeIn' }}
                    >
                        {/* Header */}
                        <div className="flex flex-row justify-end items-center  pt-4 px-4">

                            <button
                                onClick={onClose}
                            >
                                <AiOutlineClose size={14} className='cursor pointer' />
                            </button>
                        </div>

                        {/* Cart Items */}
                        <div className="h-full flex-1 overflow-y-auto no-scrollbar p-4 flex flex-col justify-start gap-4">
                            {cartItems.length === 0 ? (
                                <div className='h-full flex flex-col items-center justify-center gap-2'>
                                    <img src='/common/sofa-shadow.svg' className='w-50vw' loading="lazy" / >
                                    <p className="font-display-regular flex items-center justify-center body-03">
                                        Cart empty
                                    </p>
                                </div>
                            ) : (
                                cartItems.map((item) => {
                                    // Check stock validation
                                    const itemStock = item.stock || 0;
                                    const isStockExceeded = item.quantity >= itemStock;
                                    const isIncreaseDisabled = itemStock <= 0 || isStockExceeded;

                                    return (
                                    <div key={item.id} className="flex flex-col justfy-between border-b-[0.25px] border-[#272727]/10">
                                        <div className='flex flex-col gap-4 mb-2'>

                                            {/* Product Image */}
                                            <div className="w-full h-full overflow-hidden">
                                                <img
                                                    src={item.imageUrl}
                                                    alt={item.name}
                                                    className="w-full h-full object-cover"
                                                    loading="lazy"
                                                />
                                            </div>

                                            <div className='flex flex-row justify-between'>


                                                {/* Product Name & Price */}
                                                <div className="flex flex-col justify-between items-start gap-2">
                                                    <div className='flex flex-col gap-1'>
                                                        <p className="body-01 font-display-semibold flex-1">
                                                            {item.name}
                                                        </p>
                                                        <p className="body-03 font-display-semibold  line-clamp-2 flex-1">
                                                            Quantity: {item.quantity}
                                                        </p>
                                                    </div>
                                                    
                                                    {isIncreaseDisabled && (
                                                        <p className="body-03 font-display-regular" style={{ color: 'var(--color-error)' }}>
                                                            Cannot exceed available stock.
                                                        </p>
                                                    )}
                                                    {/* Quantity Control */}
                                                    <div className="flex flex-row items-center border-[0.25px] border-[#272727]/10">
                                                        <button className="px-2 py-0.5 body-03 text-display-regular" onClick={() => handleDecreaseQuantity(item.id)}>
                                                            -
                                                        </button>
                                                        <span className="px-2 py-0.5 body-03 text-display-regular">
                                                            {item.quantity}
                                                        </span>
                                                        <button
                                                            disabled={isIncreaseDisabled}
                                                            className={`px-2 py-0.5 body-03 text-display-regular ${isIncreaseDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                                                            onClick={() => handleIncreaseQuantity(item.id, item.stock)}
                                                        >
                                                            +
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Quantity & Total Price */}
                                                <div className="flex flex-col justify-between items-end">

                                                    <button
                                                        onClick={() => handleRemoveFromCart(item.id)}
                                                        className="flex-shrink-0"
                                                    >
                                                        <PiTrashSimple size={14} />
                                                    </button>
                                                    {/* Price */}
                                                    <p className="body-02 font-display-semibold">
                                                        {(parseFloat(item.price || 0) * item.quantity)}$
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    );
                                })
                            )}
                        </div>

                        <hr className='opacity-10'></hr>

                        {/* Summary */}
                        <div className="p-4 flex flex-col gap-4">

                            {/* Total */}
                            <div className="flex flex-row justify-between items-center">
                                <p className="font-display-semibold body-01">Quantity:</p>
                                <p className="font-display-semibold body-01">
                                    {totalQuantity}
                                </p>
                            </div>

                            {/* Total */}
                            <div className="flex flex-row justify-between items-center">
                                <p className="font-display-semibold body-01">Total:</p>
                                <p className="font-display-semibold body-01">
                                    {total}$
                                </p>
                            </div>

                            {!totalQuantity ? (
                                <button onClick={handleBrowseBoutiques} className="w-full bg-black body-02 text-third font-display-semibold py-2 uppercase">
                                    Browse Boutiques
                                </button>
                            ) : (
                                <button onClick={handleCheckout} className="w-full bg-black body-02 text-third font-display-semibold py-2 uppercase">
                                    Check out - {total}$
                                </button>
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};
