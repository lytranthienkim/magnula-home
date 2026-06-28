'use client'

import { useLayoutEffect, useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MENU } from "@/constants/menu"
import Link from "next/link";
import { usePathname } from "next/navigation";
import { HiOutlineMenuAlt4 } from "react-icons/hi";
import { MobileMenu } from '@/components/common/navigation/MobileMenu';
import { CartModal } from '@/components/common/modal/cart/CartModal';
import { useSelector } from 'react-redux';

export const AboutHero = () => {
    const [progress, setProgress] = useState(0);
    const [isMounted, setIsMounted] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const trackRef = useRef(null);
    const [showContainer, setShowContainer] = useState(false);
    const [showDecor, setShowDecor] = useState(false);
    const [showText, setShowText] = useState(false);

    const pathname = usePathname();

    const [mounted, setMounted] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const isActive = (link) => {
        if (link === '/' && pathname === '/') return true;
        if (link !== '/' && pathname.startsWith(link)) return true;
        return false;
    };

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

            const scrollAmount = window.scrollY;

            if (scrollAmount > window.innerHeight * 0.2) {
                setShowContainer(true);
            } else {
                setShowContainer(false);
            }

            if (scrollAmount > window.innerHeight * 0.35) {
                setShowDecor(true);
            } else {
                setShowDecor(false);
            }

            if (scrollAmount > window.innerHeight * 0.5) {
                setShowText(true);
            } else {
                setShowText(false);
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const cartCount = useSelector((state) => state.cart.totalQuantity);

    return (
        <div ref={trackRef} className="relative w-full h-[250vh] bg-transparent">
            <div className="sticky top-0 left-0 w-full h-screen overflow-hidden bg-[url('/common/about-thumbnail.svg')] bg-no-repeat bg-cover bg-right xl:bg-center flex items-start justify-start z-0 ">
                <nav className="relative  w-full flex flex-row justify-between items-center padding-wide z-[999]">
                    <div className="flex flex-row item-start gap-1 md:gap-1.5">
                        <img src='/common/logo.svg' className="w-[18px] md:w-[25px]" loading="lazy"></img>
                        <Link href={'/'}>
                            <p className="text-[25px] md:text-[35px] font-damion leading-[1] ">Magnula</p>
                        </Link>
                    </div>

                    <div className="hidden relative lg:flex flex-row items-center justify-center gap-18 ">
                        {MENU.map((nav, index) => (
                            <ul key={index}>
                                <Link href={nav.link} className={`relative transition-all ${isActive(nav.link) ? 'font-display-semibold' : 'font-display-regular'}`}>
                                    <p className="body-02 hover:opacity-70 transition-opacity duration-200">{nav.tab}</p>
                                </Link>
                            </ul>
                        ))}
                        {/* Cart - Desktop */}
                        <button
                            onClick={() => setIsCartOpen(!isCartOpen)}
                            className="hidden lg:flex flex-row items-center gap-2 relative hover:opacity-70 transition-opacity duration-200 cursor-pointer"
                        >
                            <p className="body-03 font-display-regular">Cart</p>
                            {mounted && (
                                <p className="text-[10px] font-display-semibold ">
                                    ({cartCount ? cartCount : 0})
                                </p>
                            )}
                        </button>
                    </div>

                    <div className="flex lg:hidden flex-row items-center gap-6">
                        {/* Cart - Mobile/Tablet */}
                        <button
                            onClick={() => setIsCartOpen(!isCartOpen)}
                            className="relative flex flex-row items-center gap-1 hover:opacity-70 transition-opacity duration-200 cursor-pointer"
                        >
                            <p className="body-01 font-display-regular">Cart</p>
                            {mounted && cartCount > 0 && (
                                <p className="absolute top-[-5] right-[-15] text-[9px] font-display-semibold text-primary">
                                    ({cartCount})
                                </p>
                            )}
                        </button>
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="hover:opacity-70 transition-opacity"
                        >
                            <HiOutlineMenuAlt4 size={22} />
                        </button>
                    </div>

                    <MobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
                    <CartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
                </nav>
                <motion.div
                    className='absolute w-[80vw] md:w-[70vw] xl:w-fit bg-background-primary h-fit p-4 md:px-15 md:py-5 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center gap-3'
                    initial={{ opacity: 0 }}
                    animate={{ opacity: showContainer ? 1 : 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: showDecor ? 1 : 0 }}
                        transition={{ duration: 0.8 }}
                        className='flex items-center justify-center'
                    >
                        <img src='/common/text-about-decor.svg' className='w-full md:w-[80%]' loading="lazy"></img>
                    </motion.div>
                    <motion.p
                        className="font-display-regular body-01 text-center max-w-md xl:max-w-xl"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: showText ? 1 : 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        It began with a <span className="font-display-ss-italic">craftsman</span> who was never satisfied with ordinary furniture. To him, wood was not just a material it was a living canvas carrying stories of the earth, waiting to be shaped into something meaningful. Every curve, every joint, every finish was an opportunity to create more than utility, <span className="font-display-ss-italic">it was a chance to create belonging.</span>
                    </motion.p>
                </motion.div>
            </div>
        </div>
    )
}