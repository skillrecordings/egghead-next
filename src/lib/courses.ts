import {sanityClient} from '@/utils/sanity-client'
import groq from 'groq'
import {loadPlaylist} from './playlists'
import {z} from 'zod'

export async function loadCourse(slug: string, token?: string) {
  return loadPlaylist(slug, token)
}

export async function loadSanityInstructorbyCourseId(
  id: string,
  token?: string,
) {
  const query = groq`*[_type == 'course' && _id == $id][0]{
    "instructor": collaborators[0]-> {
      "avatar_url": person->image.url,
      "full_name": person->name,
      "slug": person->slug.current,
      "website": person->website,
      "twitter": person->twitter,
      "id": _id
    },
 }`

  const {instructor} = await sanityClient.fetch(query, {id})

  return SanityInstructorSchema.parse(instructor)
}

const SanityInstructorSchema = z.object({
  avatar_url: z.string(),
  full_name: z.string(),
  slug: z.string(),
  id: z.string(),
  website: z.string(),
  twitter: z.string(),
})
