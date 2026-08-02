import { FilterDropdown } from "./FilterDropdown";

export const FilterControls = ({
    openFilter,
    onFilterToggle,
    onClearClick,
    colors,
    selectedColor,
    onColorClick,
    fabricTypes,
    selectedFabricType,
    onFabricTypeClick,
    materials,
    selectedMaterial,
    onMaterialClick,
    roomSuitabilities,
    selectedRoomSuitability,
    onRoomSuitabilityClick,
    minPrice,
    maxPrice,
    tempMinPrice,
    tempMaxPrice,
    minPriceLimit,
    maxPriceLimit,
    priceError,
    onMinPriceChange,
    onMaxPriceChange,
    onPriceSubmit,
    setPriceError
}) => {
    return (
        <div className="flex items-center justify-between gap-4">
            <div className="relative">
                <button
                    onClick={onFilterToggle}
                    className="uppercase body-03  cursor-pointer flex items-center gap-1.5"
                >
                    <span className="hover:font-medium">Filter</span>
                </button>

                <FilterDropdown
                    isOpen={openFilter}
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
                    onMinPriceChange={onMinPriceChange}
                    onMaxPriceChange={onMaxPriceChange}
                    onPriceSubmit={onPriceSubmit}
                    setPriceError={setPriceError}
                />
            </div>

            <button
                onClick={onClearClick}
                className="uppercase body-03  cursor-pointer flex items-center gap-1.5"
            >
                <span>Clear</span>
            </button>
        </div>
    );
};
