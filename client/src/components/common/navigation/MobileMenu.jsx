'use client'

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MENU } from '@/constants/menu';
import { menuContainerVariants, menuItemVariants } from '@/framer/menuVariants';

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
                    className="fixed inset-0 bg-background-primary/80 backdrop-blur-sm z-[990]"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                />
            )}

            {isOpen && (
                <motion.nav
                    key="menu"
                    aria-label="Mobile Navigation"
                    className="h-full w-[50vw] fixed top-0 right-0 bg-background-primary z-[999] shadow-lg"
                    variants={menuContainerVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                >
                    {/* Menu container */}
                    <div className="padding-wide flex flex-col gap-6 pt-6">

                        {/* Close button */}
                        <button
                            type="button"
                            onClick={onClose}
                            className="body-01 text-right font-medium hover:opacity-70 transition-opacity cursor-pointer"
                            aria-label="Close Menu"
                        >
                            Close
                        </button>

                        {/* Navigation links */}
                        <ul className="flex flex-col gap-4">
                            {MENU.map((nav, index) => (
                                <li key={nav.id || index}>
                                    <motion.div
                                        variants={menuItemVariants}
                                        onClick={onClose}
                                    >
                                        <Link
                                            href={nav.link}
                                            className={`block body-01 text-right transition-opacity duration-200 hover:opacity-70 ${isActive(nav.link) ? 'font-medium' : ''
                                                }`}
                                        >
                                            {nav.tab}
                                        </Link>
                                    </motion.div>
                                </li>
                            ))}
                        </ul>

                    </div>
                </motion.nav>
            )}
        </AnimatePresence>
    );
};