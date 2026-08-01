import Image from "next/image"

export const HomeContent01 = () => {
    return (
        <div className="sticky top-0 w-full h-screen overflow-hidden flex flex-col md:flex-row items-center justify-between padding-body bg-background-primary border-t-[0.25px] border-b-[0.25px] border-[#272727] gap-3 z-10">
            <div className="w-full h-[45vh] md:w-[50%] lg:w-[50%] md:h-full flex flex-col justify-center items-center gap-6 md:gap-20">
                <div className="max-w-sm md:max-w-xs lg:max-w-lg flex flex-col items-center justify-center gap-2 px-4 md:px-0">
                    <h3 className="font-display-ss-regular text-center">To inspire <span className="font-display-ss-italic">greatness</span> in people</h3>
                    <p className="body-03 font-display-regular text-center">
                    By helping them create homes for their families where every piece of furniture becomes a quiet legacy of care.
                    </p>
                </div>
                <div className="relative w-full flex items-center justify-center overflow-hidden h-[200px] md:h-[300px]">
                    <Image
                        src='/home/ellora.png'
                        alt="Magnes Graphic"
                        fill
                        className="object-cover"
                    />
                </div>
            </div>

            <div className="relative w-full h-[55vh] md:w-[50%] lg:w-[50%] md:h-full flex items-center justify-center md:justify-end overflow-hidden">
                <Image
                    src='/home/home-ellora.jpg'
                    alt="Home Ellora"
                    fill
                    className="object-cover"
                />
            </div>
        </div>
    )
}