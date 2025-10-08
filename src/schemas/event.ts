import {z} from 'zod'

// Schema definitions for event state and visibility
export const EventStateSchema = z.enum([
  'draft',
  'published',
  'archived',
  'deleted',
])

export const EventVisibilitySchema = z.enum(['public', 'unlisted', 'private'])

// Workshop-specific schemas
export const WorkshopCouponsSchema = z.object({
  earlyBirdMember: z.string().optional(),
  member: z.string().optional(),
  earlyBird: z.string().optional(),
})

export const WorkshopDiscountsSchema = z.object({
  earlyBirdMember: z.string().optional(),
  member: z.string().optional(),
  earlyBird: z.string().optional(),
})

export const TestimonialSchema = z.object({
  quote: z.string(),
  name: z.string(),
  image: z.string().optional(),
  role: z.string().optional(),
  link: z.string().optional(),
})

export const ScheduleItemSchema = z.object({
  time: z.string(),
  title: z.string(),
  description: z.string().optional(),
})

export const SeoSchema = z.object({
  title: z.string(),
  description: z.string(),
  ogImage: z.string(),
  ogImageWidth: z.number().optional(),
  ogImageHeight: z.number().optional(),
})

export const SocialImageSchema = z.object({
  type: z.string(),
  url: z.string(),
})

// Enhanced Event Fields Schema for full page content
export const EventFieldsSchema = z.object({
  // === CORE EVENT INFO ===
  title: z.string(),
  description: z.string().optional(),
  details: z.string().optional(),
  slug: z.string(),

  // === STATE MANAGEMENT ===
  state: EventStateSchema.default('draft'),
  visibility: EventVisibilitySchema.default('public'),

  // === TIMING ===
  startsAt: z.string(), // ISO datetime: "2025-02-20T17:00:00.000Z"
  endsAt: z.string().optional(),
  timezone: z.string(), // "America/Los_Angeles"

  // === CONTENT ===
  body: z.string().optional(), // Markdown/MDX content for page body
  attendeeInstructions: z.string().optional(),

  // === MEDIA ===
  image: z.string().optional(),
  socialImage: SocialImageSchema.optional(),
  thumbnailTime: z.number().optional(),

  // === CONFIGURATION ===
  calendarId: z.string().optional(),
  featured: z.boolean().optional(), // Feature on homepage / primary workshop

  // === HERO SECTION ===
  heroHeadline: z.string().optional(),
  heroSubheadline: z.string().optional(),
  heroImage: z.string().optional(),
  heroBackgroundImage: z.string().optional(),
  heroCta: z.string().optional(),

  // === FEATURES/BENEFITS ===
  features: z.array(z.string()).optional(),
  teamFeatures: z.array(z.string()).optional(),
  benefits: z.array(z.string()).optional(),

  // === TESTIMONIALS ===
  testimonials: z.array(TestimonialSchema).optional(),

  // === INSTRUCTOR ===
  instructorName: z.string().optional(),
  instructorBio: z.string().optional(),
  instructorImage: z.string().optional(),
  instructorRole: z.string().optional(),

  // === SCHEDULE (Optional) ===
  schedule: z.array(ScheduleItemSchema).optional(),

  // === PAGE LAYOUT OPTIONS ===
  showInstructorSection: z.boolean().default(true),
  showHistorySection: z.boolean().default(false),
  showTestimonialBar: z.boolean().default(false),
  customComponents: z.array(z.string()).optional(),

  // === SEO ===
  seo: SeoSchema.optional(),

  // === WORKSHOP-SPECIFIC FIELDS ===
  isActive: z.boolean().optional(),
  isSaleLive: z.boolean().optional(),
  isEarlyBird: z.boolean().optional(),
  workshopPrice: z.string().optional(),
  stripeProductId: z.string().optional(),
  stripePaymentLink: z.string().optional(),
  coupons: WorkshopCouponsSchema.optional(),
  discounts: WorkshopDiscountsSchema.optional(),
})

// Main Event Schema
export const EventSchema = z.object({
  id: z.string(),
  type: z.literal('event'),
  fields: EventFieldsSchema,
  createdById: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  deletedAt: z.date().nullable().optional(),
  currentVersionId: z.string().nullable().optional(),
  organizationId: z.string().nullable().optional(),
})

// Export types
export type EventState = z.infer<typeof EventStateSchema>
export type EventVisibility = z.infer<typeof EventVisibilitySchema>
export type EventFields = z.infer<typeof EventFieldsSchema>
export type Event = z.infer<typeof EventSchema>
export type Testimonial = z.infer<typeof TestimonialSchema>
export type ScheduleItem = z.infer<typeof ScheduleItemSchema>
export type WorkshopCoupons = z.infer<typeof WorkshopCouponsSchema>
export type WorkshopDiscounts = z.infer<typeof WorkshopDiscountsSchema>
