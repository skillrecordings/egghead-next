import {z} from 'zod'

export const LiveWorkshopSchema = z
  .object({
    date: z.string(),
    startTime: z.string(),
    timeZone: z.string(),
    utcOffset: z.string(),
    endTime: z.string(),
    isSaleLive: z.boolean(),
    isEuFriendly: z.boolean(),
    isEarlyBird: z.boolean(),
    productId: z.string(),
    stripePaymentLink: z.string(),
    stripeEarlyBirdMemberCouponCode: z.string(),
    stripeMemberCouponCode: z.string(),
    stripeEarlyBirdCouponCode: z.string(),
    stripeEarlyBirdMemberDiscount: z.string(),
    stripeMemberDiscount: z.string(),
    stripeEarlyBirdNonMemberDiscount: z.string(),
  })
  .optional()
export type LiveWorkshop = z.infer<typeof LiveWorkshopSchema>

export type Resource = {
  title: string
  slug: string
  description: string
  icon_url?: string
  completed?: boolean
  path: string
  type?: string
}

export type SectionResource = LessonResource & {
  id?: string
  title: string
  slug?: string
  description?: string
  type?: string
}

export type CardResource = Resource & {
  type?: string
  id?: string
  title: string
  slug: string
  description: string
  icon_url?: string
  completed?: boolean
  path: string
  externalId?: number
  image: string | {src: string; alt: string}
  name: string
  tag?: any
  subTitle?: string
  byline?: string
  resources?: CardResource[]
  related?: CardResource[]
  instructor?: any
  background?: string
  url?: string
}

export type LessonResource = Resource & {
  media_url: string
  thumb_url: string
  lesson_view_url: string
  id: string | number
  published_at: string
  tags: any[]
  lessons: any[]
  primary_tag: any
  completed: boolean
  duration: number
  instructor: any
  hls_url?: string
  dash_url?: string
  collection: Resource & {lessons: any[]}
  staff_notes_url?: string
  free_forever?: boolean
  download_url?: string
  scrimba: {
    url: string
    transcript: string
  }
}

export type VideoResource = LessonResource & {
  dash_url: string
  hls_url: string
  thumb_url: string
  subtitles_url: string
  collection: any
}

export type PodcastResource = Resource & {
  duration: number
  episode_number: number
  published_at: string
  summary: string
  transcript: string
  simplecast_uid: string
  id: number
  image_url: string
  contributors: Array<string>
  url: string
  path: string
}

export type StripeAccount = {
  stripe_customer_id: string
  subscriptions: StripeSubscription[]
}

export type StripeSubscription = {
  stripe_subscription_id: string
}

export type Viewer = {
  id: number
  email: string
  contact_id: string
  avatar_url: string
  watch_later_bookmarks_url: string
  name: string
  is_pro: boolean
  is_instructor: boolean
  can_comment: boolean
  created_at: number
  discord_id: string
  timezone: string
  opted_out: boolean
  purchases: any[]
  accounts: StripeAccount[]
  memberships?: any
}

export type Question = {
  question: string
  type: 'multiple-choice' | 'essay'
  tagId: number
  correct?: string[] | string
  answer?: string
  choices?: {answer: string; label: string}[]
}

export type Questions = {
  [key: string]: Question
}

export type Topic = {
  title: string
  path: string
  slug: string
  image: string
}

// Commerce Types

export type PricingPlan = {
  interval: string
  interval_count: number
  name: string
  price: number
  stripe_price_id: string
  price_discounted?: string
  price_savings?: string
}

export type Prices = {
  monthlyPrice?: PricingPlan
  quarterlyPrice?: PricingPlan
  annualPrice?: PricingPlan
}

export type Coupon = {
  coupon_code: string
  coupon_discount: number
  coupon_region_restricted: boolean
  coupon_region_restricted_to: string
  coupon_region_restricted_to_name: string
  coupon_expires_at: number
  default?: boolean
}

export type PricingData = {
  applied_coupon: Coupon
  available_coupons: {
    ppp?: Coupon
    default?: Coupon
  }
  coupon_code_errors: string[]
  mode: 'individual' | 'team'
  plans: PricingPlan[]
  quantity: number
}

export type ParityCouponMessageProps = {
  coupon: Coupon
  countryName: string
  onApply: () => void
  onDismiss: () => void
  isPPP?: boolean
  isLoading?: boolean
}
