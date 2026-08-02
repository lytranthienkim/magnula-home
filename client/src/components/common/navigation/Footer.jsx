'use client'

export const Footer = () => {
    return (
        <footer className="w-full h-fit bg-background-primary flex flex-col mt-5 md:mt-10 relative z-50">
            {/* Footer section */}
            {/* Main content */}
            <div className="w-full flex flex-col items-center justify-center padding-wide gap-4 mt-4">
                {/* Brand description */}
                <div className="flex flex-col items-center justify-center py-2 gap-4 md:gap-6">
                    <h2 className="text-[60px] md:text-[120px] font-damion leading-[1]">
                        Magnula
                    </h2>
                    <p className="max-w-[700px] body-03 text-center">
                        Simplicity is never ordinary — it is the art of refining every detail until only essential beauty remains. Our philosophy embraces clean forms, timeless elegance, and natural materials that speak for themselves.
                    </p>
                </div>

                {/* Contact information */}
                <address className="w-full grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-0 not-italic uppercase text-center">
                    <div className="md:text-left">
                        <a 
                            href="tel:+919431990482" 
                            className="body-03 hover:opacity-75 transition-opacity"
                        >
                            +91 9431990482
                        </a>
                    </div>
                    
                    <div className="md:text-center">
                        <a 
                            href="mailto:magnulahome@gmail.com" 
                            className="body-03 hover:opacity-75 transition-opacity"
                        >
                            magnulahome@gmail.com
                        </a>
                    </div>
                    
                    <div className="md:text-right">
                        <span className="body-03">
                            Indore, Madhya Pradesh, 453111
                        </span>
                    </div>
                </address>
            </div>

            <hr className="border-t-[0.25px] border-primary/30 my-1" />
            
            <div className="w-full text-center py-1">
                <small className="body-03 text-center opacity-70 block">
                    © Magnula Home. All rights reserved 2025.
                </small>
            </div>
        </footer>
    );
};