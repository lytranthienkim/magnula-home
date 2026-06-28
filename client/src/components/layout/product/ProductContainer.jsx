'use client'

import { motion } from "framer-motion";
import { ProductCard } from "./ProductCard";
import { Filter } from "@/components/common/filter/Filter";
import { useProduct } from "@/hooks/useProduct";
import { productContainerVariants, productCardVariants } from "@/framer/productContainerMotion";
import { SkeletonGrid } from "@/components/skeleton";

export const ProductContainer = () => {
    const imageSizes = [
        [280, 0, 340, 380],
        [340, 280, 0, 380],
        [380, 0, 280, 340]
    ];

    const {
        products,
        colors,
        fabricTypes,
        materials,
        roomSuitabilities,
        loading,
        selectedCategory,
        selectedColor,
        minPrice,
        maxPrice,
        selectedFabricType,
        selectedMaterial,
        selectedRoomSuitability,
        minPriceLimit,
        maxPriceLimit,
        handleCategoryClick,
        handleColorClick,
        handlePriceChange,
        handleFabricTypeClick,
        handleMaterialClick,
        handleRoomSuitabilityClick,
        handleClear
    } = useProduct();

    if (loading) return <div className="w-full min-h-screen flex flex-col gap-8 padding-wide"><SkeletonGrid count={12} columns="grid-cols-1 md:grid-cols-2 lg:grid-cols-3" /></div>;

    const totalRows = Math.ceil(products.length / 3);
    const rowsArray = Array.from({ length: totalRows });

    let productIndex = 0;

    return (
        <div className="w-full min-h-screen flex flex-col gap-8 padding-wide">
            <Filter
                selectedCategory={selectedCategory}
                onCategoryClick={handleCategoryClick}
                colors={colors}
                selectedColor={selectedColor}
                onColorClick={handleColorClick}
                minPrice={minPrice}
                maxPrice={maxPrice}
                onPriceChange={handlePriceChange}
                minPriceLimit={minPriceLimit}
                maxPriceLimit={maxPriceLimit}
                fabricTypes={fabricTypes}
                selectedFabricType={selectedFabricType}
                onFabricTypeClick={handleFabricTypeClick}
                materials={materials}
                selectedMaterial={selectedMaterial}
                onMaterialClick={handleMaterialClick}
                roomSuitabilities={roomSuitabilities}
                selectedRoomSuitability={selectedRoomSuitability}
                onRoomSuitabilityClick={handleRoomSuitabilityClick}
                onClear={handleClear}
            />

            {products.length === 0 ? (
                <div className="w-full h-[50vh] flex items-center justify-center">
                    <p className="body-03 text-primary font-display-regular text-center">
                        We couldn't find a match for your request. Discover our other curated collections.
                    </p>
                </div>
            ) : (
                <motion.div
                    variants={productContainerVariants}
                    initial="hidden"
                    animate="visible"
                    className="flex flex-col gap-8"
                >
                    {rowsArray.map((_, rowIndex) => {
                        const countRowIndex = rowIndex % 3;
                        const currentRowSizes = imageSizes[countRowIndex];

                        return (
                            <div key={rowIndex} className="w-full flex flex-col justify-center md:flex-row md:flex-wrap md:justify-between gap-y-4 md:gap-x-1 lg:gap-0">
                                {currentRowSizes.map((imageSize, itemIndex) => {
                                    if (imageSize === 0) {
                                        return <div key={`${rowIndex}-${itemIndex}`} className="w-0 h-0" />;
                                    }

                                    const currentProduct = products[productIndex];
                                    const currentProductIndex = productIndex;
                                    productIndex++;

                                    if (!currentProduct) return null;

                                    return (
                                        <motion.div
                                            key={`product-${currentProductIndex}`}
                                            variants={productCardVariants}
                                        >
                                            <ProductCard
                                                product={currentProduct}
                                                imageSize={imageSize}
                                            />
                                        </motion.div>
                                    );
                                })}
                            </div>
                        );
                    })}
                </motion.div>
            )}
        </div>
    );
};