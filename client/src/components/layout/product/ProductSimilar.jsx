'use client'

import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { getAllProducts } from "@/api/products";
import { generateSlug } from "@/helper/slug";
import {
    productSimilarContainerVariants,
    productSimilarHeaderVariants,
    productCardStackVariants,
    scrollContainerVariants,
} from "@/framer/productSimilarMotion";

export const ProductSimilar = () => {
    const params = useParams();
    const router = useRouter();
    const slug = params.slug;

    const [product, setProduct] = useState(null);
    const [similarProducts, setSimilarProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const scrollContainerRef = useRef(null);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                const response = await getAllProducts('');
                const foundProduct = response.data.find(p =>
                    generateSlug(p.productName) === slug
                );
                setProduct(foundProduct || null);
                if (foundProduct?.collectionId) {
                    const sameCollectionProducts = response.data.filter(
                        p => p.collectionId === foundProduct.collectionId && p.id !== foundProduct.id
                    );
                    setSimilarProducts(sameCollectionProducts);
                }
            } catch (error) {
                console.error('Failed to fetch product', error);
            } finally {
                setLoading(false);
            }
        };

        if (slug) fetchProduct();
    }, [slug]);

    if (loading || !product || similarProducts.length === 0) return null;

    const collectionName = product.Collection?.collectionName || '';

    return (
        /* Section wrapper */
        <motion.div
            className="w-full flex flex-col gap-3 padding-wide"
            variants={productSimilarContainerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
        >
            {/* Heading title */}
            <motion.h2 className="font-seasons-bold text-center" variants={productSimilarHeaderVariants}>{collectionName} <span className="font-seasons-italic">collection</span></motion.h2>

            {/* Scroll container */}
            <motion.div
                ref={scrollContainerRef}
                className="flex gap-1 md:gap-2 lg:gap-3 overflow-x-auto pb-2 md:pb-3 lg:pb-4 no-scrollbar"
                style={{ scrollBehavior: 'smooth' }}
                variants={scrollContainerVariants}
            >
                {similarProducts.map((item) => {
                    const handleProductClick = () => {
                        const itemSlug = generateSlug(item.productName);
                        router.push(`/products/${itemSlug}`);
                    };

                    return (
                        /* Card wrapper */
                        <motion.div
                            key={item.id}
                            className="flex-shrink-0 w-[65%] md:w-[50%] lg:w-[30%]"
                            variants={productCardStackVariants}
                        >
                            {/* Product card */}
                            <div className="flex flex-col gap-4">
                                {/* Image container */}
                                <div className="relative w-full aspect-square bg-gray-100 overflow-hidden">
                                    {/* Product image */}
                                    <Image
                                        src={item.images?.[0]?.imageUrl || ''}
                                        alt={item.productName || 'Similar product'}
                                        fill
                                        unoptimized
                                        className="w-full h-full object-cover transition-transform duration-300 cursor-pointer"
                                        onClick={handleProductClick}
                                    />
                                </div>

                                {/* Info wrapper */}
                                <div className="flex flex-col cursor-pointer" onClick={handleProductClick}>
                                    {/* Product name */}
                                    <p className="body-03 font-[500] truncate">
                                        {item.productName}
                                    </p>
                                    {/* Product price */}
                                    <p className="body-03 ">
                                        ${parseFloat(item.variants?.[0]?.price || 0)}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </motion.div>
        </motion.div>
    );
};