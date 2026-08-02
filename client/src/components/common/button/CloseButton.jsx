import { AiOutlineClose } from "react-icons/ai";

export const CloseButton = ({ onClick }) => {
    return (
        <button onClick={onClick}>
            <AiOutlineClose size={14} className='cursor pointer' />
        </button>
    );
};
