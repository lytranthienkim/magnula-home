export const productContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.08,
            delayChildren: 0.1, 
        },
    },
};

export const productCardVariants = {
    hidden: {
        opacity: 0,
        y: 40, 
    },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            type: 'spring',
            stiffness: 60,
            damping: 15,
            duration: 0.6,
        },
    },
};
