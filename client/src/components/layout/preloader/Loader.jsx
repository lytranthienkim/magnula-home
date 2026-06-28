// Preloader component - splash screen hiển thị lần đầu vào web
'use client'

import { motion } from 'framer-motion'
import {
    loaderContainerVariants,
    loaderTitleVariants,
    loaderSubtitleVariants,
    loaderBodyVariants
} from '@/framer/loaderVariants'

export default function Loader() {
    return (
        <div className="w-full h-screen flex flex-col items-center justify-center fixed inset-0 z-50 bg-background-primary">
            <motion.div
                className="flex flex-col items-center justify-center gap-2"
                variants={loaderContainerVariants}
                initial="hidden"
                animate="visible"
            >
                <motion.h2
                    className="text-primary font-damion text-4xl"
                    variants={loaderTitleVariants}
                >
                    Magnula
                </motion.h2>

                <motion.p
                    className="font-display-semibold uppercase body-02 text-primary tracking-tight"
                    variants={loaderSubtitleVariants}
                >
                    Designed with purpose
                </motion.p>

                <motion.p
                    className="font-display-regular body-03 text-primary max-w-2xl text-center leading-relaxed px-6"
                    variants={loaderBodyVariants}
                >
                    Magnula's journey is not just about making furniture. It's about helping people feel that they've created something truly good for their family, a lasting symbol of care, pride, and belonging that will be cherished for generations.
                </motion.p>
            </motion.div>
        </div>
    )
}
