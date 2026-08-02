'use client'

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MENU } from "@/constants/menu";

export const HomeSection = () => {
    const [isMounted, setIsMounted] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        const timer = setTimeout(() => {
            setIsExpanded(true);
        }, 500);

        return () => clearTimeout(timer);
    }, []);

    return (
        <section className="relative w-full h-screen bg-transparent">
            <div
                className="w-full h-full overflow-hidden bg-[url('/home/home-thumbnail.png')] bg-no-repeat bg-cover bg-center flex justify-center z-0"
                style={{
                    opacity: isMounted ? 1 : 0,
                    clipPath: isExpanded ? 'inset(0% 0% 0% 0%)' : 'inset(44% 40% 44% 40%)',
                    transition: 'opacity 0.8s ease, clip-path 1.2s cubic-bezier(0.19, 1, 0.22, 1)'
                }}
            >
                <div className="w-full h-full flex flex-col justify-center md:justify-end md:items-center padding-wide relative z-10">

                    {/* Title < md */}
                    <div className="md:hidden w-full text-[90px] md:text-[120px] font-damion text-third flex items-center md:items-start justify-center md:justify-start leading-[1.5]">
                        Magnula
                    </div>

                    {/* Menu item */}
                    <nav className="flex md:absolute flex w-full h-[30vh] md:h-full flex-col md:flex-row items-center justify-center gap-8 md:gap-40">
                        {MENU.map((item, index) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: isExpanded ? 1 : 0, y: isExpanded ? 0 : 10 }}
                                transition={{
                                    duration: 0.8,
                                    ease: [0.25, 1, 0.5, 1],
                                    delay: 0.5 + index * 0.05,
                                }}
                            >
                                {/* Link desktop */}
                                <div className="hidden md:block">
                                    <a
                                        href={item.link}
                                        className="inline-block px-3 py-0.5 bg-background-primary/80 hover:bg-background-primary transition-all duration-[300ms]"
                                    >
                                        {item.tab}
                                    </a>
                                </div>

                                {/* Link mobile */}
                                <div className="block md:hidden w-[120px]">
                                    <a href={item.link} className="inline-block text-center w-full py-1 bg-background-primary/80 hover:bg-background-primary transition-all duration-[300ms]">
                                        {item.tab}
                                    </a>
                                </div>
                            </motion.div>
                        ))}
                    </nav>

                    {/* Title > md */}
                    <div className="hidden w-full text-[160px] font-damion text-third md:flex items-center md:items-start justify-center md:justify-start leading-[1.25]">
                        Magnula
                    </div>

                </div>
            </div>
        </section>
    );
};