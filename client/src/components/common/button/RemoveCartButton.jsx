import { PiTrashSimple } from "react-icons/pi";

export const RemoveCartButton = ({ onClick }) => {
    return (
        <button onClick={onClick} className="flex-shrink-0">
            <PiTrashSimple size={14} />
        </button>
    );
};
