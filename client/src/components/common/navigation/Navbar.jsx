'use client'

import { HiOutlineMenuAlt4 } from "react-icons/hi";
import Link from "next/link";
import Image from "next/image";
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
        <header className="relative bg-background-primary w-full flex flex-row justify-between items-center padding-wide z-[999]">
            {/* Header navigation */}
            {/* Brand logo */}
            <div className="flex flex-row items-center gap-1 md:gap-1.5">
                <Image
                    src="/common/logo.svg"
                    alt="Magnula Logo"
                    width={25}
                    height={25}
                    className="w-[18px] md:w-[25px] h-auto"
                    priority
                />
                <Link href="/">
                    <span className="text-[25px] md:text-[35px] font-damion leading-[1] block">
                        Magnula
                    </span>
                </Link>
            </div>

            {/* Desktop navigation */}
            <nav aria-label="Main Navigation" className="hidden relative lg:flex flex-row items-center justify-center">
                <ul className="flex flex-row items-center gap-18">
                    {MENU.map((nav, index) => (
                        <li key={nav.id || index}>
                            <Link
                                href={nav.link}
                                className={`body-02 ${isActive(nav.link) ? 'font-medium' : 'font-regular'
                                    }`}
                            >
                                {nav.tab}
                            </Link>
                        </li>
                    ))}
                </ul>

                {/* Cart button */}
                <button
                    type="button"
                    onClick={() => setIsCartOpen(!isCartOpen)}
                    className="hidden lg:flex flex-row items-center gap-2 ml-12 transition-opacity duration-200 cursor-pointer"
                    aria-label="Open Cart"
                >
                    <p className="body-02">Cart</p>
                    {mounted && (
                        <span className="text-[10px] text-primary">
                            ({cartCount ? cartCount : 0})
                        </span>
                    )}
                </button>
            </nav>

            {/* Mobile actions */}
            <div className="flex lg:hidden flex-row items-center gap-6">
                {/* Mobile cart */}
                <button
                    type="button"
                    onClick={() => setIsCartOpen(!isCartOpen)}
                    className="relative flex flex-row items-center gap-1  transition-opacity duration-200 cursor-pointer"
                    aria-label="Open Cart"
                >
                    <p className="body-02">Cart</p>
                    {mounted && cartCount > 0 && (
                        <span className="absolute -top-1 -right-3 text-[9px] text-primary">
                            ({cartCount})
                        </span>
                    )}
                </button>

                {/* Menu toggle */}
                <button
                    type="button"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className=" transition-opacity"
                    aria-label="Toggle Mobile Menu"
                >
                    <HiOutlineMenuAlt4 size={22} />
                </button>
            </div>

            {/* Modal components */}
            <MobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
            <CartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
        </header>
    );
};