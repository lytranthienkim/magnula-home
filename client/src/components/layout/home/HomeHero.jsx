'use client'

import { useLayoutEffect, useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MENU } from "@/constants/menu"
import { getMenuItemMotion } from '@/framer/menuScrollVariants';

export const HomeHero = () => {
    const [isMounted, setIsMounted] = useState(false); // component mounted state for initial animation
    const [progress, setProgress] = useState(0); //0 - 1 progress of the scroll animation
    const [isExpanded, setIsExpanded] = useState(false);
    const trackRef = useRef(null); // ref to the track element to measure its position in the viewport

    // useLayoutEffect to track the scroll position and update the progress state
    useLayoutEffect(() => {
        const handleScroll = () => {
            if (!trackRef.current) return;
            const rect = trackRef.current.getBoundingClientRect(); // get the position of the track element relative to the viewport
            const currentScroll = -rect.top; // how much the track has scrolled past the top of the viewport
            const animationDistance = window.innerHeight * 0.4; // the distance over which we want to animate the progress (40% of the viewport height)
            const currentProgress = Math.min(1, Math.max(0, currentScroll / animationDistance)); // clamp the progress between 0 and 1
            setProgress(currentProgress); // update the progress state
        };

        window.addEventListener('scroll', handleScroll, { passive: true }); //scroll event 
        handleScroll();

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    useEffect(() => {
        setIsMounted(true); // set the mounted state to true to trigger the initial animation
        const timer = setTimeout(() => {
            setIsExpanded(true); 
        }, 500); // delay the expansion of the clip-path to create a zoom-in effect after the component is mounted

        return () => clearTimeout(timer);
    }, []);

    // progress is a value between 0 and 1 we can use it to control the opacity of the background overlay
    const bgOpacity = progress * 0.20;
    const titleProgress = Math.min(1, Math.max(0, progress / 0.4));

    return (
        <div ref={trackRef} className="relative w-full h-[250vh] bg-transparent"> {/*set the height of the track to 250vh to allow for scrolling and animation*/}
            <div
                className="sticky top-0 left-0 w-full h-screen overflow-hidden bg-[url('/home/home-thumbnail.svg')] bg-no-repeat bg-cover bg-center flex justify-center z-0"
                style={{
                    opacity: isMounted ? 1 : 0, // fade in the background image on mount
                    clipPath: isExpanded ? 'inset(0% 0% 0% 0%)' : 'inset(44% 40% 44% 40%)', // initial clip-path to create a zoom-in effect
                    transition: 'opacity 0.8s ease, clip-path 1.2s cubic-bezier(0.19, 1, 0.22, 1)' // transition for the zoom-in effect
                }}
            >

                <div className="absolute inset-0 bg-[#413B33] pointer-events-none" style={{ opacity: bgOpacity }} />

                <div className="w-full h-full flex flex-col justify-center md:justify-end md:items-center padding-wide relative z-10">
                    {/* Title Magnula */}
                    <div
                        className="lg:hidden w-full text-[80px] md:text-[160px] font-damion text-third flex items-center md:items-start justify-center md:justify-start leading-[1.5]"
                        style={{
                            opacity: titleProgress,
                            transform: `translateY(${(1 - titleProgress) * 15}px)`, // translateY from 15px to 0px as titleProgress goes from 0 to 1
                            pointerEvents: titleProgress === 0 ? 'none' : 'auto', // disable pointer events when the title is not visible
                            transition: 'opacity 0.8s cubic-bezier(0.25, 1, 0.5, 1), transform 0.8s cubic-bezier(0.25, 1, 0.5, 1)', // transition for the fade-in and translateY effect
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