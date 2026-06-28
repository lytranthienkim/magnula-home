'use client'

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MENU } from '@/constants/menu';
import { menuContainerVariants, menuItemVariants } from '@/framer/menuVariants';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';

export const MobileMenu = ({ isOpen, onClose }) => {
    const pathname = usePathname();

    const isActive = (link) => {
        if (link === '/' && pathname === '/') return true;
        if (link !== '/' && pathname.startsWith(link)) return true;
        return false;
    };
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    key="backdrop"
                    className="fixed inset-0 bg-background-primary z-200"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                />
            )}
            {isOpen && (
                <motion.div
                    key="menu"
                    className="h-full w-[50vw] fixed top-5 right-0 right-0 bg-background z-[999]"
                    variants={menuContainerVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                >
                    <div className="padding-wide flex flex-col gap-4">


                        <button
                            onClick={onClose}
                            className='body-01 text-right font-display-regular font-[500] hover:opacity-70 transition-opacity cursor-pointer'
                        >
                            Close
                        </button>

                        {MENU.map((nav, index) => (
                            <motion.div
                                key={index}
                                variants={menuItemVariants}
                                onClick={onClose}
                            >
                                <Link href={nav.link} className={`block body-01 text-right transition-all ${isActive(nav.link) ? 'font-display-semibold' : 'font-display-regular'}`}>
                                    {nav.tab}
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
