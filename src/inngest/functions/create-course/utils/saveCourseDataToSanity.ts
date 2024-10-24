import {createClient} from '@sanity/client'

export const saveCourseDataToSanity = async (
  sanityCourse: any,
  railsCourse: any,
) => {
  let sanityClient = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? '',
    dataset: 'production',
    useCdn: false,
    apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION,
    token: process.env.SANITY_EDITOR_TOKEN,
  })

  return await sanityClient
    .patch(sanityCourse._id)
    .set({
      railsCourseId: railsCourse.id,
    })
    .commit()
}
