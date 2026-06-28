'use client'

import { HiOutlineMenuAlt4 } from "react-icons/hi";
import Link from "next/link"
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { MENU } from "@/constants/menu";
import { MobileMenu } from "./MobileMenu";
import { CartModal } from "../modal/cart/CartModal";
import { useSelector } from "react-redux";

export const Navbar = () => {
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

    const cartCount = useSelector((state) => state.cart.totalQuantity);

    return (
        <nav className="relative bg-background-primary w-full flex flex-row justify-between items-center padding-wide z-[999]">
            <div className="flex flex-row item-start gap-1 md:gap-1.5">
                <img src='/common/logo.svg' className="w-[18px] md:w-[25px]" loading="lazy"></img>
                <Link href={'/'}>
                    <p className="text-[25px] md:text-[35px] font-damion leading-[1]">Magnula</p>
                </Link>
            </div>

            <div className="hidden relative lg:flex flex-row items-center justify-center gap-18">
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
                        <p className="text-[10px] font-display-semibold text-primary ">
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
    )
}