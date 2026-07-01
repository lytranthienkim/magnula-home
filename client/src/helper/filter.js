// Xử lý các filter trên client side để cập nhật query params và điều hướng trang

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

    // Hàm check giá price có 4 trường hợp: minPrice, maxPrice, minPrice và maxPrice hoặc không nhập gì
    const handlePriceChange = (min, max) => {
        // Validate inputs
        let validMin = min;
        let validMax = max;

        if (min && parseFloat(min) < minPriceLimit) { // Nếu giá trị minPrice nhập vào nhỏ hơn minPriceLimit, gán validMin bằng minPriceLimit
            validMin = minPriceLimit; // Ví dụ nhập min = 0 nhưng minPriceLimit tìm thấy trong bảng productVariant có giá trị là 20$ thì validMin sẽ được gán bằng 20$ để đảm bảo giá trị minPrice không nhỏ hơn minPriceLimit
        }
        if (max && parseFloat(max) > maxPriceLimit) {
            validMax = maxPriceLimit; // Nếu giá trị maxPrice nhập vào lớn hơn maxPriceLimit, gán validMax bằng maxPriceLimit
        }

        // Cập nhật query params dựa trên giá trị validMin và validMax
        const params = new URLSearchParams(searchParams.toString());
        if (validMin) {
            params.set('minPrice', validMin); // Nếu validMin tồn tại, set query param minPrice bằng validMin
        } else {
            params.delete('minPrice');
        }
        if (validMax) {
            params.set('maxPrice', validMax); // Nếu validMax tồn tại, set query param maxPrice bằng validMax
        } else {
            params.delete('maxPrice');
        }
        router.push(`${pathname}?${params.toString()}`, { scroll: false }); // Điều hướng trang với query params mới mà không cuộn trang
    };

    const handleFabricTypeClick = (fabricTypeId) => {
        // Lấy fabric type name từ mảng dựa trên id
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
