'use client'

import Image from "next/image"

export const HomeContent02 = () => {
    return (
        <section className="sticky top-0 w-full h-screen overflow-hidden flex flex-col lg:flex-row items-center justify-between bg-background-primary border-t-[0.25px] border-b-[0.25px] border-primary gap-4 md:gap-6 z-20 padding-wide">
            {/* Image section */}
            <div className="relative w-full h-[55vh] md:h-[60vh] lg:w-[40%] lg:h-full overflow-hidden">
                <Image
                    src="/home/home-beluga.jpg"
                    alt="Home Beluga"
                    fill
                    priority
                    quality={100}
                    unoptimized
                    className="object-cover object-bottom"
                />
            </div>

            {/* Content section */}
            <div className="w-full h-[45vh] md:h-[40vh] lg:w-[60%] lg:h-full flex flex-col justify-center items-center gap-4 md:gap-8 lg:gap-16">
                {/* Text wrapper */}
                <div className="max-w-sm md:max-w-md lg:max-w-xl flex flex-col items-center justify-center gap-2 px-4 md:px-0">
                    <h3 className="font-seasons-bold text-center text-xl md:text-2xl lg:text-3xl">
                        For people who <span className="font-seasons-italic">deeply care</span> about their family
                    </h3>
                    <p className="body-01 text-center text-sm md:text-base line-clamp-3 md:line-clamp-none">
                        Magnula represents more than furniture — it represents the quiet greatness of creating a home where their family can thrive.
                        Every table becomes a gathering place, every chair a moment of rest, every piece a reflection of the love and responsibility they carry.
                    </p>
                </div>

                <div className="relative w-full flex items-center justify-center lg:justify-end overflow-hidden h-[160px] md:h-[280px] lg:h-[340px]">
                    <Image
                        src="/home/beluga.png"
                        alt="Beluga Graphic"
                        fill
                        quality={100}
                        unoptimized
                        className="object-contain object-center lg:object-right"
                    />
                </div>
            </div>
        </section>
    );
};