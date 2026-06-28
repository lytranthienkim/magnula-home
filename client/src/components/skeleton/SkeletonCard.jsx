'use client'

import { SkeletonImage } from './SkeletonImage';
import { SkeletonText } from './SkeletonText';

export const SkeletonCard = ({ className = '' }) => {
    return (
        <div className={`flex flex-col gap-3 ${className}`}>
            {/* Image */}
            <SkeletonImage width="w-full" height="h-48" />

            {/* Title */}
            <SkeletonText lines={1} height="h-5" width="w-3/4" />

            {/* Description */}
            <SkeletonText lines={2} height="h-3" width="w-full" />

            {/* Price */}
            <SkeletonText lines={1} height="h-5" width="w-1/3" />
        </div>
    );
};
