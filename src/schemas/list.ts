import {z} from 'zod'

export const ListTypeSchema = z.union([
  z.literal('tutorial'),
  z.literal('nextUp'),
  z.literal('guide'),
])

export type ListType = z.infer<typeof ListTypeSchema>
