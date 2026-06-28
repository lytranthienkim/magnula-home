// Preloader wrapper - hiển thị splash screen lần đầu tiên vào web
'use client'

import { useEffect, useState } from 'react'
import Loader from '@/components/layout/preloader/Loader'

export function PreloaderWrapper({ children }) {
    const [showLoader, setShowLoader] = useState(false)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Check if loader was already shown
        const loaderShown = sessionStorage.getItem('loaderShown')

        if (!loaderShown) {
            // Show loader on first visit
            setShowLoader(true)

            // Show loader for 4 seconds
            const timer = setTimeout(() => {
                sessionStorage.setItem('loaderShown', 'true')
                setShowLoader(false)
                setLoading(false)
            }, 4000)

            return () => clearTimeout(timer)
        } else {
            // Don't show loader if already shown
            setLoading(false)
        }
    }, [])

    // Show loader
    if (showLoader) {
        return <Loader />
    }

    // Show content after loader or if already shown
    return <>{children}</>
}
