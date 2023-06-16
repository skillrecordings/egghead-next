import {sanityClient} from 'utils/sanity-client'
import groq from 'groq'
import {loadPlaylist} from './playlists'
import {z} from 'zod'

const courseQuery = groq`
*[
  (_type == 'resource' || _type == 'course') && (externalId == '$courseId' || slug.current == $slug)
][0]{
  "id": _id,
  title,
  "slug": slug.current,
  productionProcessState,
  description,
  challengeRating,
  "square_cover_480_url": image,
  "thumb_url": thumbnailUrl,
  lessons[]->{
    title,
    "type": _type,
    "http_url": awsFilename,
    "icon_url": softwareLibraries[0].library->image.url,
    "duration": resource->duration,
    "path": "/lessons/" + slug.current
  },
  "instructor": collaborators[0]->{
    "avatar_url": person->image.url,
    "full_name": person->name,
    "slug": person->slug.current,
    "id": _id
  },
  "tags": softwareLibraries[] {
    ...(library->{
      name,
      'label': slug.current,
      'http_url': url,
      'image_url': image.url
    })
  },
  "customOgImage": images[label == 'og-image'][0]{
    url
  },
  "illustration": images[label == 'illustration'][0]{
    url
  },
  'illustrator': collaborators[]->[role == 'illustrator'][0]{
    'name': person->name,
    'image': person->image.url
  },
  'instructor': collaborators[]->[role == 'instructor'][0]{
    'full_name': person->name,
    'avatar_url': person->image.url,
    'slug': person->slug.current
  },
  'dependencies': softwareLibraries[]{
    version,
    ...library->{
      description,
      "slug": slug.current,
      path,
      name,
      'label': name,
      'image_url': image.url
    }
  },
  "topics": content[title == 'topics'][0]{
    items[],
    description
  },
  "features": content[title == 'features'][0]{
    items[],
    description
  },
  "prerequisites": prerequisites[]->{
    "id": eggheadId,
    title,
    path,
    type
  },
  projects[]{
    label,
    url
  }
}
`

/**
 * loads COURSE METADATA from Sanity
 * @param id
 */
export async function loadCourseMetadata(id: number, slug: string) {
  const params = {
    courseId: Number(id),
    slug: slug,
  }

  const course = await sanityClient.fetch(courseQuery, params)

  console.log('course data after merged query', course)

  if (!course?.square_cover_480_url) {
    const imageUrl = course?.dependencies
      ? `https://res.cloudinary.com/dg3gyk0gu/image/upload/v1683914713/tags/${course?.dependencies[0]?.name}.png`
      : 'https://res.cloudinary.com/dg3gyk0gu/image/upload/v1569292667/eggo/eggo_flair.png'
    course['square_cover_480_url'] = imageUrl
  }

  return course
}

export async function loadCourse(slug: string, token?: string) {
  return loadPlaylist(slug, token)
}

export async function loadDraftSanityCourse(slug: string, token?: string) {
  const query = groq`*[_type == 'course' && slug.current == $slug][0]{
    "id": _id,
    title,
    "slug": slug.current,
    productionProcessState,
    description,
    lessons[]-> {
      title,
      "type": _type,
      "thumb_url": thumbnailUrl,
      "http_url": awsFilename,
      "icon_url": softwareLibraries[0].library->image.url,
      "duration": resource->duration,
      "path": "/lessons/" + slug.current
    },
    "instructor": collaborators[0]-> {
      "avatar_url": person->image.url,
      "full_name": person->name,
      "slug": person->slug.current,
      "id": _id
    },
    "tags": softwareLibraries[] {
      ...(library-> {
       name,
      'label': slug.current,
      'http_url': url,
      'image_url': image.url
    }),
  }
 }`

  const course = await sanityClient.fetch(query, {slug})

  let courseWithDefaults = {
    square_cover_480_url:
      'https://res.cloudinary.com/dg3gyk0gu/image/upload/v1678295001/eggo/eggo_building_square.png',
    ...course,
  }

  return courseWithDefaults
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
      "id": _id
    },
 }`

  const {instructor} = await sanityClient.fetch(query, {id})

  return SanityInstructorSchema.parse(instructor)
}

export async function loadDraftSanityCourseById(id: string, token?: string) {
  const query = groq`*[_type == 'course' && _id == $id][0]{
    "id": _id,
    title,
    "slug": slug.current,
    productionProcessState,
    description,
    lessons[]-> {
      title,
      "type": _type,
      "thumb_url": thumbnailUrl,
      "http_url": awsFilename,
      "icon_url": softwareLibraries[0].library->image.url,
      "duration": resource->duration,
      "path": "/lessons/" + slug.current,
      "slug": slug.current,
    },
    "instructor": collaborators[0]-> {
      "avatar_url": person->image.url,
      "full_name": person->name,
      "slug": person->slug.current,
      "id": _id
    },
    "tags": softwareLibraries[] {
      ...(library-> {
       name,
      'label': slug.current,
      'http_url': url,
      'image_url': image.url
    }),
  }
 }`

  const course = await sanityClient.fetch(query, {id})

  const courseWithDefaults = {
    square_cover_480_url:
      'https://res.cloudinary.com/dg3gyk0gu/image/upload/v1678295001/eggo/eggo_building_square.png',
    ...course,
  }

  return SanityDraftCourse.parse(courseWithDefaults)
}

const SanityLesson = z.object({
  key: z.string(),
  id: z.string(),
  title: z.string(),
  description: z.string(),
  type: z.string(),
  icon_url: z.string(),
  duration: z.number(),
  path: z.string(),
  videoResourceId: z.string(),
})
export type SanityLesson = z.infer<typeof SanityLesson>

const SanityInstructorSchema = z.object({
  avatar_url: z.string(),
  full_name: z.string(),
  slug: z.string(),
  id: z.string(),
})

const SanityDraftCourse = z.object({
  id: z.string(),
  title: z.string(),
  slug: z.string(),
  square_cover_480_url: z.string(),
  productionProcessState: z.string(),
  description: z.string(),
  lessons: z.array(SanityLesson),
  instructor: SanityInstructorSchema,
  tags: z.array(
    z.object({
      name: z.string(),
      label: z.string(),
      http_url: z.string(),
      image_url: z.string(),
    }),
  ),
})
export type SanityDraftCourse = z.infer<typeof SanityDraftCourse>
