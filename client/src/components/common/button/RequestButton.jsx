export const RequestButton = ({ onClick }) => {
    return (
        <button
            type="button"
            onClick={onClick}
            className="body-02 text-gray-500 underline cursor-pointer hover:text-gray-700 bg-transparent border-none p-0"
        >
            Request for quantity
        </button>
    );
};
