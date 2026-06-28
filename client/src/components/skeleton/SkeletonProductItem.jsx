'use client'

import { SkeletonImage } from './SkeletonImage';
import { SkeletonText } from './SkeletonText';

export const SkeletonProductItem = ({ className = '' }) => {
    return (
        <div className={`w-full h-fit padding-wide ${className}`}>
            <div className="grid grid-cols-1 xl:grid-cols-[1fr_1fr] gap-10 xl:gap-20">
                {/* Left Column - Images */}
                <div className="w-full flex flex-col md:flex-row justify-between gap-2">
                    {/* Main Image */}
                    <SkeletonImage width="flex-1" height="h-96" />

                    {/* Thumbnails */}
                    <div className="h-full flex flex-row md:flex-col justify-start gap-2 md:gap-3 xl:gap-4">
                        {Array.from({ length: 4 }).map((_, index) => (
                            <SkeletonImage
                                key={index}
                                width="w-[70px]"
                                height="h-[70px]"
                            />
                        ))}
                    </div>
                </div>

                {/* Right Column - Product Details */}
                <div className="flex flex-col justify-between gap-4 md:gap-6 overflow-hidden">
                    {/* Title */}
                    <SkeletonText lines={1} height="h-8" width="w-3/4" />

                    {/* Description */}
                    <SkeletonText lines={3} height="h-3" width="w-full" />

                    <div className="opacity-20 h-[0.25px] bg-[#272727]"></div>

                    {/* Specs */}
                    <div className="flex flex-col gap-3">
                        <SkeletonText lines={1} height="h-4" width="w-1/3" />
                        <SkeletonText lines={4} height="h-3" width="w-full" />
                    </div>

                    {/* Stock & Price */}
                    <div className="flex flex-col gap-4">
                        <SkeletonText lines={1} height="h-4" width="w-1/4" />
                        <SkeletonText lines={1} height="h-10" width="w-full" />
                    </div>
                </div>
            </div>
        </div>
    );
};
