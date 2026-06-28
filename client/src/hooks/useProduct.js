'use client'

import { getAllProducts } from "@/api/products";
import { useCallback, useEffect, useState } from "react";
import { useQueryParams } from "@/hooks/useQueryParams";
import { getAllFabricTypes } from "@/api/fabricType";
import { getAllMaterials } from "@/api/materials";
import { getAllRoomSuitabilities } from "@/api/roomSuitabilities";
import { createFilterHandlers } from "@/helper/filter";

export const useProduct = () => {
    const [products, setProducts] = useState([]);
    const [colors, setColors] = useState([]);
    const [fabricTypes, setFabricTypes] = useState([]);
    const [materials, setMaterials] = useState([]);
    const [roomSuitabilities, setRoomSuitabilities] = useState([]);
    const [minPriceLimit, setMinPriceLimit] = useState(0);
    const [maxPriceLimit, setMaxPriceLimit] = useState(0);
    const [loading, setLoading] = useState(true);

    const { updateQueryParams, searchParams, router, pathname } = useQueryParams();

    // Extract query params for current filters
    const selectedCategory = searchParams.get('category');
    const selectedColor = searchParams.get('color');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const selectedFabricTypeName = searchParams.get('fabricTypeName');
    const selectedMaterialName = searchParams.get('materialName');
    const selectedRoomSuitabilityName = searchParams.get('roomSuitabilityName');

    // Convert names to ids for select values
    const selectedFabricType = fabricTypes.find(f => f.name === selectedFabricTypeName)?.id;
    const selectedMaterial = materials.find(m => m.name === selectedMaterialName)?.id;
    const selectedRoomSuitability = roomSuitabilities.find(r => r.name === selectedRoomSuitabilityName)?.id;

    // Fetch filter data (colors, price limits, fabric types, materials, room suitabilities)
    const fetchFilterData = useCallback(async () => {
        try {
            const [productsRes, fabricRes, materialRes, roomRes] = await Promise.all([
                getAllProducts(''),
                getAllFabricTypes(),
                getAllMaterials(),
                getAllRoomSuitabilities()
            ]);

            const allData = productsRes.data || [];

            // Extract unique colors and calculate price limits
            const uniqueColors = new Set();
            let minPrice = Infinity;
            let maxPrice = 0;

            allData.forEach(product => {
                if (product.Collection?.colorHex) {
                    uniqueColors.add(product.Collection.colorHex);
                }

                const price = parseFloat(product.variants?.[0]?.price || 0);
                if (price < minPrice) minPrice = price;
                if (price > maxPrice) maxPrice = price;
            });

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

    // Fetch products based on filter
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
