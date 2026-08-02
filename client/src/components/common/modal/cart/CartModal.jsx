'use client'

import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import { useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { CloseButton } from '@/components/common/button/CloseButton';
import { DecreaseQuantityButton } from '@/components/common/button/DecreaseQuantityButton';
import { IncreaseQuantityButton } from '@/components/common/button/IncreaseQuantityButton';
import { RemoveCartButton } from '@/components/common/button/RemoveCartButton';
import { CartActionButton } from '@/components/common/button/CartActionButton';
import { useCartActions } from '@/hooks/useCartActions';

export const CartModal = ({ isOpen, onClose }) => {
    const cartItems = useSelector((state) => state.cart.items);
    const totalQuantity = useSelector((state) => state.cart.totalQuantity);

    const router = useRouter();
    const { handleDecreaseQuantity, handleIncreaseQuantity, handleRemoveFromCart } = useCartActions();

    const handleBrowseBoutiques = useCallback(() => {
        router.push('/products');
    }, [router]);

    const handleCheckout = useCallback(() => {
        onClose();
        router.push('/checkout');
    }, [router, onClose]);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

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
                    {/* Backdrop overlay */}
                    <motion.div
                        key="backdrop"
                        className="fixed inset-0 bg-transparent md:bg-black/5 z-[1000]"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                    />

                    {/* Modal container */}
                    <motion.div
                        key="cart"
                        className="fixed w-full h-[100dvh] top-0 right-0 md:right-2 md:top-2 xl:right-2 xl:top-2  md:h-[98vh] md:w-[50vw] xl:w-[28vw] bg-background-primary z-[1001] flex flex-col overflow-hidden rounded-none md:rounded-md xl:rounded-lg"
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'easeIn' }}
                    >
                        {/* Header bar */}
                        <div className="flex flex-row justify-between items-center  pt-4 px-4">
                            <h3 className='  text-left'>Cart</h3>
                            <CloseButton onClick={onClose} />
                        </div>

                        {/* Content area */}
                        <div className="h-full flex-1 overflow-y-auto no-scrollbar p-4 flex flex-col justify-start gap-4">
                            {cartItems.length === 0 ? (
                                <div className='h-full flex flex-col items-center justify-center gap-2'>
                                    {/* Placeholder */}
                                    <div className="relative w-full h-auto min-h-[300px]">
                                        <Image
                                            src='/common/sofa-shadow.svg'
                                            alt="Empty cart sofa"
                                            fill
                                            unoptimized
                                            className='object-contain'
                                        />
                                    </div>
                                    <p className=" flex items-center justify-center body-03">
                                        Cart empty
                                    </p>
                                </div>
                            ) : (
                                cartItems.map((item) => {
                                    const itemStock = item.stock || 0;
                                    const isStockExceeded = item.quantity >= itemStock;
                                    const isIncreaseDisabled = itemStock <= 0 || isStockExceeded;

                                    return (
                                        /* Cart item */
                                        <div key={item.id} className="flex flex-col justfy-between border-b-[0.25px] border-[#272727]/10">
                                            {/* Item content */}
                                            <div className='flex flex-col gap-4 mb-2'>
                                                <div className="relative w-full h-full min-h-[300px] overflow-hidden">
                                                    <Image
                                                        src={item.imageUrl}
                                                        alt={item.name || "Cart item"}
                                                        fill
                                                        unoptimized
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>

                                                {/* Details */}
                                                <div className='flex flex-row justify-between'>
                                                    <div className="flex flex-col justify-between items-start gap-2">
                                                        <div className='flex flex-col gap-1'>
                                                            <p className="body-01  flex-1">
                                                                {item.name}
                                                            </p>
                                                            {/* Item quantity */}
                                                            <p className="body-03   line-clamp-2 flex-1">
                                                                Quantity: {item.quantity}
                                                            </p>
                                                        </div>

                                                        {isIncreaseDisabled && (
                                                            /* Stock warning */
                                                            <p className="body-03 " style={{ color: 'var(--color-error)' }}>
                                                                Cannot exceed available stock.
                                                            </p>
                                                        )}

                                                        <div className="flex flex-row items-center border-[0.25px] border-[#272727]/10">
                                                            <DecreaseQuantityButton onClick={() => handleDecreaseQuantity(item.id)} />
                                                            <span className="px-2 py-0.5 body-03 text-display-regular">
                                                                {item.quantity}
                                                            </span>
                                                            <IncreaseQuantityButton
                                                                disabled={isIncreaseDisabled}
                                                                onClick={() => handleIncreaseQuantity(item.id, item.stock)}
                                                            />
                                                        </div>
                                                    </div>

                                                    {/* Right column */}
                                                    <div className="flex flex-col justify-between items-end">
                                                        <RemoveCartButton onClick={() => handleRemoveFromCart(item.id)} />
                                                        <p className="body-02 ">
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

                        {/* Footer */}
                        <div className="p-4 flex flex-col gap-4">

                            {/* Quantity summary */}
                            <div className="flex flex-row justify-between items-center">
                                <p className=" body-01">Quantity:</p>
                                <p className=" body-01">
                                    {totalQuantity}
                                </p>
                            </div>

                            {/* Total summary */}
                            <div className="flex flex-row justify-between items-center">
                                <p className=" body-01">Total:</p>
                                <p className=" body-01">
                                    {total}$
                                </p>
                            </div>

                            {!totalQuantity ? (
                                <CartActionButton label="Browse Boutiques" onClick={handleBrowseBoutiques} />
                            ) : (
                                <CartActionButton label={`Check out - ${total}$`} onClick={handleCheckout} />
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};