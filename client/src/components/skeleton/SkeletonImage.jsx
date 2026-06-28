'use client'

export const SkeletonImage = ({ width = 'w-full', height = 'h-64', className = '' }) => {
    return (
        <div
            className={`${width} ${height} rounded-none bg-gradient-to-r from-[#EEEEEE] via-[#E0E0E0] to-[#EEEEEE] bg-[length:200%_100%] animate-pulse ${className}`}
        />
    );
};
