export const fadeInUp = {
  initial: {opacity: 0, y: 20},
  animate: {opacity: 1, y: 0},
  transition: {duration: 0.5},
}

export const staggerContainer = {
  hidden: {opacity: 0},
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

export const staggerItem = {
  hidden: {opacity: 0, y: 20},
  show: {opacity: 1, y: 0},
}

export const scaleIn = {
  initial: {opacity: 0, scale: 0.95},
  animate: {opacity: 1, scale: 1},
  transition: {duration: 0.5},
}
