export const fadeInUp = {
  initial: {opacity: 1, y: 20},
  animate: {opacity: 1, y: 0},
  viewport: {once: true},
  transition: {duration: 0.5},
}

export const staggerContainer = {
  hidden: {opacity: 1},
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

export const staggerItem = {
  hidden: {opacity: 1, y: 20},
  show: {opacity: 1, y: 0},
}

export const scaleIn = {
  initial: {opacity: 1, scale: 0.95},
  animate: {opacity: 1, scale: 1},
  viewport: {once: true},
  transition: {duration: 0.5},
}
