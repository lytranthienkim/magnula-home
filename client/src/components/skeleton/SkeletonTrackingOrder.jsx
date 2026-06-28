'use client'

import { SkeletonText } from './SkeletonText';

export const SkeletonTrackingOrder = ({ className = '' }) => {
    return (
        <div className={`w-full max-w-[900px] flex flex-col items-center gap-4 md:gap-5 ${className}`}>
            {/* Header */}
            <div className="flex flex-col items-center justify-center gap-2">
                <SkeletonText lines={1} height="h-8" width="w-1/2" />
                <SkeletonText lines={1} height="h-4" width="w-2/3" />
            </div>

            {/* Tracking Form */}
            <div className="w-full flex flex-col border-[0.25px] border-[#272727] p-4 md:p-6 gap-4">
                <SkeletonText lines={1} height="h-4" width="w-1/4" />
                <SkeletonText lines={1} height="h-10" width="w-full" />
            </div>

            {/* Order Details */}
            <div className="w-full flex flex-col items-center gap-1">
                <div className="w-full flex flex-col items-center justify-center gap-4 md:gap-6 border-[0.25px] border-[#272727] py-3 md:py-4 px-3 md:px-4">
                    {/* Order Code & Status */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4 w-full">
                        <SkeletonText lines={1} height="h-4" width="w-full" />
                        <SkeletonText lines={1} height="h-4" width="w-full" />
                    </div>

                    {/* Customer Info */}
                    <div className="flex flex-col gap-2 w-full">
                        <SkeletonText lines={1} height="h-3" width="w-1/3" />
                        <SkeletonText lines={3} height="h-3" width="w-full" />
                    </div>

                    {/* Items */}
                    <div className="flex flex-col gap-2 w-full">
                        <SkeletonText lines={1} height="h-3" width="w-1/3" />
                        {Array.from({ length: 2 }).map((_, index) => (
                            <SkeletonText key={index} lines={2} height="h-3" width="w-full" />
                        ))}
                    </div>

                    {/* Total */}
                    <div className="flex flex-col gap-2 pt-2 border-t-[0.25px] border-[#272727] w-full">
                        <SkeletonText lines={1} height="h-4" width="w-1/2" />
                    </div>
                </div>
            </div>
        </div>
    );
};
