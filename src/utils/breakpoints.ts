import {createBreakpoint} from 'react-use'

const bp: any = {
  xs: 375,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1440,
  '3xl': 1920,
}

export const bpMinSM = `@media (min-width: ${bp.sm}px)`
export const bpMinMD = `@media (min-width: ${bp.md}px)`
export const bpMinLG = `@media (min-width: ${bp.lg}px`
export const bpMinXL = `@media (min-width: ${bp.xl}px)`

export const bpMaxXS = `@media (max-width: ${bp.sm - 1}px)`
export const bpMaxSM = `@media (max-width: ${bp.md - 1}px)`
export const bpMaxMD = `@media (max-width: ${bp.lg - 1}px)`
export const bpMaxLG = `@media (max-width: ${bp.xl - 1}px)`

const getBreakpoint = createBreakpoint(bp)

const breakpoints = () => {
  const breakpoint = getBreakpoint()

  const isMin3XL = breakpoint === '3xl'
  const isMin2XL = breakpoint === '2xl' || isMin3XL
  const isMinXL = breakpoint === 'xl' || isMin2XL
  const isMinLG = breakpoint === 'lg' || isMinXL
  const isMinMD = breakpoint === 'md' || isMinLG
  const isMinSM = breakpoint === 'sm' || isMinMD
  return {isMinSM, isMinMD, isMinLG, isMinXL, isMin2XL, isMin3XL}
}

export default breakpoints
