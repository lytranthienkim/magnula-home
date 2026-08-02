export const IncreaseQuantityButton = ({ disabled, onClick }) => {
    return (
        <button
            disabled={disabled}
            className={`px-2 py-0.5 body-03 text-display-regular ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            onClick={onClick}
        >
            +
        </button>
    );
};
