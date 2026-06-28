// Elegant staggered animation for product cards
// Cards appear in a wave motion from bottom to top

export const productContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.08, // Delay between each card
            delayChildren: 0.1,    // Initial delay before first card
        },
    },
};

export const productCardVariants = {
    hidden: {
        opacity: 0,
        y: 40, // Start from below
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
