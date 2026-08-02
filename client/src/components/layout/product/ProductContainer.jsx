'use client'

import { motion } from "framer-motion";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { ProductCard } from "./ProductCard";
import PaginationControl from "../../common/navigation/PaginationControl";
import { Filter } from "@/components/common/filter/Filter";
import { useProduct } from "@/hooks/useProduct";
import { productContainerVariants, productCardVariants } from "@/framer/productContainerMotion";
import { SkeletonGrid } from "@/components/skeleton";

export const ProductContainer = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();

    const currentPage = parseInt(searchParams.get('page') || '1', 10);

    const ITEMS_PER_PAGE = 9;
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

    if (loading) {
        return (
            <div className="w-full min-h-screen flex flex-col gap-8 padding-wide">
                {/* Skeleton loader */}
                <SkeletonGrid count={12} columns="grid-cols-1 md:grid-cols-2 lg:grid-cols-3" />
            </div>
        );
    }

    const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const paginatedProducts = products.slice(startIndex, endIndex);

    const totalRows = Math.ceil(paginatedProducts.length / 3);
    const rowsArray = Array.from({ length: totalRows });

    let productIndex = 0;

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            const params = new URLSearchParams(searchParams);
            params.set('page', (currentPage - 1).toString());
            router.push(`${pathname}?${params.toString()}`);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            const params = new URLSearchParams(searchParams);
            params.set('page', (currentPage + 1).toString());
            router.push(`${pathname}?${params.toString()}`);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    return (
        <section className="w-full min-h-screen flex flex-col gap-8 padding-wide">
            {/* Filter component */}
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
                    <p className="body-03 text-primary text-center">
                        We couldn&apos;t find a match for your request. Discover our other curated collections.
                    </p>
                </div>
            ) : (
                <>
                    {/* Products grid */}
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

                                        const currentProduct = paginatedProducts[productIndex];
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

                    <PaginationControl
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPrevious={handlePreviousPage}
                        onNext={handleNextPage}
                    />
                </>
            )}
        </section>
    );
};