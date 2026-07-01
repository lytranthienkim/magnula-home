'use client'

import { getAllCategories } from "@/api/category";
import { useEffect, useState, useRef } from "react";
import { IoSearchOutline } from "react-icons/io5";

const CustomSelectField = ({ label, options, selectedValue, onSelect, placeholder = "---" }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Tìm kiếm name tương ứng với ID để hiển thị lên label nút bấm
    const currentOption = options.find(opt => String(opt.id) === String(selectedValue));
    const displayText = currentOption ? currentOption.name : placeholder;

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="flex flex-col gap-1.5 w-full md:min-w-[240px]" ref={dropdownRef}>
            <p className="body-03 font-display-regular">{label}</p>
            <div className="relative">
                {/* Thanh hiển thị chính */}
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-full text-left body-03 font-display-regular 
                               border-[0.25px] border-[#272727] py-2 px-3 bg-background-primary 
                               focus:outline-none rounded-none flex justify-between items-center"
                >
                    <span className="truncate pr-4">{displayText}</span>

                </button>

                {isOpen && (
                    <div className="absolute z-[9999] left-0 w-full mt-[-1px] bg-background-primary
                                    border-[0.25px] border-[#272727] rounded-none  max-h-48 overflow-y-auto ">
                        <button
                            type="button"
                            onClick={() => {
                                onSelect(null);
                                setIsOpen(false);
                            }}
                            className="w-full text-left py-2 px-3 body-03 font-display-regular transition-colors cursor-pointer"
                        >
                            {placeholder}
                        </button>
                        {options.map((opt) => (
                            <button
                                key={opt.id}
                                type="button"
                                onClick={() => {
                                    onSelect(opt.id);
                                    setIsOpen(false);
                                }}
                                className={`w-full text-left py-2 px-3 body-03 font-display-regular cursor-pointer hover:bg-black hover:text-third transitions-color duration-100 cursor-pointer
                                           ${String(selectedValue) === String(opt.id)
                                        ? 'bg-[#000000] text-third cursor-pointer'
                                        : 'text-primary cursor-pointer'}`}
                            >
                                {opt.name}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

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

    return (
        <div className="w-full flex flex-col gap-4 mb-4" ref={filterBoxRef}>
            {/* Categories Navigation */}
            <div className="flex flex-wrap items-center gap-3 md:gap-5 lg:gap-10">
                    {categories.map((c) => {
                        const isActive = selectedCategory === c.categoryName;
                        return (
                            <p
                                key={c.id}
                                className={`uppercase body-02 cursor-pointer transition-all ${isActive ? 'font-display-semibold' : 'font-display-regular'
                                    }`}
                                onClick={() => onCategoryClick(c.categoryName)}
                            >
                                {c.categoryName}
                            </p>
                        );
                    })}
            </div>

            {/* Filter Button + Clear Button */}
            <div className="flex items-center justify-between gap-4">
                {/* Cụm Nút bấm & Bảng lọc Filter */}
                <div className="relative">
                    <button
                        onClick={() => setOpenFilter(!openFilter)}
                        className="uppercase body-02 font-display-regular cursor-pointer flex items-center gap-1.5"
                    >
                        <span>Filter</span>
                    </button>

                    {openFilter && (
                        <div className="absolute w-[calc(100vw-32px)] md:w-[320px] p-6 top-10 left-0 md:left-0 border-[0.25px] border-[#272727] flex flex-col items-start gap-5 bg-background-primary rounded-none ">
                            {/* Color Options */}
                            {colors.length > 0 && (
                                <div className="flex flex-col gap-1.5 w-full">
                                    <p className="body-03 font-display-regular">Color</p>
                                    <div className="flex flex-wrap gap-3 pt-1">
                                        {colors.map((color) => (
                                            <div
                                                key={color}
                                                className={`w-5 h-5 cursor-pointer transition-all rounded-full ${selectedColor === color ? 'ring-1 ring-offset-1 ring-[#272727]' : null
                                                    }`}
                                                style={{ backgroundColor: color }}
                                                onClick={() => onColorClick(color)}
                                                title={color}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Fabric Type Custom Options */}
                            {fabricTypes.length > 0 && (
                                <CustomSelectField
                                    label="Fabric"
                                    options={fabricTypes}
                                    selectedValue={selectedFabricType}
                                    onSelect={onFabricTypeClick}
                                    placeholder="---"
                                />
                            )}

                            {/* Material Type Custom Options */}
                            {materials.length > 0 && (
                                <CustomSelectField
                                    label="Material"
                                    options={materials}
                                    selectedValue={selectedMaterial}
                                    onSelect={onMaterialClick}
                                    placeholder="---"
                                />
                            )}

                            {/* Room Suitability Custom Options */}
                            {roomSuitabilities.length > 0 && (
                                <CustomSelectField
                                    label="Room"
                                    options={roomSuitabilities}
                                    selectedValue={selectedRoomSuitability}
                                    onSelect={onRoomSuitabilityClick}
                                    placeholder="---"
                                />
                            )}

                            {/* Price Range Input */}
                            <div className="flex flex-col gap-1.5 w-full">
                                <p className="body-03 font-display-regular">Price</p>
                                <div className="flex flex-row gap-1.5 items-center pt-1">
                                    <input
                                        type="number"
                                        placeholder={`e.g. ${minPriceLimit || 0}`}
                                        value={tempMinPrice}
                                        onChange={(e) => setTempMinPrice(e.target.value)}
                                        min={minPriceLimit || 0} // Set min price về 0 nếu minPriceLimit không tồn tại
                                        max={maxPriceLimit || undefined} // Set max price về undefined nếu maxPriceLimit không tồn tại
                                        className="w-full p-1 font-display-regular body-03 border-[0.25px] border-[#272727] bg-background-primary outline-none rounded-none"
                                    />
                                    <span className="body-03 text-gray-400">-</span>
                                    <input
                                        type="number"
                                        placeholder={`e.g. ${maxPriceLimit || ''}`}
                                        value={tempMaxPrice}
                                        onChange={(e) => setTempMaxPrice(e.target.value)}
                                        min={minPriceLimit || 0}
                                        max={maxPriceLimit || undefined}
                                        className="w-full p-1 font-display-regular body-03 border-[0.25px] border-[#272727] bg-background-primary outline-none rounded-none"
                                    />
                                    <button
                                        onClick={() => {
                                            let error = '';


                                            // Kiểm tra giá trị min price
                                            if (tempMinPrice) {
                                                const minVal = parseFloat(tempMinPrice);
                                                // Kiểm tra xem có phải là số hợp lệ và dương không
                                                if (isNaN(minVal) || minVal < 0) {
                                                    error = 'Min price must be a valid positive number'; // Trả về thông báo lỗi nếu không hợp lệ
                                                }
                                                // Kiểm tra xem có phải nhập số có số 0 đứng đầu không vì đây là trường hợp loại trừ 0
                                                if (tempMinPrice.toString().match(/^0\d/) && tempMinPrice !== '0') {
                                                    error = 'Min price cannot have leading zeros'; 
                                                }
                                            }

                                            // Kiểm tra giá trị max price
                                            if (!error && tempMaxPrice) {
                                                const maxVal = parseFloat(tempMaxPrice);
                                                // Check if it's a valid number
                                                if (isNaN(maxVal) || maxVal < 0) {
                                                    error = 'Max price must be a valid positive number';
                                                }
                                                // Check for leading zeros (except for "0")
                                                if (tempMaxPrice.toString().match(/^0\d/) && tempMaxPrice !== '0') {
                                                    error = 'Max price cannot have leading zeros';
                                                }
                                            }

                                            // So sánh min price và max price nếu cả hai đều tồn tại
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
                                        }}
                                        className="py-1 px-3 body-03 font-display-regular border-[0.25px] border-[#272727] text-primary cursor-pointer hover:bg-black hover:text-third duration-200"
                                    >
                                        <IoSearchOutline size={18} />
                                    </button>
                                </div>
                                {priceError && (
                                    <p className="body-03 text-error mt-1">{priceError}</p>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                <button
                    onClick={() => {
                        onClear?.();
                        setOpenFilter(false);
                    }}
                    className="uppercase body-02 font-display-regular cursor-pointer flex items-center gap-1.5"
                >
                    <span>Clear</span>
                </button>
            </div>
        </div>
    )
}