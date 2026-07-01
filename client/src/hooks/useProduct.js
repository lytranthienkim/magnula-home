'use client'

import { getAllProducts } from "@/api/products";
import { useCallback, useEffect, useState } from "react";
import { useQueryParams } from "@/hooks/useQueryParams";
import { getAllFabricTypes } from "@/api/fabricType";
import { getAllMaterials } from "@/api/materials";
import { getAllRoomSuitabilities } from "@/api/roomSuitabilities";
import { createFilterHandlers } from "@/helper/filter";

export const useProduct = () => {
    const [products, setProducts] = useState([]); // product list state
    const [colors, setColors] = useState([]); // color filter state
    const [fabricTypes, setFabricTypes] = useState([]); // fabric type filter state
    const [materials, setMaterials] = useState([]); // material filter state
    const [roomSuitabilities, setRoomSuitabilities] = useState([]); // room suitability filter state
    const [minPriceLimit, setMinPriceLimit] = useState(0); // minimum price limit for price filter
    const [maxPriceLimit, setMaxPriceLimit] = useState(0); // maximum price limit for price filter
    const [loading, setLoading] = useState(true); // loading state for product list

    const { updateQueryParams, searchParams, router, pathname } = useQueryParams(); // custom hook to manage query params and routing

    // Lay cac gia tri filter tu query params
    const selectedCategory = searchParams.get('category'); 
    const selectedColor = searchParams.get('color');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const selectedFabricTypeName = searchParams.get('fabricTypeName');
    const selectedMaterialName = searchParams.get('materialName');
    const selectedRoomSuitabilityName = searchParams.get('roomSuitabilityName');

    // lay id tu name cua fabric type, material, room suitability de truyen vao API
    const selectedFabricType = fabricTypes.find(f => f.name === selectedFabricTypeName)?.id;
    const selectedMaterial = materials.find(m => m.name === selectedMaterialName)?.id;
    const selectedRoomSuitability = roomSuitabilities.find(r => r.name === selectedRoomSuitabilityName)?.id;

    // Filter du lieu tu API de lay cac gia tri filter (color, price, fabric type, material, room suitability)
    const fetchFilterData = useCallback(async () => {
        try {
            const [productsRes, fabricRes, materialRes, roomRes] = await Promise.all([ // promise all de goi nhieu API cung luc
                getAllProducts(''),
                getAllFabricTypes(),
                getAllMaterials(),
                getAllRoomSuitabilities()
            ]);

            const allData = productsRes.data || [];

            // Lay cac gia tri filter tu du lieu product
            const uniqueColors = new Set(); // color
            let minPrice = Infinity; //
            let maxPrice = 0;

            allData.forEach(product => {
                if (product.Collection?.colorHex) {
                    uniqueColors.add(product.Collection.colorHex); // them color vao set de lay cac gia tri duy nhat
                }

                const price = parseFloat(product.variants?.[0]?.price || 0); // lay gia tri price
                if (price < minPrice) minPrice = price; // tìm ra giá trị minPrice và maxPrice từ product variants
                if (price > maxPrice) maxPrice = price;
            });

            // Nạp vào mảng
            setColors(Array.from(uniqueColors));
            setMinPriceLimit(minPrice === Infinity ? 0 : Math.floor(minPrice));
            setMaxPriceLimit(Math.ceil(maxPrice));
            setFabricTypes(fabricRes.data || []);
            setMaterials(materialRes.data || []);
            setRoomSuitabilities(roomRes.data || []);
        } catch (error) {
            console.error("Failed to fetch filter data", error);
        }
    }, []);

    // Trả về danh sách sản phẩm dựa trên các query params hiện tại
    const fetchProductList = useCallback(async () => {
        setLoading(true);
        try {
            const queryString = searchParams.toString();
            const response = await getAllProducts(queryString);
            const productsData = response.data;
            setProducts(productsData);
        } catch (error) {
            console.error("Failed to get all products", error);
            setProducts([]);
        } finally {
            setLoading(false);
        }
    }, [searchParams]);

    // Call fetchFilterData on mount
    useEffect(() => {
        fetchFilterData();
    }, [fetchFilterData]);

    // Call fetchProductList when searchParams change
    useEffect(() => {
        fetchProductList();
    }, [fetchProductList]);

    // Get filter handlers
    const {
        handleCategoryClick,
        handleColorClick,
        handlePriceChange,
        handleFabricTypeClick,
        handleMaterialClick,
        handleRoomSuitabilityClick,
        handleClear
    } = createFilterHandlers({
        selectedCategory,
        selectedColor,
        selectedFabricTypeName,
        selectedMaterialName,
        selectedRoomSuitabilityName,
        minPriceLimit,
        maxPriceLimit,
        fabricTypes,
        materials,
        roomSuitabilities,
        searchParams,
        pathname,
        updateQueryParams,
        router
    });

    return {
        // Data
        products,
        colors,
        fabricTypes,
        materials,
        roomSuitabilities,
        loading,

        // Filter state
        selectedCategory,
        selectedColor,
        minPrice,
        maxPrice,
        selectedFabricType,
        selectedMaterial,
        selectedRoomSuitability,
        minPriceLimit,
        maxPriceLimit,

        // Filter handlers
        handleCategoryClick,
        handleColorClick,
        handlePriceChange,
        handleFabricTypeClick,
        handleMaterialClick,
        handleRoomSuitabilityClick,
        handleClear
    };
};
