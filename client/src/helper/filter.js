// Filter helper functions for ProductContainer

export const createFilterHandlers = ({
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
}) => {
    const handleCategoryClick = (categoryName) => {
        const newValue = selectedCategory === categoryName ? null : categoryName;
        updateQueryParams('category', newValue);
    };

    const handleColorClick = (color) => {
        const newValue = selectedColor === color ? null : color;
        updateQueryParams('color', newValue);
    };

    const handlePriceChange = (min, max) => {
        // Validate inputs
        let validMin = min;
        let validMax = max;

        if (min && parseFloat(min) < minPriceLimit) {
            validMin = minPriceLimit;
        }
        if (max && parseFloat(max) > maxPriceLimit) {
            validMax = maxPriceLimit;
        }

        // Update both minPrice and maxPrice params
        const params = new URLSearchParams(searchParams.toString());
        if (validMin) {
            params.set('minPrice', validMin);
        } else {
            params.delete('minPrice');
        }
        if (validMax) {
            params.set('maxPrice', validMax);
        } else {
            params.delete('maxPrice');
        }
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
    };

    const handleFabricTypeClick = (fabricTypeId) => {
        // Find fabric type name from array
        const fabricType = fabricTypes.find(f => f.id === parseInt(fabricTypeId));
        const fabricTypeName = fabricType?.name;

        // Check if same as selected to toggle off
        const isSelected = selectedFabricTypeName === fabricTypeName;
        const newValue = isSelected ? null : fabricTypeName;
        updateQueryParams('fabricTypeName', newValue);
    };

    const handleMaterialClick = (materialId) => {
        // Find material name from array
        const material = materials.find(m => m.id === parseInt(materialId));
        const materialName = material?.name;

        // Check if same as selected to toggle off
        const isSelected = selectedMaterialName === materialName;
        const newValue = isSelected ? null : materialName;
        updateQueryParams('materialName', newValue);
    };

    const handleRoomSuitabilityClick = (roomSuitabilityId) => {
        // Find room suitability name from array
        const room = roomSuitabilities.find(r => r.id === parseInt(roomSuitabilityId));
        const roomName = room?.name;

        // Check if same as selected to toggle off
        const isSelected = selectedRoomSuitabilityName === roomName;
        const newValue = isSelected ? null : roomName;
        updateQueryParams('roomSuitabilityName', newValue);
    };

    const handleClear = () => {
        // Clear all filters - navigate to /products without query params
        router.push(pathname, { scroll: false });
    };

    return {
        handleCategoryClick,
        handleColorClick,
        handlePriceChange,
        handleFabricTypeClick,
        handleMaterialClick,
        handleRoomSuitabilityClick,
        handleClear
    };
};
