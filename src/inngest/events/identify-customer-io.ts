import {z} from 'zod'

export const CUSTOMER_IO_IDENTIFY_EVENT = 'customer.io/identify'

export const customerIoIdentifySchema = z.object({
  email: z.string().optional(),
  id: z.string().optional(),
  selectedInterests: z.record(z.number().optional()),
  userToken: z.string().optional(),
})

export type CustomerIoIdentify = {
  name: typeof CUSTOMER_IO_IDENTIFY_EVENT
  data: z.infer<typeof customerIoIdentifySchema>
}
