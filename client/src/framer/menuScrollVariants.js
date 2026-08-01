export const getMenuItemMotion = (index, scrollProgress) => {
  const itemStart = 0.3 + index * 0.1;
  const itemEnd = Math.min(1, itemStart + 0.4);

  const itemProgress = scrollProgress < itemStart
    ? 0
    : scrollProgress > itemEnd
      ? 1
      : (scrollProgress - itemStart) / (itemEnd - itemStart);

  const movement = (1 - itemProgress) * 20;

  return {
    opacity: itemProgress,
    y: movement, 
    x: movement,
  };
};

export const menuContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.2,
    },
  },
};

export const menuItemVariants = {
  hidden: {
    opacity: 0,
    x: -20,
  },
  visible: (custom) => ({
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.8,
      ease: [0.25, 1, 0.5, 1],
      delay: custom * 0.05,
    },
  }),
};
