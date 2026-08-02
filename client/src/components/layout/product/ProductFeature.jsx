'use client'

import { useParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { getAllProducts } from "@/api/products";
import { generateSlug } from "@/helper/slug";
import {
    productFeatureContainerVariants,
    productFeatureHeaderVariants,
    productFeatureImageVariants,
    carouselImageVariants,
} from "@/framer/productFeatureMotion";

export const ProductFeature = () => {
    const params = useParams();
    const slug = params.slug;

    const [product, setProduct] = useState(null);
    const [collectionImages, setCollectionImages] = useState([]);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const carouselRef = useRef(null);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                const response = await getAllProducts('');
                const foundProduct = response.data.find(p =>
                    generateSlug(p.productName) === slug
                );
                setProduct(foundProduct || null);

                if (foundProduct?.Collection?.images) {
                    setCollectionImages(foundProduct.Collection.images);
                } else if (foundProduct?.images) {
                    setCollectionImages(foundProduct.images);
                }
            } catch (error) {
                console.error('Failed to fetch product', error);
            } finally {
                setLoading(false);
            }
        };

        if (slug) fetchProduct();
    }, [slug]);

    if (loading || !product) return null;

    const handleCarouselScroll = (e) => {
        const width = e.currentTarget.offsetWidth;
        const index = Math.round(e.currentTarget.scrollLeft / width);
        setCurrentImageIndex(index);
    };

    return (
        /* Feature wrapper */
        <motion.div
            className="w-full h-fit flex flex-col padding-wide gap-3"
            variants={productFeatureContainerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
        >
            {/* Header section */}
            <motion.div className="flex flex-col items-center" variants={productFeatureHeaderVariants}>
                {/* Heading title */}
                <h2 className="max-w-[300px] md:max-w-full font-seasons-bold text-center">Designed to be <span className="font-seasons-italic">the heart</span> of your home</h2>
                {/* Subtitle text */}
                <p className="max-w-[300px] md:max-w-full body-02  text-center">
                    Bring quiet elegance, comfort, and balance into contemporary homes
                </p>
            </motion.div>

            {/* Grid layout */}
            <motion.div className="grid grid-cols-1 md:grid-cols-1 xl:grid-cols-2 gap-1 xl:gap-3" variants={productFeatureContainerVariants}>
                {/* Featured image */}
                <motion.img
                    variants={productFeatureImageVariants}
                    src='https://d1yei2z3i6k35z.cloudfront.net/14433334/6960da0ce8e2d_adptivecushionsdetail.png'
                    alt="Seating"
                    className="xl:w-full xl:h-full"
                    loading="lazy"
                />

                {/* Carousel container */}
                <motion.div className="relative w-full h-full" variants={productFeatureImageVariants}>
                    {/* Scroll track */}
                    <div
                        ref={carouselRef}
                        className="w-full h-full flex overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar"
                        onScroll={handleCarouselScroll}
                    >
                        {collectionImages.map((img, index) => (
                            /* Slide item */
                            <motion.div
                                key={index}
                                className="w-full h-full flex-shrink-0 snap-center no-scrollbar"
                                variants={carouselImageVariants}
                            >
                                {/* Slide image */}
                                <img
                                    src={img.imageUrl || ''}
                                    alt={`${index + 1}`}
                                    className="w-full h-full object-cover select-none"
                                    loading="lazy"
                                />
                            </motion.div>
                        ))}
                    </div>

                    {collectionImages.length > 1 && (
                        /* Indicator wrapper */
                        <div className="absolute bottom-2 md:bottom-3 xl:bottom-5 right-2 md:right-3 xl:right-5 flex gap-0.5 md:gap-1 z-10">
                            {collectionImages.map((_, index) => (
                                /* Indicator dot */
                                <div
                                    key={index}
                                    className={`h-0.5 transition-all duration-300 ${index === currentImageIndex
                                            ? 'w-5 bg-black/75'
                                            : 'w-3 bg-black/30'
                                        }`}
                                />
                            ))}
                        </div>
                    )}
                </motion.div>
            </motion.div>
        </motion.div>
    );
};