'use client'

import { useEffect, useState } from 'react'
import Loader from '@/components/layout/preloader/Loader'

export function PreloaderWrapper({ children }) {
    const [showLoader, setShowLoader] = useState(false)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const loaderShown = sessionStorage.getItem('loaderShown')

        if (!loaderShown) {
            queueMicrotask(() => setShowLoader(true))

            const timer = setTimeout(() => {
                sessionStorage.setItem('loaderShown', 'true')
                setShowLoader(false)
                setLoading(false)
            }, 4000)

            return () => clearTimeout(timer)
        } else {
            queueMicrotask(() => setLoading(false))
        }
    }, [])

    if (showLoader) {
        return <Loader />
    }

    return <>{children}</>
}
