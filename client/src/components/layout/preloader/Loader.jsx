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
                    className="font-damion text-[60px]"
                    variants={loaderTitleVariants}
                >
                    Magnula
                </motion.h2>

                <motion.p
                    className="uppercase body-01"
                    variants={loaderSubtitleVariants}
                >
                    Designed with purpose
                </motion.p>

                <motion.p
                    className="body-02 max-w-2xl text-center px-6"
                    variants={loaderBodyVariants}
                >
                    Magnula&apos;s journey is not just about making furniture. It&apos;s about helping people feel that they&apos;ve created something truly good for their family, a lasting symbol of care, pride, and belonging that will be cherished for generations.
                </motion.p>
            </motion.div>
        </div>
    )
}
