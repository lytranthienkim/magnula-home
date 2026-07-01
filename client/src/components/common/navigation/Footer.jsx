'use client'

export const Footer = () => {
    return (
        <div className="w-full h-fit bg-background-primary flex flex-col mt-5 md:mt-10 z-[50]">
            <div className="w-full flex flex-col items-center justify-center padding-wide gap-4 mt-4">
                <div className="flex flex-col items-center justify-center py-2 gap-4 md:gap-6">
                    <p className="text-[60px] md:text-[120px] font-damion leading-[1]">Magnula</p>
                    <p className="max-w-[700px] font-display-regular body-03 text-center ">
                        Simplicity is never ordinary — it is the art of refining every detail until only essential beauty remains. Our philosophy embraces clean forms, timeless elegance, and natural materials that speak for themselves.
                    </p>
                </div>
                <div className="w-full flex flex-col items-center justify-center gap-2 md:grid md:grid-cols-3 md:gap-0 uppercase">
                    <p className="body-03 font-[500] text-left font-display-regular">+91 9431990482</p>
                    <p className="body-03 font-[500] text-center font-display-regular">magnulahome@gmail.com</p>
                    <p className="body-03 font-[500] text-right font-display-regular">Indore, Madhya Pradesh, 453111</p>
                </div>
            </div>
            <hr className="border-t-[0.25px] border-[#272727]/30 my-1"></hr>
            <p className="body-03 text-center py-1 opacity-70 font-display-regular">© Magnula Home. All rights reserved 2025.</p>
        </div>
    )
}