'use client'

import { useLayoutEffect, useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MENU } from "@/constants/menu"
import { getMenuItemMotion } from '@/framer/menuScrollVariants';

export const HomeHero = () => {
    const [progress, setProgress] = useState(0);
    const [isMounted, setIsMounted] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const trackRef = useRef(null);

    useEffect(() => {
        setIsMounted(true);
        const timer = setTimeout(() => {
            setIsExpanded(true);
        }, 500);

        return () => clearTimeout(timer);
    }, []);

    useLayoutEffect(() => {
        const handleScroll = () => {
            if (!trackRef.current) return;
            const rect = trackRef.current.getBoundingClientRect();
            const currentScroll = -rect.top;
            const animationDistance = window.innerHeight * 0.4;
            const currentProgress = Math.min(1, Math.max(0, currentScroll / animationDistance));
            setProgress(currentProgress);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const bgOpacity = progress * 0.20;
    const titleProgress = Math.min(1, Math.max(0, progress / 0.4));

    return (
        <div ref={trackRef} className="relative w-full h-[250vh] bg-transparent">
            <div
                className="sticky top-0 left-0 w-full h-screen overflow-hidden bg-[url('/home/home-thumbnail.svg')] bg-no-repeat bg-cover bg-center flex justify-center z-0"
                style={{
                    opacity: isMounted ? 1 : 0,
                    clipPath: isExpanded ? 'inset(0% 0% 0% 0%)' : 'inset(44% 40% 44% 40%)',
                    transition: 'opacity 0.8s ease, clip-path 1.2s cubic-bezier(0.19, 1, 0.22, 1)'
                }}
            >

                <div className="absolute inset-0 bg-[#413B33] pointer-events-none" style={{ opacity: bgOpacity }} />

                <div className="w-full h-full flex flex-col justify-center md:justify-end md:items-center padding-wide relative z-10">
                    {/* Title Magnula */}
                    <div
                        className="lg:hidden w-full text-[80px] md:text-[160px] font-damion text-third flex items-center md:items-start justify-center md:justify-start leading-[1.5]"
                        style={{
                            opacity: titleProgress,
                            transform: `translateY(${(1 - titleProgress) * 15}px)`,
                            pointerEvents: titleProgress === 0 ? 'none' : 'auto',
                            transition: 'opacity 0.8s cubic-bezier(0.25, 1, 0.5, 1), transform 0.8s cubic-bezier(0.25, 1, 0.5, 1)',
                        }}
                    >
                        Magnula
                    </div>
                    {/* Menu - Framer Motion Stagger Animation */}
                    <motion.div className="md:absolute w-full h-fit md:h-full flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 lg:gap-40">
                        {MENU.map((item, index) => {
                            const itemMotion = getMenuItemMotion(index, progress);

                            return (
                                <motion.div
                                    key={item.id}
                                    className="text-third"
                                    style={{
                                        opacity: itemMotion.opacity,
                                        pointerEvents: itemMotion.opacity === 0 ? 'none' : 'auto',
                                    }}
                                    transition={{
                                        duration: 0.8,
                                        ease: [0.25, 1, 0.5, 1],
                                        delay: index * 0.02,
                                    }}
                                >
                                    <motion.div
                                        className="hidden md:block"
                                        animate={{
                                            x: itemMotion.x,
                                        }}
                                        transition={{
                                            duration: 0.8,
                                            ease: [0.25, 1, 0.5, 1],
                                            delay: index * 0.02,
                                        }}
                                    >
                                        <a href={item.link} className="body-01 font-display-regular hover:bg-background-primary hover:text-primary transitions-all duration-400 hover:px-3 hover:py-1">
                                            {item.tab}
                                        </a>
                                    </motion.div>

                                    <motion.div
                                        className="md:hidden"
                                        animate={{
                                            y: itemMotion.y,
                                        }}
                                        transition={{
                                            duration: 0.8,
                                            ease: [0.25, 1, 0.5, 1],
                                            delay: index * 0.02,
                                        }}
                                    >
                                        <a href={item.link} className="body-01 font-display-regular">
                                            {item.tab}
                                        </a>
                                    </motion.div>
                                </motion.div>
                            );
                        })}
                    </motion.div>
                    {/* Title Magnula */}
                    <div
                        className="hidden w-full xl:text-[200px] font-damion text-third lg:flex items-center md:items-start justify-center md:justify-start leading-[1.25]"
                        style={{
                            opacity: titleProgress,
                            transform: `translateY(${(1 - titleProgress) * 15}px)`,
                            pointerEvents: titleProgress === 0 ? 'none' : 'auto',
                            transition: 'opacity 0.8s cubic-bezier(0.25, 1, 0.5, 1), transform 0.8s cubic-bezier(0.25, 1, 0.5, 1)',
                        }}
                    >
                        Magnula
                    </div>
                </div>
            </div>
        </div>
    )
}