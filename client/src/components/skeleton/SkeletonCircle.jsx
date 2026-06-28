'use client'

export const SkeletonCircle = ({ size = 'w-12 h-12', className = '' }) => {
    return (
        <div
            className={`${size} rounded-full bg-gradient-to-r from-[#EEEEEE] via-[#E0E0E0] to-[#EEEEEE] bg-[length:200%_100%] animate-pulse ${className}`}
        />
    );
};
