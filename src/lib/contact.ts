import * as z from 'zod'

export const KvstoreSchema = z.object({})
export type Kvstore = z.infer<typeof KvstoreSchema>

export const ContactSchema = z.object({
  id: z.number().optional(),
  guid: z.string().optional(),
  email: z.string().optional(),
  user_id: z.number().optional(),
  confirmed_at: z.coerce.date().optional(),
  kvstore: KvstoreSchema.optional(),
  created_at: z.coerce.date().optional(),
  updated_at: z.coerce.date().optional(),
  ip_address: z.null().optional(),
  city: z.null().optional(),
  state: z.null().optional(),
  country: z.null().optional(),
  convertkit_id: z.null().optional(),
})
export type Contact = z.infer<typeof ContactSchema>
