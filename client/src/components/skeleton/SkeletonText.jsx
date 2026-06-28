'use client'

export const SkeletonText = ({ lines = 1, height = 'h-4', width = 'w-full', className = '' }) => {
    return (
        <div className={`flex flex-col gap-2 ${className}`}>
            {Array.from({ length: lines }).map((_, index) => (
                <div
                    key={index}
                    className={`${height} ${width} rounded-none bg-gradient-to-r from-[#EEEEEE] via-[#E0E0E0] to-[#EEEEEE] bg-[length:200%_100%] animate-pulse`}
                />
            ))}
        </div>
    );
};
