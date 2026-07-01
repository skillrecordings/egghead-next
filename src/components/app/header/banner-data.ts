import type {LiveWorkshop} from '@/types'

export type HeaderBannerData = {
  lifetimeSaleEnabled: boolean
  cursorWorkshopSaleEnabled: boolean
  claudeCodeWorkshopSaleEnabled: boolean
  codexWorkshopSaleEnabled: boolean
  softwareFactoryWorkshopSaleEnabled: boolean
  cursorWorkshopEarlyBirdEnabled: boolean
  cursorWorkshop: LiveWorkshop | null
  claudeCodeWorkshop: LiveWorkshop | null
  codexWorkshop: LiveWorkshop | null
  softwareFactoryWorkshop: LiveWorkshop | null
}
