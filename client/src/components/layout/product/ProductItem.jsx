'use client'

import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { getAllProducts } from "@/api/products";
import { API } from "@/api/config";
import { generateSlug } from "@/helper/slug";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "@/redux/cartSlice";
import { RequestForm } from "@/components/common/modal/form/RequestForm";
import { RequestButton } from "@/components/common/button/RequestButton";
import { AddToCartButton } from "@/components/common/button/AddToCartButton";
import { SkeletonProductItem } from "@/components/skeleton";

export const ProductItem = () => {
    const params = useParams();
    const slug = params.slug;

    const dispatch = useDispatch();

    const [product, setProduct] = useState(null);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [isRequestFormOpen, setIsRequestFormOpen] = useState(false);

    const cartItems = useSelector((state) => state.cart.items);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                const response = await getAllProducts('');
                const foundProduct = response.data.find(p =>
                    generateSlug(p.productName) === slug
                );

                if (foundProduct?.id && foundProduct?.variants?.[0]) {
                    const variantRes = await API.get(`/products/${foundProduct.id}/variants`);
                    const variants = Array.isArray(variantRes.data) ? variantRes.data : variantRes.data?.data || [];
                    if (variants.length > 0) {
                        foundProduct.variants = variants;
                    }
                }

                setProduct(foundProduct || null);
            } catch (error) {
                console.error('Failed to fetch product', error);
            } finally {
                setLoading(false);
            }
        };

        if (slug) fetchProduct();
    }, [slug]);

    const images = product?.images || [];
    const mainImage = images[selectedImageIndex]?.imageUrl || '';
    const price = product?.variants?.[0]?.price || 0;
    const description = product?.Collection?.description || '';
    const stock = product?.variants?.[0]?.stockQuantity || 0;
    const currentCartItem = cartItems.find(item => item.id === product?.id);
    const quantityInCart = currentCartItem?.quantity || 0;

    const handleAddToCArt = useCallback(() => {
        if (!product) return;

        if (quantityInCart + 1 > stock) {
            return;
        }

        const itemPayload = {
            id: product.id,
            productVariantId: product.variants?.[0]?.id,
            name: product.productName,
            price: price,
            imageUrl: mainImage,
            stock: stock
        };

        dispatch(addToCart(itemPayload));
    }, [product, quantityInCart, stock, price, mainImage, dispatch]);

    const isOutOfStock = stock <= 0;
    const isExceedsStock = quantityInCart >= stock;
    const isButtonDisabled = isOutOfStock || isExceedsStock;

    if (loading || !product) {
        return <SkeletonProductItem />;
    }

    return (
        /* Section wrapper */
        <section className="w-full h-fit padding-wide">
            {/* Main grid */}
            <div className="grid grid-cols-1 xl:grid-cols-[1fr_1fr] gap-10 xl:gap-20">
                {/* Image gallery */}
                <div className="w-full flex flex-col md:flex-row justify-between gap-2">
                    {/* Primary image */}
                    <div className="relative flex items-center justify-center w-full h-[400px] md:h-[500px]">
                        {mainImage && (
                            <Image
                                src={mainImage}
                                alt={product.productName || "Product Image"}
                                fill
                                priority
                                unoptimized
                                className="object-cover"
                            />
                        )}
                    </div>

                    {/* Thumbnail list */}
                    <div className="h-full flex flex-row md:flex-col justify-start gap-2 md:gap-3 xl:gap-4">
                        {images.map((image, index) => (
                            /* Thumbnail item */
                            <div
                                key={index}
                                className="relative flex flex-col cursor-pointer gap-2 w-[70px] h-[70px]"
                                onClick={() => setSelectedImageIndex(index)}
                            >
                                <Image
                                    src={image.imageUrl}
                                    alt={`${product.productName} view ${index + 1}`}
                                    fill
                                    unoptimized
                                    className={`object-cover ${selectedImageIndex === index
                                        ? 'border-[0.25px] border-[#272727]'
                                        : 'border-[0.25px] border-transparent'
                                        }`}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Info section */}
                <div className="flex flex-col justify-between gap-4 md:gap-6 overflow-hidden">
                    {/* Header info */}
                    <div className="flex flex-col gap-4">
                        {/* Title text */}
                        <h1 className="font-seasons-bold">{product.productName}</h1>

                        {/* Description text */}
                        <p className="body-01 font-[400]">
                            {description}
                        </p>
                    </div>

                    {/* Section divider */}
                    <hr className="opacity-20 h-[0.25px]" />

                    {/* Specifications list */}
                    <div className="flex flex-col gap-3">
                        {/* Specs title */}
                        <p className="body-02 uppercase font-[500]">Details -</p>

                        {/* Overall size */}
                        <div className="flex flex-row flex-wrap items-center gap-1">
                            <span className="body-02 min-w-fit font-[500]">Overall:</span>
                            <span className="body-02 font-[400]">
                                {product.variants?.[0]?.overallSize || 'Not specified'}"
                            </span>
                        </div>

                        {/* Seat size */}
                        <div className="flex flex-row flex-wrap items-center gap-1">
                            <span className="body-02 min-w-fit font-[500]">Seat:</span>
                            <span className="body-02 font-[400]">
                                {product.variants?.[0]?.seatSize || 'Not specified'}"
                            </span>
                        </div>

                        {/* Fabric specification */}
                        <div className="flex flex-col flex-wrap items-start gap-1">
                            <div className="flex flex-row flex-wrap items-center gap-1">
                                <span className="body-02 min-w-fit font-[500]">Fabric:</span>
                                <span className="body-02 font-[400]">
                                    {product.FabricType?.name || 'Not specified'}
                                </span>
                            </div>
                            {product.FabricType?.description && (
                                <span className="body-03 text-gray-600">
                                    {product.FabricType.description}
                                </span>
                            )}
                        </div>

                        {/* Material specification */}
                        <div className="flex flex-col flex-wrap items-start gap-1">
                            <div className="flex flex-row flex-wrap items-center gap-1">
                                <span className="body-02 min-w-fit font-[500]">Material:</span>
                                <span className="body-02 font-[400]">
                                    {product.Material?.name || 'Not specified'}
                                </span>
                            </div>
                            {product.Material?.description && (
                                <span className="body-03 text-gray-600">
                                    {product.Material.description}
                                </span>
                            )}
                        </div>

                        {/* Room suitability */}
                        <div className="flex flex-col flex-wrap items-start gap-1">
                            <div className="flex flex-row flex-wrap items-center gap-1">
                                <span className="body-02 min-w-fit font-[500]">Room:</span>
                                <span className="body-02 font-[400]">
                                    {product.RoomSuitability?.name || 'Not specified'}
                                </span>
                            </div>
                            {product.RoomSuitability?.description && (
                                <span className="body-03 text-gray-600">
                                    {product.RoomSuitability.description}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Action controls */}
                    <div className="flex flex-col gap-4">
                        {/* Stock row */}
                        <div className="flex flex-row items-center justify-between">
                            {/* Stock status */}
                            <div className="flex justify-between items-center gap-2">
                                <span className="body-02 font-[500]">Stock:</span>
                                <span className="body-02 font-[400]">{stock > 0 ? stock : 'Out of Stock'}</span>
                            </div>

                            <RequestButton onClick={() => setIsRequestFormOpen(true)} />
                        </div>

                        {/* Restock note */}
                        {isButtonDisabled && (
                            <p className="body-02 italic text-gray-600">
                                You can submit a restock request.
                            </p>
                        )}

                        <AddToCartButton
                            price={price}
                            disabled={isButtonDisabled}
                            onClick={handleAddToCArt}
                        />
                    </div>
                </div>
            </div>

            {/* Request modal */}
            <RequestForm
                isOpen={isRequestFormOpen}
                onClose={() => setIsRequestFormOpen(false)}
                productId={product?.id}
                productVariantId={product?.variants?.[0]?.id}
            />
        </section>
    );
};