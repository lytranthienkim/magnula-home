'use client'

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { generateSlug } from "@/helper/slug";

export const ProductCard = ({ product, imageSize }) => {
    const router = useRouter();
    const [currentImage, setCurrentImage] = useState(product.images?.[0]?.imageUrl || '');

    const handleProductClick = useCallback(() => {
        const slug = generateSlug(product.productName);
        router.push(`/products/${slug}`);
    }, [product.productName, router]);

    const handleMouseEnter = useCallback(() => {
        if (product.images && product.images.length > 1) {
            setCurrentImage(product.images[1].imageUrl);
        }
    }, [product.images]);

    const handleMouseLeave = useCallback(() => {
        setCurrentImage(product.images?.[0]?.imageUrl || '');
    }, [product.images]);

    return (
        <div className="flex flex-col items-center justify-start gap-4 overflow-hidden">
            <img
                src={currentImage}
                alt={product.productName}
                className="object-cover cursor-pointer"
                style={{ width: `${imageSize}px`, height: `${imageSize}px` }}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onClick={handleProductClick}
                loading="lazy"
            />
            <div className="flex flex-col items-center justify-center gap-1" style={{ width: `${imageSize}px` }}>
                <p className="body-03 font-display-semibold truncate">{product.productName}</p>
                <p className="body-03 font-display-regular">${parseFloat(product.variants?.[0]?.price)}</p>
            </div>
        </div>
    )
};