'use client'

import { SkeletonText } from './SkeletonText';
import { SkeletonImage } from './SkeletonImage';

export const SkeletonOrderConfirmation = ({ className = '' }) => {
    return (
        <div className={`w-full max-w-[700px] mx-auto ${className}`}>
            {/* Title */}
            <SkeletonText lines={1} height="h-8" width="w-1/2" className="mb-12" />

            {/* Order Details */}
            <div className="flex flex-col gap-6 border-[0.25px] border-[#272727] p-4 md:p-6">
                {/* Order Code & Status */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <SkeletonText lines={1} height="h-5" width="w-1/2" />
                    <SkeletonText lines={1} height="h-5" width="w-1/3" />
                </div>

                {/* Customer Info */}
                <div className="flex flex-col gap-3">
                    <SkeletonText lines={1} height="h-4" width="w-1/4" />
                    <SkeletonText lines={3} height="h-3" width="w-3/4" />
                </div>

                {/* Divider */}
                <div className="h-[0.25px] bg-[#272727] opacity-20"></div>

                {/* Order Items */}
                <div className="flex flex-col gap-4">
                    <SkeletonText lines={1} height="h-4" width="w-1/4" />
                    {Array.from({ length: 2 }).map((_, index) => (
                        <div key={index} className="flex gap-4 pb-4 border-b-[0.25px] border-[#272727] last:border-b-0">
                            <SkeletonImage width="w-24" height="h-24" />
                            <div className="flex-1 flex flex-col gap-2">
                                <SkeletonText lines={1} height="h-4" width="w-3/4" />
                                <SkeletonText lines={2} height="h-3" width="w-full" />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Divider */}
                <div className="h-[0.25px] bg-[#272727] opacity-20"></div>

                {/* Totals */}
                <div className="flex flex-col gap-3">
                    <div className="flex justify-between">
                        <SkeletonText lines={1} height="h-3" width="w-1/4" />
                        <SkeletonText lines={1} height="h-3" width="w-1/4" />
                    </div>
                    <div className="flex justify-between">
                        <SkeletonText lines={1} height="h-4" width="w-1/4" />
                        <SkeletonText lines={1} height="h-4" width="w-1/4" />
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-col gap-3">
                <SkeletonText lines={1} height="h-10" width="w-full" />
                <SkeletonText lines={1} height="h-10" width="w-full" />
            </div>
        </div>
    );
};
