import groq from 'groq'
import z from 'zod'
import {pickBy} from 'lodash'
import {sanityClient} from '../utils/sanity-client'

export const TipSchema = z.object({
  _id: z.string(),
  _type: z.string(),
  _updatedAt: z.string().optional(),
  _createdAt: z.string().optional(),
  title: z.string(),
  slug: z.string(),
  description: z.nullable(z.string()).optional(),
  body: z.string().optional().nullable(),
  summary: z.string().optional().nullable(),
  muxPlaybackId: z.nullable(z.string()).optional(),
  state: z.enum(['new', 'processing', 'reviewing', 'published', 'retired']),
  videoResourceId: z.nullable(z.string()).optional(),
  transcript: z.nullable(z.string()).optional(),
  tweetId: z.nullable(z.string()).optional(),
})

export const TipsSchema = z.array(TipSchema)

export type Tip = z.infer<typeof TipSchema>

export const getAllTips = async (onlyPublished = true): Promise<Tip[]> => {
  const tips = await sanityClient.fetch(groq`*[_type == "tip" ${
    onlyPublished ? `&& state == "published"` : ''
  }] | order(_createdAt asc) {
        _id,
        _type,
        _updatedAt,
        _createdAt,
        title,
        state,
        description,
        summary,
        body,
        "videoResourceId": resources[@->._type == 'videoResource'][0]->_id,
        "muxPlaybackId": resources[@->._type == 'videoResource'][0]-> muxAsset.muxPlaybackId,
        "slug": slug.current,
        "transcript": resources[@->._type == 'videoResource'][0]-> castingwords.transcript,
        "tweetId":  resources[@._type == 'tweet'][0].tweetId
  }`)

  return TipsSchema.parse(tips)
}

export const getTip = async (slug: string): Promise<Tip> => {
  const tip = await sanityClient.fetch(
    groq`*[_type == "tip" && slug.current == $slug][0] {
        _id,
        _type,
        _updatedAt,
        _createdAt,
        title,
        state,
        description,
        summary,
        body,
        "videoResourceId": resources[@->._type == 'videoResource'][0]->_id,
        "muxPlaybackId": resources[@->._type == 'videoResource'][0]-> muxAsset.muxPlaybackId,
        "slug": slug.current,
        "legacyTranscript": resources[@->._type == 'videoResource'][0]-> castingwords.transcript,
        "transcript": resources[@->._type == 'videoResource'][0]-> transcript.text,
        "tweetId":  resources[@._type == 'tweet'][0].tweetId
    }`,
    {slug},
  )

  if (tip.legacyTranscript && !tip.transcript) {
    tip.transcript = tip.legacyTranscript
  }

  return TipSchema.parse(pickBy(tip))
}
