export const ColorOptions = ({ colors, selectedColor, onColorClick }) => {
    if (colors.length === 0) return null;

    return (
        <div className="flex flex-col gap-1.5 w-full">
            <p className="body-03 font-medium">Color</p>
            <div className="flex flex-wrap gap-3 pt-1">
                {colors.map((color) => (
                    <div
                        key={color}
                        className={`w-5 h-5 cursor-pointer transition-all rounded-full ${selectedColor === color ? 'ring-1 ring-offset-1 ring-[#272727]' : null}`}
                        style={{ backgroundColor: color }}
                        onClick={() => onColorClick(color)}
                        title={color}
                    />
                ))}
            </div>
        </div>
    );
};
