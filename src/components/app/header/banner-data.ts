import type {LiveWorkshop} from '@/types'

export type HeaderBannerData = {
  lifetimeSaleEnabled: boolean
  cursorWorkshopSaleEnabled: boolean
  claudeCodeWorkshopSaleEnabled: boolean
  cursorWorkshopEarlyBirdEnabled: boolean
  cursorWorkshop: LiveWorkshop | null
  claudeCodeWorkshop: LiveWorkshop | null
}
