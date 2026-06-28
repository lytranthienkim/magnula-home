'use client'

import { SkeletonText } from './SkeletonText';
import { SkeletonImage } from './SkeletonImage';

export const SkeletonCheckout = ({ className = '' }) => {
    return (
        <div className={`w-full ${className}`}>
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_1px_1fr] gap-4 md:gap-6">
                {/* Left - Checkout Form */}
                <div className="flex flex-col gap-4 md:gap-6">
                    {/* Section Title */}
                    <SkeletonText lines={1} height="h-6" width="w-1/3" />

                    {/* Form Fields */}
                    <div className="flex flex-col gap-3">
                        <SkeletonText lines={1} height="h-3" width="w-1/4" />
                        <SkeletonText lines={1} height="h-10" width="w-full" />
                    </div>

                    <div className="flex flex-col gap-3">
                        <SkeletonText lines={1} height="h-3" width="w-1/4" />
                        <SkeletonText lines={1} height="h-10" width="w-full" />
                    </div>

                    <div className="grid grid-cols-2 gap-3 md:gap-4">
                        <div className="flex flex-col gap-3">
                            <SkeletonText lines={1} height="h-3" width="w-1/2" />
                            <SkeletonText lines={1} height="h-10" width="w-full" />
                        </div>
                        <div className="flex flex-col gap-3">
                            <SkeletonText lines={1} height="h-3" width="w-1/2" />
                            <SkeletonText lines={1} height="h-10" width="w-full" />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <SkeletonText lines={1} height="h-12" width="w-full" />
                </div>

                {/* Divider */}
                <div className="hidden lg:block w-[1px] bg-[#272727]/10"></div>

                {/* Right - Order Summary */}
                <div className="flex flex-col gap-4 md:gap-6">
                    {/* Section Title */}
                    <SkeletonText lines={1} height="h-6" width="w-1/3" />

                    {/* Items */}
                    <div className="flex flex-col gap-4">
                        {Array.from({ length: 3 }).map((_, index) => (
                            <div key={index} className="flex gap-3">
                                <SkeletonImage width="w-20" height="h-20" />
                                <div className="flex-1 flex flex-col gap-2">
                                    <SkeletonText lines={1} height="h-3" width="w-3/4" />
                                    <SkeletonText lines={1} height="h-3" width="w-1/2" />
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Total */}
                    <div className="flex flex-col gap-3 pt-3 border-t-[0.25px] border-[#272727]">
                        <SkeletonText lines={1} height="h-4" width="w-1/2" />
                        <SkeletonText lines={1} height="h-5" width="w-1/3" />
                    </div>
                </div>
            </div>
        </div>
    );
};
