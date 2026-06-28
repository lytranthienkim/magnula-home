export const HomeContent02 = () => {
    return (
        /* Đi theo chiều dọc xuôi dòng `flex-col` trên mobile, và hàng ngang `md:flex-row` trên desktop */
        <div className="sticky top-0 w-full h-screen overflow-hidden flex flex-col md:flex-row items-center justify-between padding-body bg-background-primary border-t-[0.25px] border-b-[0.25px] border-[#272727] gap-3 z-20">
            
            {/* BLOCK 1 (Ảnh lớn): Nằm TRÊN trên Mobile, chiếm 70vh */}
            <div className="w-full h-[60vh] md:w-[50%] lg:w-[40%] md:h-full overflow-hidden">
                <img 
                    src='/home/home-beluga.svg' 
                    className="w-full h-full md:object-left lg:object-center object-cover" 
                    alt="Home Beluga" 
                />
            </div>

            {/* BLOCK 2 (Chữ + Hình họa): Nằm DƯỚI trên Mobile, chiếm 30vh */}
            <div className="w-full h-[40vh] md:w-[50%] lg:w-[60%] md:h-full flex flex-col justify-center items-center gap-10 md:gap-20">
                <div className="max-w-sm md:max-w-xs lg:max-w-xl flex flex-col items-center justify-center gap-1 md:gap-2 px-4 md:px-0">
                    <h3 className="font-display-ss-regular text-center">For people who <span className="font-display-ss-italic">deeply care</span> about their family</h3>
                    {/* Trên mobile không gian 30vh khá hẹp, nên line-clamp-3 hoặc line-clamp-4 sẽ giúp text không bị tràn ra ngoài */}
                    <p className="body-03 font-display-regular text-center line-clamp-3 md:line-clamp-none">
                        Magnula represents more than furniture — it represents the quiet greatness of creating a home where their family can thrive. 
                        Every table becomes a gathering place, every chair a moment of rest, every piece a reflection of the love and responsibility they carry.
                    </p>
                </div>
                
                <div className="w-full flex items-center justify-center md:justify-end overflow-hidden">
                    {/* Tinh chỉnh ảnh họa nhỏ lại một chút (w-[50vw]) để vừa vặn trong 30vh còn lại của mobile */}
                    <img 
                        src='/home/beluga.svg' 
                        className="w-[80vw] md:w-[45vw] lg:w-[50vw] h-auto object-cover" 
                        alt="Beluga Graphic" 
                    />
                </div>
            </div>

        </div>
    )
}