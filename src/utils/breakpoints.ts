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
export const bpMinLG = `@media (min-width: ${bp.lg}px)`
export const bpMinXL = `@media (min-width: ${bp.xl}px)`

export const bpMaxXS = `@media (max-width: ${bp.sm - 1}px)`
export const bpMaxSM = `@media (max-width: ${bp.md - 1}px)`
export const bpMaxMD = `@media (max-width: ${bp.lg - 1}px)`
export const bpMaxLG = `@media (max-width: ${bp.xl - 1}px)`

const useBreakpoints = createBreakpoint(bp)

const useBreakpoint = () => {
  const breakpoint = useBreakpoints()

  const xs = breakpoint == 'xs'
  const sm = breakpoint == 'sm' || xs
  const md = breakpoint == 'md' || sm
  const lg = breakpoint == 'lg' || md
  const xl = breakpoint == 'xl' || lg
  const xl2 = breakpoint == '2xl' || xl
  const xl3 = breakpoint == '3xl' || xl2

  return {xs, sm, md, lg, xl, xl2, xl3}
}

export default useBreakpoint
