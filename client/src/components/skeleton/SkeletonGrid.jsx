'use client'

import { SkeletonCard } from './SkeletonCard';

export const SkeletonGrid = ({ count = 6, columns = 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' }) => {
    return (
        <div className={`grid ${columns} gap-4 md:gap-6`}>
            {Array.from({ length: count }).map((_, index) => (
                <SkeletonCard key={index} />
            ))}
        </div>
    );
};
