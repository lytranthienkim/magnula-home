import { CustomSelectField } from "./CustomSelectField";
import { ColorOptions } from "./ColorOptions";
import { PriceFilter } from "./PriceFilter";

export const FilterDropdown = ({
    isOpen,
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
    if (!isOpen) return null;

    return (
        <div className="absolute w-[calc(100vw-32px)] md:w-[320px] p-6 top-10 left-0 md:left-0 border-[0.25px] border-[#272727] flex flex-col items-start gap-5 bg-background-primary rounded-none">
            <ColorOptions
                colors={colors}
                selectedColor={selectedColor}
                onColorClick={onColorClick}
            />

            {fabricTypes.length > 0 && (
                <CustomSelectField
                    label="Fabric"
                    options={fabricTypes}
                    selectedValue={selectedFabricType}
                    onSelect={onFabricTypeClick}
                    placeholder="---"
                />
            )}

            {materials.length > 0 && (
                <CustomSelectField
                    label="Material"
                    options={materials}
                    selectedValue={selectedMaterial}
                    onSelect={onMaterialClick}
                    placeholder="---"
                />
            )}

            {roomSuitabilities.length > 0 && (
                <CustomSelectField
                    label="Room"
                    options={roomSuitabilities}
                    selectedValue={selectedRoomSuitability}
                    onSelect={onRoomSuitabilityClick}
                    placeholder="---"
                />
            )}

            <PriceFilter
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
    );
};
