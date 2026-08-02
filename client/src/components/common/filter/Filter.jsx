'use client'

import { getAllCategories } from "@/api/category";
import { useEffect, useState, useRef } from "react";
import { CategoryList } from "./CategoryList";
import { FilterControls } from "./FilterControls";

export const Filter = ({
    selectedCategory, onCategoryClick,
    colors = [], selectedColor, onColorClick,
    minPrice, maxPrice, onPriceChange, minPriceLimit, maxPriceLimit,
    fabricTypes = [], selectedFabricType, onFabricTypeClick,
    materials = [], selectedMaterial, onMaterialClick,
    roomSuitabilities = [], selectedRoomSuitability, onRoomSuitabilityClick,
    onClear
}) => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openFilter, setOpenFilter] = useState(false);
    const [tempMinPrice, setTempMinPrice] = useState(minPrice || '');
    const [tempMaxPrice, setTempMaxPrice] = useState(maxPrice || '');
    const [priceError, setPriceError] = useState('');
    const filterBoxRef = useRef(null);

    useEffect(() => {
        const fetchAllCategory = async () => {
            try {
                const response = await getAllCategories();
                setCategories(response.data || []);
            } catch (error) {
                console.error('Failed to get all category', error)
                setCategories([]);
            } finally {
                setLoading(false);
            }
        }
        fetchAllCategory();
    }, [])

    useEffect(() => {
        const handleClickOutsideFilter = (event) => {
            if (filterBoxRef.current && !filterBoxRef.current.contains(event.target)) {
                setOpenFilter(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutsideFilter);
        return () => document.removeEventListener("mousedown", handleClickOutsideFilter);
    }, []);

    if (loading) {
        return <div className="text-center p-4">Loading ...</div>
    }

    const handlePriceSubmit = () => {
        let error = '';

        if (tempMinPrice) {
            const minVal = parseFloat(tempMinPrice);
            if (isNaN(minVal) || minVal < 0) {
                error = 'Min price must be a valid positive number';
            }
            if (tempMinPrice.toString().match(/^0\d/) && tempMinPrice !== '0') {
                error = 'Min price cannot have leading zeros';
            }
        }

        if (!error && tempMaxPrice) {
            const maxVal = parseFloat(tempMaxPrice);
            if (isNaN(maxVal) || maxVal < 0) {
                error = 'Max price must be a valid positive number';
            }
            if (tempMaxPrice.toString().match(/^0\d/) && tempMaxPrice !== '0') {
                error = 'Max price cannot have leading zeros';
            }
        }

        if (!error && tempMinPrice && tempMaxPrice) {
            const minVal = parseFloat(tempMinPrice);
            const maxVal = parseFloat(tempMaxPrice);
            if (minVal > maxVal) {
                error = 'Max price must be greater than or equal to min price';
            }
        }

        if (error) {
            setPriceError(error);
            return;
        }
        setPriceError('');
        onPriceChange(tempMinPrice || '', tempMaxPrice || '');
    };

    return (
        <div className="w-full flex flex-col gap-4 mb-4 z-[9999]" ref={filterBoxRef}>
            <CategoryList
                categories={categories}
                selectedCategory={selectedCategory}
                onCategoryClick={onCategoryClick}
            />

            <FilterControls
                openFilter={openFilter}
                onFilterToggle={() => setOpenFilter(!openFilter)}
                onClearClick={() => {
                    onClear?.();
                    setOpenFilter(false);
                }}
                colors={colors}
                selectedColor={selectedColor}
                onColorClick={onColorClick}
                fabricTypes={fabricTypes}
                selectedFabricType={selectedFabricType}
                onFabricTypeClick={onFabricTypeClick}
                materials={materials}
                selectedMaterial={selectedMaterial}
                onMaterialClick={onMaterialClick}
                roomSuitabilities={roomSuitabilities}
                selectedRoomSuitability={selectedRoomSuitability}
                onRoomSuitabilityClick={onRoomSuitabilityClick}
                minPrice={minPrice}
                maxPrice={maxPrice}
                tempMinPrice={tempMinPrice}
                tempMaxPrice={tempMaxPrice}
                minPriceLimit={minPriceLimit}
                maxPriceLimit={maxPriceLimit}
                priceError={priceError}
                onMinPriceChange={(e) => setTempMinPrice(e.target.value)}
                onMaxPriceChange={(e) => setTempMaxPrice(e.target.value)}
                onPriceSubmit={handlePriceSubmit}
                setPriceError={setPriceError}
            />
        </div>
    )
}
