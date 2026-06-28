'use client'

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getAllProducts } from "@/api/products";
import { generateSlug } from "@/helper/slug";
import {
  productCushionContainerVariants,
  cushionGridVariants,
  cushionItemVariants,
  cushionImageVariants,
} from "@/framer/productCushionMotion";

export const ProductCushion = () => {
    const params = useParams();
    const slug = params.slug;

    const [product, setProduct] = useState(null);
    const [cushionProducts, setCushionProducts] = useState([]);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [loading, setLoading] = useState(true);

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
                    const cushionProductsData = response.data.filter(
                        p => p.collectionId === foundProduct.collectionId &&
                            p.Category?.categoryName?.toLowerCase() === 'cushion' &&
                            p.id !== foundProduct.id
                    );
                    setCushionProducts(cushionProductsData.slice(0, 3));
                }
            } catch (error) {
                console.error('Failed to fetch product', error);
            } finally {
                setLoading(false);
            }
        };

        if (slug) fetchProduct();
    }, [slug]);

    if (loading || !product || cushionProducts.length === 0) return null;

    const selectedProduct = cushionProducts[selectedImageIndex];
    const largeImage = selectedProduct?.images?.[0]?.imageUrl || '';

    return (
        <div className="w-full h-fit bg-background-primary padding-wide">

            <motion.div
                className="grid grid-cols-1 md:grid-cols-1 xl:grid-cols-2 w-full min-h-[300px] md:min-h-[450px] xl:min-h-[600px] gap-1 md:gap-2 xl:gap-3"
                variants={productCushionContainerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
            >

                <motion.div className="grid grid-cols-2 grid-rows-2 gap-1 md:gap-2 xl:gap-2" variants={cushionGridVariants}>

                    <motion.div className="flex flex-col flex-wrap justify-start items-start" variants={cushionItemVariants}>
                        <h2 className="font-display-ss-regular">
                            Adaptive <span className="font-display-ss-italic">cushion</span> for <span>{product.Collection.collectionName}</span>
                        </h2>
                    </motion.div>


                    {cushionProducts.map((item, index) => {

                        return (
                            <motion.div
                                key={item.id}
                                onClick={() => setSelectedImageIndex(index)}
                                className={`flex flex-col justify-between cursor-pointer select-none transition-colors duration-200
                                `}
                                variants={cushionItemVariants}
                            >
                                <div className="relative w-full h-full aspect-[4/3] overflow-hidden flex items-center justify-center">
                                    <img
                                        src={item.images?.[0]?.imageUrl || ''}
                                        alt={item.productName}
                                        className='w-full h-full object-cover transition-transform duration-500'
                                        loading="lazy"
                                    />
                                    <p className="absolute bottom-1 left-2 md:bottom-5 md:left-5  body-03 font-display-regular">
                                        {item.productName}
                                    </p>
                                </div>

                            </motion.div>
                        );
                    })}
                </motion.div>


                <motion.div className="w-full h-full flex items-center justify-center bg-background-primary" variants={cushionImageVariants}>
                    <div className="w-full h-full flex items-center justify-center overflow-hidden">
                        <img
                            src={largeImage}
                            alt={selectedProduct?.productName}
                            className="w-full h-full object-contain transition-all duration-300"
                        />
                    </div>
                </motion.div>

            </motion.div>
        </div>
    );
};