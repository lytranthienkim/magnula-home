import Image from "next/image"

export const HomeContent02 = () => {
    return (
        <div className="sticky top-0 w-full h-screen overflow-hidden flex flex-col md:flex-row items-center justify-between padding-body bg-background-primary border-t-[0.25px] border-b-[0.25px] border-[#272727] gap-3 z-20">
            <div className="relative w-full h-[60vh] md:w-[50%] lg:w-[40%] md:h-full overflow-hidden">
                <Image
                    src='/home/home-beluga.jpg'
                    alt="Home Beluga"
                    fill
                    className="object-cover md:object-left lg:object-center"
                />
            </div>

            <div className="w-full h-[40vh] md:w-[50%] lg:w-[60%] md:h-full flex flex-col justify-center items-center gap-10 md:gap-20">
                <div className="max-w-sm md:max-w-xs lg:max-w-xl flex flex-col items-center justify-center gap-1 md:gap-2 px-4 md:px-0">
                    <h3 className="font-display-ss-regular text-center">For people who <span className="font-display-ss-italic">deeply care</span> about their family</h3>
                    <p className="body-03 font-display-regular text-center line-clamp-3 md:line-clamp-none">
                        Magnula represents more than furniture — it represents the quiet greatness of creating a home where their family can thrive. 
                        Every table becomes a gathering place, every chair a moment of rest, every piece a reflection of the love and responsibility they carry.
                    </p>
                </div>
                
                <div className="relative w-full flex items-center justify-center md:justify-end overflow-hidden h-[200px] md:h-[300px]">
                    <Image
                        src='/home/beluga.png'
                        alt="Beluga Graphic"
                        fill
                        className="object-cover"
                    />
                </div>
            </div>

        </div>
    )
}