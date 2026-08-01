import Image from "next/image"

export const HomeContent03 = () => {
    return (
        <div className="sticky top-0 w-full h-screen overflow-hidden flex flex-col md:flex-row items-center justify-between padding-body bg-background-primary border-t-[0.25px] border-b-[0.25px] border-[#272727] gap-3 z-30">
            
            <div className="w-full h-[45vh] md:w-[50%] lg:w-[50%] md:h-full flex flex-col justify-center items-center gap-6 md:gap-20">
                <div className="max-w-sm md:max-w-xs lg:max-w-full flex flex-col items-center justify-center gap-2 px-4 md:px-0">
                    <h3 className="font-display-ss-regular text-center">Magnula's journey is not just about making  <span className="font-display-ss-italic">   furniture</span></h3>
                    <p className="max-w-xl body-03 font-display-regular text-center">
                        It's about helping people feel that they've created something truly good for their family, a lasting symbol of care, pride, and belonging that will be cherished for generations.
                    </p>
                </div>
                <div className="relative w-full flex items-center justify-center overflow-hidden h-[200px] md:h-[300px]">
                    <Image
                        src='/home/magnes.png'
                        alt="Magnes Graphic"
                        fill
                        className="object-cover"
                    />
                </div>
            </div>

            <div className="relative w-full h-[55vh] md:w-[50%] lg:w-[50%] md:h-full flex items-center justify-center md:justify-end overflow-hidden">
                <Image
                    src='/home/home-magnes.jpg'
                    alt="Home Magnes"
                    fill
                    className="object-cover"
                />
            </div>

        </div>
    )
}