import {z} from 'zod'

export const WORKSHOP_QUOTE_REQUEST_EVENT = 'workshop/workshop-quote-request'

export type WorkshopQuoteRequest = {
  name: typeof WORKSHOP_QUOTE_REQUEST_EVENT
  data: WorkshopQuoteRequestEvent
}

export const WorkshopQuoteRequestEventSchema = z.object({
  email: z.string().email({
    message: 'Invalid email address format',
  }),
  productTitle: z.string(),
  seats: z.number(),
  additionalInfo: z.string().optional(),
})

export type WorkshopQuoteRequestEvent = z.infer<
  typeof WorkshopQuoteRequestEventSchema
>
