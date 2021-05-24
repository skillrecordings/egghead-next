export type Resource = {
  title: string
  slug: string
  description: string
  icon_url?: string
  completed?: boolean
  path: string
  type?: string
}

export type CardResource = Resource & {
  id?: string
  image: string | {src: string; alt: string}
  name: string
  byline: string
  resources?: CardResource[]
  instructor?: any
  background?: string
}

export type LessonResource = Resource & {
  dash_url: string
  hls_url: string
  media_url: string
  lesson_view_url: string
  id: string | number
  tags: any[]
  lessons: any[]
  completed: boolean
  duration: number
  instructor: any
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
  name: string
  is_pro: boolean
  is_instructor: boolean
  created_at: number
  discord_id: string
  timezone: string
  opted_out: boolean
  purchases: any[]
  accounts: StripeAccount[]
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
