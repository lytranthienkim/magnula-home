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
        <div className="w-full h-fit padding-wide">
            <div className="grid grid-cols-1 xl:grid-cols-[1fr_1fr] gap-10 xl:gap-20">
                <div className="w-full flex flex-col md:flex-row justify-between gap-2">
                    <div className="relative flex items-center justify-center w-full h-[400px] md:h-[500px]">
                        <Image
                            src={mainImage}
                            alt={product.productName}
                            fill
                            className="object-cover"
                        />
                    </div>

                    <div className="h-full flex flex-row md:flex-col justify-start gap-2 md:gap-3 xl:gap-4">
                        {images.map((image, index) => (
                            <div
                                key={index}
                                className="relative flex flex-col cursor-pointer gap-2 w-[70px] h-[70px]"
                                onClick={() => setSelectedImageIndex(index)}
                            >
                                <Image
                                    src={image.imageUrl}
                                    alt={`${product.productName} view ${index + 1}`}
                                    fill
                                    className={`object-cover ${selectedImageIndex === index
                                        ? 'border-[0.25px] border-[#272727]'
                                        : 'border-[0.25px] border-transparent'
                                        }`}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col justify-between gap-4 md:gap-6 overflow-hidden">
                    <div className="flex flex-col gap-4">
                        <h1 className="font-display-ss-regular">{product.productName}</h1>

                        <p className="body-01 leading-regular font-display-regular">
                            {description}
                        </p>
                    </div>

                    <hr className="opacity-20 h-[0.25px]"></hr>

                    <div className="flex flex-col gap-3">
                        <p className="body-02 font-display-semibold uppercase">Details -</p>
                        <div className="flex flex-row flex-wrap items-center gap-1">
                            <span className="body-02 font-display-semibold min-w-fit">Overall:</span>
                            <span className="body-02 font-display-regular">
                                {product.variants?.[0]?.overallSize || 'Not specified'}"
                            </span>
                        </div>

                        <div className="flex flex-row flex-wrap items-center gap-1">
                            <span className="body-02 font-display-semibold min-w-fit">Seat:</span>
                            <span className="body-02 font-display-regular">
                                {product.variants?.[0]?.seatSize || 'Not specified'}"
                            </span>
                        </div>

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
                            <div className="flex justify-between items-center">
                                <span className="body-02 font-display-semibold">Stock:</span>
                                <span className="body-02 font-display-regular">{stock > 0 ? stock : 'Out of Stock'}</span>
                            </div>

                            <button
                                onClick={() => setIsRequestFormOpen(true)}
                                className="body-02 font-display-regular text-gray-500 underline cursor-pointer hover:text-gray-700 bg-transparent border-none p-0"
                            >
                                Request for quantity
                            </button>
                        </div>

                        
                        {isButtonDisabled && (
                            <p className="body-02 font-display-regular italic text-gray-600">
                                You can submit a restock request.
                            </p>
                        )}

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

            <RequestForm
                isOpen={isRequestFormOpen}
                onClose={() => setIsRequestFormOpen(false)}
                productId={product?.id}
                productVariantId={product?.variants?.[0]?.id}
            />
        </div>
    );
};
