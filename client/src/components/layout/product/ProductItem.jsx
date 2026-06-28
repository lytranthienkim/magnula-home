'use client'

import { useParams } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { getAllProducts } from "@/api/products";
import { generateSlug } from "@/helper/slug";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "@/redux/cartSlice";
import { RequestForm } from "@/components/common/modal/form/RequestForm";
import { SkeletonProductItem } from "@/components/skeleton";

export const ProductItem = () => {
    const params = useParams();
    const slug = params.slug;

    const dispatch = useDispatch();

    const [product, setProduct] = useState(null);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [isRequestFormOpen, setIsRequestFormOpen] = useState(false);

    // Get cart items from Redux to track quantity
    const cartItems = useSelector((state) => state.cart.items);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                // Fetch all products and find by slug (product name)
                const response = await getAllProducts('');
                const foundProduct = response.data.find(p =>
                    generateSlug(p.productName) === slug
                );
                setProduct(foundProduct || null);
            } catch (error) {
                console.error('Failed to fetch product', error);
            } finally {
                setLoading(false);
            }
        };

        if (slug) fetchProduct();
    }, [slug]);

    // Declare all hooks before early returns
    const images = product?.images || [];
    const mainImage = images[selectedImageIndex]?.imageUrl || '';
    const price = product?.variants?.[0]?.price || 0;
    const description = product?.Collection?.description || '';
    const stock = product?.variants?.[0]?.stockQuantity || 0;

    // Get current quantity of this product in cart (search by product ID, not slug)
    const currentCartItem = cartItems.find(item => item.id === product?.id);
    const quantityInCart = currentCartItem?.quantity || 0;

    const handleAddToCArt = useCallback(() => {
        if (!product) return;

        //Check stock
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

    // Check if button should be disabled
    const isOutOfStock = stock <= 0;
    const isExceedsStock = quantityInCart >= stock;
    const isButtonDisabled = isOutOfStock || isExceedsStock;

    // Early return with conditional JSX instead of preventing hooks
    if (loading || !product) {
        return <SkeletonProductItem />;
    }

    return (
        <div className="w-full h-fit padding-wide">
            <div className="grid grid-cols-1 xl:grid-cols-[1fr_1fr] gap-10 xl:gap-20">
                <div className="w-full flex flex-col md:flex-row justify-between gap-2">
                    {/* Column 2: Main Image */}
                    <div className="flex items-center justify-center">
                        <img
                            src={mainImage}
                            alt={product.productName}
                            className="w-full h-full object-cover"
                            loading="lazy"
                        />
                    </div>

                    {/* Column 1: Thumbnails */}
                    <div className="h-full flex flex-row md:flex-col justify-start gap-2 md:gap-3 xl:gap-4">
                        {images.map((image, index) => (
                            <div
                                key={index}
                                className="relative flex flex-col cursor-pointer gap-2"
                                onClick={() => setSelectedImageIndex(index)}
                            >
                                <img
                                    src={image.imageUrl}
                                    alt={`${product.productName} view ${index + 1}`}
                                    className={`w-[70px] h-[70px] ${selectedImageIndex === index
                                        ? 'border-[0.25px] border-[#272727]'
                                        : 'border-[0.25px] border-transparent'
                                        }`}
                                    loading="lazy"
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Column 3: Product Details */}
                <div className="flex flex-col justify-between gap-4 md:gap-6 overflow-hidden">
                    <div className="flex flex-col gap-4">
                        {/* Title & Price */}
                        <h1 className="font-display-ss-regular">{product.productName}</h1>

                        {/* Description */}
                        <p className="body-01 leading-regular font-display-regular">
                            {description}
                        </p>
                    </div>
                    <hr className="opacity-20 h-[0.25px]"></hr>
                    {/* Specs */}
                    <div className="flex flex-col gap-3">
                        <p className="body-02 font-display-semibold uppercase">Details -</p>
                        {/* Overall Size */}
                        <div className="flex flex-row flex-wrap items-center gap-1">
                            <span className="body-02 font-display-semibold min-w-fit">Overall:</span>
                            <span className="body-02 font-display-regular">
                                {product.variants?.[0]?.overallSize || 'Not specified'}"
                            </span>
                        </div>

                        {/* Seat Size */}
                        <div className="flex flex-row flex-wrap items-center gap-1">
                            <span className="body-02 font-display-semibold min-w-fit">Seat:</span>
                            <span className="body-02 font-display-regular">
                                {product.variants?.[0]?.seatSize || 'Not specified'}"
                            </span>
                        </div>

                        {/* Fabric Type */}
                        <div className="flex flex-col flex-wrap items-start gap-1">
                            <div className="flex flex-row flex-wrap items-center gap-1">
                                <span className="body-02 font-display-semibold min-w-fit">Fabric:</span>
                                <span className="body-02 font-display-regular">
                                    {product.FabricType?.name || 'Not specified'}
                                </span>
                            </div>
                            {product.FabricType?.description && (
                                <span className="body-03 font-display-regular text-gray-700">
                                    {product.FabricType.description}
                                </span>
                            )}
                        </div>

                        {/* Material */}
                        <div className="flex flex-col flex-wrap items-start gap-1">
                            <div className="flex flex-row flex-wrap items-center gap-1">
                                <span className="body-02 font-display-semibold min-w-fit">Material:</span>
                                <span className="body-02 font-display-regular">
                                    {product.Material?.name || 'Not specified'}
                                </span>
                            </div>
                            {product.Material?.description && (
                                <span className="body-03 font-display-regular text-gray-700">
                                    {product.Material.description}
                                </span>
                            )}
                        </div>

                        {/* Room Suitability */}
                        <div className="flex flex-col flex-wrap items-start gap-1">
                            <div className="flex flex-row flex-wrap items-center gap-1">
                                <span className="body-02 font-display-semibold min-w-fit">Room:</span>
                                <span className="body-02 font-display-regular">
                                    {product.RoomSuitability?.name || 'Not specified'}
                                </span>
                            </div>
                            {product.RoomSuitability?.description && (
                                <span className="body-03 font-display-regular text-gray-700">
                                    {product.RoomSuitability.description}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-col gap-4">
                        <div className="flex flex-row items-center justify-between">
                            {/* Stock */}
                            <div className="flex justify-between items-center">
                                <span className="body-02 font-display-semibold">Stock:</span>
                                <span className="body-02 font-display-regular">{stock > 0 ? stock : 'Out of Stock'}</span>
                            </div>

                            {/* Request for Quantity */}
                            <button
                                onClick={() => setIsRequestFormOpen(true)}
                                className="body-02 font-display-regular text-gray-500 underline cursor-pointer hover:text-gray-700 bg-transparent border-none p-0"
                            >
                                Request for quantity
                            </button>
                        </div>

                        {/* Error Message */}
                        {isButtonDisabled && (
                            <p className="body-02 font-display-regular italic text-gray-600">
                                You can submit a restock request.
                            </p>
                        )}

                        {/* Add to Cart Button */}
                        <button
                            disabled={isButtonDisabled}
                            className={`w-full py-2 body-02 font-display-semibold  rounded-none ${isButtonDisabled
                                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed opacity-50'
                                    : 'bg-black text-third cursor-pointer hover:opacity-90 border-[0.25px] border-[#272727]'
                                }`}
                            onClick={handleAddToCArt}
                        >
                            ADD TO CART - ${parseFloat(price)}
                        </button>
                    </div>
                </div>
            </div>

            {/* Request Form Modal */}
            <RequestForm
                isOpen={isRequestFormOpen}
                onClose={() => setIsRequestFormOpen(false)}
                productId={product?.id}
                productVariantId={product?.variants?.[0]?.id}
            />
        </div>
    );
};
