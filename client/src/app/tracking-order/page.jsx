'use client'

import { motion } from 'framer-motion';
import { useState } from 'react';
import { getOrderByOrderCode, getOrderItemByOrderId } from '@/api/order';
import { Navbar } from '@/components/common/navigation/Navbar';
import { TrackingForm, TrackingOrderDetails } from '@/components/layout/tracking';
import { trackingHeaderContainerVariants, trackingHeaderTitleVariants, trackingHeaderDescriptionVariants, trackingFormContainerVariants, trackingDetailsContainerVariants } from '@/framer/trackingOrderMotion';
import { SkeletonTrackingOrder } from '@/components/skeleton';

export default function TrackingOrderPage() {
    const [trackingCode, setTrackingCode] = useState('');
    const [trackedOrder, setTrackedOrder] = useState(null);
    const [orderItems, setOrderItems] = useState([]);
    const [trackingLoading, setTrackingLoading] = useState(false);
    const [trackingError, setTrackingError] = useState('');

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
                try {
                    const itemsData = await getOrderItemByOrderId(data.data.id);
                    if (itemsData.success) {
                        setOrderItems(itemsData.data);
                    }
                } catch (itemsErr) {
                    console.error('Failed to fetch order items:', itemsErr);
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

    return (
        <div className="w-full min-h-screen flex flex-col items-center justify-between">
            <Navbar />
            <main className="w-full h-[90vh] flex items-center justify-center padding-wide py-6 md:py-10">
                <div className="w-full max-w-[900px] flex flex-col items-center gap-4 md:gap-5">

                    {/* Title section */}
                    <motion.div
                        className='flex flex-col items-center justify-center gap-2'
                        variants={trackingHeaderContainerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.5 }}
                    >
                        <motion.h1
                            className=" text-center"
                            variants={trackingHeaderTitleVariants}
                        >
                            Track Your Order
                        </motion.h1>
                        <motion.p
                            className="body-03 md:body-02  text-center"
                            variants={trackingHeaderDescriptionVariants}
                        >
                            Enter your order code above to track your order
                        </motion.p>
                    </motion.div>

                    {/* Tracking form */}
                    <motion.div
                        variants={trackingFormContainerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.5 }}
                        className="w-full flex justify-center"
                    >
                        <TrackingForm
                            trackingCode={trackingCode}
                            setTrackingCode={setTrackingCode}
                            handleTrackingSubmit={handleTrackingSubmit}
                            trackingLoading={trackingLoading}
                            trackingError={trackingError}
                        />
                    </motion.div>

                    {/* Order details */}
                    {trackingLoading && trackedOrder === null ? (
                        <SkeletonTrackingOrder />
                    ) : (
                        <motion.div
                            variants={trackingDetailsContainerVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, amount: 0.5 }}
                            className="w-full flex justify-center"
                        >
                            <TrackingOrderDetails
                                trackedOrder={trackedOrder}
                                orderItems={orderItems}
                            />
                        </motion.div>
                    )}
                </div>
            </main>
        </div>
    );
}
