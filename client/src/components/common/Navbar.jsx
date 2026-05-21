'use client'

import { MENU } from "@/app/constants/menu"
import { HiOutlineMenuAlt4 } from "react-icons/hi";
import Link from "next/link"
import { useState } from "react";

export const Navbar = () => {
    const [activeTab, setActiveTab] = useState(null);
    
    return (
        <nav className="flex flex-row justify-between items-center padding-wide">
            <Link href={'/'}>
                <img src='/common/logo.svg' alt="logo" className="w-[25px] h-[25px] lg:w-[40px] lg:h-[40px]" />
            </Link>
            <div className="hidden lg:flex flex-row items-center justify-center gap-[56px]">
                {MENU.map((nav, index) => (
                    <ul key={index}>
                        <Link href={nav.link}>{nav.tab}</Link>
                    </ul>
                ))}
            </div>
            <div className="block lg:hidden" >
                <HiOutlineMenuAlt4 style={24} />
            </div>
        </nav>
    )
}