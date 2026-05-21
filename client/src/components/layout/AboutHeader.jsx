export const AboutHeader = () => {
    return (
        <div className="w-full h-full flex flex-col padding-body gap-[48px] lg:gap-[12px] mt-[32px]">
            <div className="flex flex-col gap-[12px]">
                <div className="max-w-[70vw] lg:max-w-[60vw] flex flex-col gap-[16px]">
                    <h3 className="leading-[1.25] font-[600]">
                        Magnula was born from a simple but powerful belief that the spaces we live in shape the way we feel, connect, and grow with the people we love.
                    </h3>
                    <p className="body-03">
                        It began with a craftsman who was never satisfied with ordinary furniture. To him, wood was not just a material it was a living canvas carrying stories of the earth, waiting to be shaped into something meaningful. Every curve, every joint, every finish was an opportunity to create more than utility, it was a chance to create belonging.
                    </p>
                    <p className="body-03">
                        What started as a passion for timeless design soon grew into a vision to make simplicity magnificent. From this vision came Magnula: a name that embodies strength, simplicity, and timeless magnificence, where natural beauty meets refined craftsmanship.
                    </p>
                </div>
                <img src='/about/about-thumbnail.jpg' alt="about thumbnail" className="w-full" />
            </div>
            <div className="flex flex-col items-start lg:flex-row lg:items-end gap-[12px]">
                <div className="max-w-[70vw] lg:max-w-[60vw] flex flex-col gap-[16px]">
                    <p className="body-03">
                        From its earliest sketches, Magnula has held onto one promise to strip away excess and let purity, proportion, and texture take the spotlight. Each piece is designed not only to fill a room but to inspire moments of pride, comfort, and togetherness within it.
                    </p>
                    <h3 className="leading-[1.25] font-[600]">
                        Magnula's journey is not just about making furniture. It's about helping people feel that they've created something truly good for their home and their family a quiet greatness that lasts for generations.
                    </h3>
                </div>
                <div className="flex items-end justify-end">
                    <img src='/about/about-thumbnail-02.jpg' alt="about thumbnail" className="w-[600px]" />
                </div>
            </div>
        </div>
    )
}