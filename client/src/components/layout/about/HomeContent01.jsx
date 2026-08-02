'use client'

import Image from "next/image"

export const HomeContent01 = () => {
    return (
        <section className="sticky top-0 w-full h-screen overflow-hidden flex flex-col lg:flex-row items-center justify-between bg-background-primary border-t-[0.25px] border-b-[0.25px] border-primary gap-4 md:gap-6 z-10 padding-wide">
            {/* Left section */}
            <div className="w-full h-[45vh] md:h-[40vh] lg:w-1/2 lg:h-full flex flex-col justify-center items-center gap-4 md:gap-8 lg:gap-16">
                {/* Content wrapper */}
                <div className="max-w-sm md:max-w-md lg:max-w-lg flex flex-col items-center justify-center gap-2 px-4 md:px-0">
                    <h3 className="font-seasons-bold text-center text-xl md:text-2xl lg:text-3xl">
                        To inspire <span className="font-seasons-italic">greatness</span> in people
                    </h3>
                    <p className="body-01 text-center text-sm md:text-base">
                        By helping them create homes for their families where every piece of furniture becomes a quiet legacy of care.
                    </p>
                </div>

                <div className="relative w-full flex items-center justify-center overflow-hidden h-[160px] md:h-[280px] lg:h-[320px]">
                    <Image
                        src="/home/ellora.png"
                        alt="Magnes Graphic"
                        fill
                        quality={100}
                        unoptimized
                        className="object-contain object-center"
                    />
                </div>
            </div>

            {/* Right section */}
            <div className="relative w-full h-[55vh] md:h-[60vh] lg:w-1/2 lg:h-full flex items-center justify-center lg:justify-end overflow-hidden">
                <Image
                    src="/home/home-ellora.jpg"
                    alt="Home Ellora"
                    fill
                    quality={100}
                    priority
                    unoptimized
                    className="object-cover object-bottom"
                />
            </div>
        </section>
    );
};