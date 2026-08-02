'use client'

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
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
        <article className="flex flex-col items-center justify-start gap-4 overflow-hidden">
            {/* Image container */}
            <div
                className="relative overflow-hidden cursor-pointer"
                style={{ width: `${imageSize}px`, height: `${imageSize}px` }}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onClick={handleProductClick}
            >
                {currentImage && (
                    <Image
                        src={currentImage}
                        alt={product.productName || "Product Image"}
                        fill
                        unoptimized
                        quality={100}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover transition-opacity duration-300"
                    />
                )}
            </div>

            {/* Product info */}
            <div className="flex flex-col items-center justify-center" style={{ width: `${imageSize}px` }}>
                <h4
                    onClick={handleProductClick}
                    className="body-01 font-medium truncate cursor-pointer"
                >
                    {product.productName}
                </h4>
                <p className="body-02">
                    ${parseFloat(product.variants?.[0]?.price || 0).toLocaleString()}
                </p>
            </div>
        </article>
    );
};