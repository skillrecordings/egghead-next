import z from 'zod'
import {ResourceSchema} from './resource'

export const CollectionSchema = z
  .object({
    resources: z.array(ResourceSchema).nullish(),
  })
  .merge(ResourceSchema)

export type Collection = z.infer<typeof CollectionSchema>
