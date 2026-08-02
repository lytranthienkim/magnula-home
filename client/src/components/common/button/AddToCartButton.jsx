export const AddToCartButton = ({ price, disabled, onClick }) => {
    return (
        <button
            type="button"
            disabled={disabled}
            className={`w-full py-2 body-02 rounded-none ${disabled
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed opacity-50'
                : 'bg-black text-third cursor-pointer hover:opacity-90 border-[0.25px] border-[#272727]'
                }`}
            onClick={onClick}
        >
            ADD TO CART - ${parseFloat(price).toLocaleString()}
        </button>
    );
};
