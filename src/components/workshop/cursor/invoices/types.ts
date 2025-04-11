import {z} from 'zod'

export const priceSchema = z.object({
  id: z.string().max(191),
  productId: z.string().max(191).optional().nullable(),
  organizationId: z.string().max(191).optional().nullable(),
  nickname: z.string().max(191).optional().nullable(),
  status: z.number().int().default(0),
  unitAmount: z.number().refine((value) => {
    const decimalPlaces = value.toString().split('.')[1]?.length || 0
    return decimalPlaces <= 2
  }),
  createdAt: z.date().nullable(),
  fields: z.record(z.any()).default({}),
})

export type Price = z.infer<typeof priceSchema>
export const couponSchema = z.object({
  id: z.string(),
  code: z.string().max(191).optional().nullable(),
  createdAt: z.date().nullable(),
  expires: z.date().nullable(),
  fields: z.record(z.any()).default({}),
  maxUses: z.number().int().default(-1),
  default: z.boolean().default(false),
  merchantCouponId: z.string().max(191).optional().nullable(),
  status: z.number().int().default(0),
  usedCount: z.number().int().default(0),
  percentageDiscount: z.number().refine((value) => {
    const decimalPlaces = value.toString().split('.')[1]?.length || 0
    return decimalPlaces <= 2
  }),
  restrictedToProductId: z.string().max(191).optional().nullable(),
  bulkPurchases: z.array(z.any()).default([]),
  redeemedBulkCouponPurchases: z.array(z.any()).default([]),
  bulkPurchaseId: z.string().max(191).optional().nullable(), // TODO: remove
  organizationId: z.string().max(191).optional().nullable(),
})
export type Coupon = z.infer<typeof couponSchema>

export const productSchema = z.object({
  id: z.string().max(191),
  organizationId: z.string().max(191).optional().nullable(),
  name: z.string().max(191),
  key: z.string().max(191).optional().nullable(),
  type: z
    .enum(['live', 'self-paced', 'membership', 'cohort'])
    .default('self-paced'),
  fields: z.object({
    body: z.string().nullable().optional(),
    description: z.string().nullish(),
    slug: z.string(),
    image: z
      .object({
        url: z.string(),
        alt: z.string().optional().nullable(),
        width: z.number().optional().nullable(),
        height: z.number().optional().nullable(),
      })
      .optional()
      .nullable(),
    action: z.string().optional().nullable().default('Buy Now'),
    state: z
      .enum(['draft', 'published', 'archived', 'deleted'])
      .default('draft'),
    visibility: z.enum(['public', 'private', 'unlisted']).default('unlisted'),
  }),
  createdAt: z.date().nullable(),
  status: z.number().int().default(0),
  quantityAvailable: z.number().int().default(-1),
  price: priceSchema.nullable().optional(),
  resources: z.array(z.any()).default([]).nullable(),
})

export type Product = z.infer<typeof productSchema>

export const NewProductSchema = z.object({
  name: z.string().min(2).max(90),
  quantityAvailable: z.number().default(-1),
  price: z.number().gte(0).default(0),
})

export type NewProduct = z.infer<typeof NewProductSchema>

export const purchaseSchema = z.object({
  id: z.string().max(191),
  userId: z.string().max(191).optional().nullable(),
  createdAt: z.date(),
  totalAmount: z.number().refine((value) => {
    const decimalPlaces = value.toString().split('.')[1]?.length || 0
    return decimalPlaces <= 2
  }),
  ipAddress: z.string().max(191).optional().nullable(),
  city: z.string().max(191).optional().nullable(),
  state: z.string().max(191).optional().nullable(),
  country: z.string().max(191).optional().nullable(),
  couponId: z.string().max(191).optional().nullable(),
  productId: z.string().max(191),
  merchantChargeId: z.string().max(191).optional().nullable(),
  upgradedFromId: z.string().max(191).optional().nullable(),
  status: z.string().max(191).default('Valid'),
  bulkCouponId: z.string().max(191).optional().nullable(),
  merchantSessionId: z.string().max(191).optional().nullable(),
  redeemedBulkCouponId: z.string().max(191).optional().nullable(),
  fields: z.record(z.any()).default({}),
  user: z.any(),
  bulkCoupon: couponSchema.optional().nullable(),
  product: productSchema.optional().nullable(),
  purchasedByorganizationMembershipId: z
    .string()
    .max(191)
    .optional()
    .nullable(),
  organizationId: z.string().max(191).optional().nullable(),
})
export type Purchase = z.infer<typeof purchaseSchema>
