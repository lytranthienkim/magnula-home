'use client'

import { motion } from 'framer-motion';
import { useTrackingOrder } from '@/hooks/useTrackingOrder';
import { Navbar } from '@/components/common/navigation/Navbar';
import { Footer } from '@/components/common/navigation/Footer';
import { TrackingForm, TrackingOrderDetails } from '@/components/layout/tracking';
import { trackingHeaderContainerVariants, trackingHeaderTitleVariants, trackingHeaderDescriptionVariants, trackingFormContainerVariants, trackingDetailsContainerVariants } from '@/framer/trackingOrderMotion';
import { SkeletonTrackingOrder } from '@/components/skeleton';

export default function TrackingOrderPage() {
    const {
        trackingCode,
        setTrackingCode,
        trackedOrder,
        orderItems,
        trackingLoading,
        trackingError,
        handleTrackingSubmit
    } = useTrackingOrder();

    return (
        <div className="w-full min-h-screen flex flex-col items-center justify-between">
            <Navbar />
            <main className="w-full h-[90vh] flex items-center justify-center padding-wide py-6 md:py-10">
                <div className="w-full max-w-[900px] flex flex-col items-center gap-4 md:gap-5">

                    {/* Title Section */}
                    <motion.div
                        className='flex flex-col items-center justify-center gap-2'
                        variants={trackingHeaderContainerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.5 }}
                    >
                        <motion.h1
                            className="h2-neu md:h1-neu font-display-semibold text-center"
                            variants={trackingHeaderTitleVariants}
                        >
                            Track Your Order
                        </motion.h1>
                        <motion.p
                            className="body-03 md:body-02 font-display-regular text-center"
                            variants={trackingHeaderDescriptionVariants}
                        >
                            Enter your order code above to track your order
                        </motion.p>
                    </motion.div>

                    {/* Tracking Form */}
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

                    {/* Order Details */}
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
            <Footer />
        </div>
    );
}
