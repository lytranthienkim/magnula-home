export const trackingHeaderContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.05,
        },
    },
};

export const trackingHeaderTitleVariants = {
    hidden: { opacity: 0, y: -5 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.4, ease: 'easeInOut' },
    },
};

export const trackingHeaderDescriptionVariants = {
    hidden: { opacity: 0, y: 5 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.8, ease: 'easeInOut' },
    },
};

export const trackingFormContainerVariants = {
    hidden: { opacity: 0},
    visible: {
        opacity: 1,
        scale: 1,
        transition: { duration: 0.8, ease: 'easeInOut' },
    },
};

export const trackingDetailsContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            duration: 0.8,
            ease: 'easeInOut'
        },
    },
};
