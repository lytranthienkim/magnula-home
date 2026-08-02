import { useEffect, useState, useRef } from "react";

export const CustomSelectField = ({ label, options, selectedValue, onSelect, placeholder = "---" }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
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
            <p className="body-03 font-medium">{label}</p>
            <div className="relative">
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-full text-left body-03
                               border-[0.25px] border-[#272727] py-2 px-3 bg-background-primary
                               focus:outline-none rounded-none flex justify-between items-center"
                >
                    <span className="truncate pr-4">{displayText}</span>
                </button>

                {isOpen && (
                    <div className="absolute  left-0 w-full mt-[-1px] bg-background-primary
                                    border-[0.25px] border-[#272727] rounded-none  max-h-48 overflow-y-auto  z-[800]">
                        <button
                            type="button"
                            onClick={() => {
                                onSelect(null);
                                setIsOpen(false);
                            }}
                            className="w-full text-left py-2 px-3 body-03  transition-colors cursor-pointer"
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
                                className={`w-full text-left py-2 px-3 body-03  cursor-pointer hover:bg-black hover:text-third transitions-color duration-100 cursor-pointer
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
