import { IoSearchOutline } from "react-icons/io5";

export const PriceFilter = ({
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
        <div className="flex flex-col gap-1.5 w-full">
            <p className="body-03 font-medium">Price</p>
            <div className="flex flex-row gap-1.5 items-center pt-1">
                <input
                    type="number"
                    placeholder={`e.g. ${minPriceLimit || 0}`}
                    value={tempMinPrice}
                    onChange={onMinPriceChange}
                    min={minPriceLimit || 0}
                    max={maxPriceLimit || undefined}
                    className="w-full p-1  body-03 border-[0.25px] border-[#272727] bg-background-primary outline-none rounded-none"
                />
                <span className="body-03 text-gray-400">-</span>
                <input
                    type="number"
                    placeholder={`e.g. ${maxPriceLimit || ''}`}
                    value={tempMaxPrice}
                    onChange={onMaxPriceChange}
                    min={minPriceLimit || 0}
                    max={maxPriceLimit || undefined}
                    className="w-full p-1  body-03 border-[0.25px] border-[#272727] bg-background-primary outline-none rounded-none"
                />
                <button
                    onClick={onPriceSubmit}
                    className="py-1 px-3 body-03  border-[0.25px] border-[#272727] text-primary cursor-pointer hover:bg-black hover:text-third duration-200"
                >
                    <IoSearchOutline size={18} />
                </button>
            </div>
            {priceError && (
                <p className="body-03 text-error mt-1">{priceError}</p>
            )}
        </div>
    );
};
