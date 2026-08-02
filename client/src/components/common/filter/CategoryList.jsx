export const CategoryList = ({ categories, selectedCategory, onCategoryClick }) => {
    return (
        <div className="flex flex-wrap items-center gap-3 md:gap-5 lg:gap-10">
            {categories.map((c) => {
                const isActive = selectedCategory === c.categoryName;
                return (
                    <p
                        key={c.id}
                        className={`uppercase body-03 cursor-pointer transition-all ${isActive ? 'font-[500]' : 'font-[400] hover:font-[500]'}`}
                        onClick={() => onCategoryClick(c.categoryName)}
                    >
                        {c.categoryName}
                    </p>
                );
            })}
        </div>
    );
};
