const minSM = 640
const minMD = 768
const minLG = 1024
const minXL = 1280

export const bpMinSM = `@media (min-width: ${minSM}px)`
export const bpMinMD = `@media (min-width: ${minMD}px)`
export const bpMinLG = `@media (min-width: ${minLG}px)`
export const bpMinXL = `@media (min-width: ${minXL}px)`

export const bpMaxXS = `@media (max-width: ${minSM - 1}px)`
export const bpMaxSM = `@media (max-width: ${minMD - 1}px)`
export const bpMaxMD = `@media (max-width: ${minLG - 1}px)`
export const bpMaxLG = `@media (max-width: ${minXL - 1}px)`
