export const HomeContent01 = () => {
    return (
        <div className="sticky top-0 w-full h-screen overflow-hidden flex flex-col md:flex-row items-center justify-between padding-body bg-background-primary border-t-[0.25px] border-b-[0.25px] border-[#272727] gap-3 z-10">
            
            {/* BLOCK 1 (Chữ + Hình họa): Nằm TRÊN trên Mobile, chiếm 70vh */}
            <div className="w-full h-[45vh] md:w-[50%] lg:w-[50%] md:h-full flex flex-col justify-center items-center gap-6 md:gap-20">
                <div className="max-w-sm md:max-w-xs lg:max-w-lg flex flex-col items-center justify-center gap-2 px-4 md:px-0">
                    <h3 className="font-display-ss-regular text-center">To inspire <span className="font-display-ss-italic">greatness</span> in people</h3>
                    <p className="body-03 font-display-regular text-center">
                    By helping them create homes for their families where every piece of furniture becomes a quiet legacy of care.
                    </p>
                </div>
                <div className="w-full flex items-center justify-center overflow-hidden">
                    {/* Tinh chỉnh w-[85vw] trên mobile để đồng bộ thị giác với Content01 */}
                    <img 
                        src='/home/ellora.svg' 
                        className="w-[80vw] md:w-[45vw] h-auto object-cover" 
                        alt="Magnes Graphic" 
                    />
                </div>
            </div>

            {/* BLOCK 2 (Ảnh lớn): Nằm DƯỚI trên Mobile, chiếm 30vh */}
            <div className="w-full h-[55vh] md:w-[50%] lg:w-[50%] md:h-full flex items-center justify-center md:justify-end overflow-hidden">
                {/* Trên mobile ảnh chiếm trọn h-full của block 30vh, trên desktop giữ nguyên tỷ lệ responsive cũ của bạn */}
                <img 
                    src='/home/home-ellora.svg' 
                    className="w-full h-full md:w-[40vw] md:h-[50vh] lg:h-full object-cover" 
                    alt="Home Magnes" 
                />
            </div>
        </div>
    )
}