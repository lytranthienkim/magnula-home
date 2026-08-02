export const CartActionButton = ({ label, onClick }) => {
    return (
        <button onClick={onClick} className="w-full bg-black body-02 text-third py-2 uppercase">
            {label}
        </button>
    );
};
