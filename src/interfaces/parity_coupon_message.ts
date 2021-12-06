import {Coupon} from 'types'

export interface ParityCouponMessageProps {
  coupon: Coupon
  countryName: string
  onApply: () => void
  onDismiss: () => void
  isPPP?: boolean
  isLoading?: boolean
}
