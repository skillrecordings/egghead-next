import Typesense from 'typesense'

let client = new Typesense.Client({
  nodes: [
    {
      host: process.env.NEXT_PUBLIC_TYPESENSE_HOST!,
      port: 443,
      protocol: 'https',
    },
  ],
  apiKey: process.env.TYPESENSE_WRITE_API_KEY!,
  connectionTimeoutSeconds: 2,
})

export async function upsertCourseToTypesense(course: any) {
  await client
    .collections(process.env.TYPESENSE_COLLECTION_NAME!)
    .documents()
    .upsert({
      primary_tag: course.primary_tag,
      slug: course.slug,
      state: course.state,
      visibility_state: course.visibility_state,
      summary: course.summary,
      free_forever: course.free_forever,
      type: course.type,
      created_at: course.created_at,
      published: course.published,
      rating_out_of_5: course.rating_out_of_5,
      image: course.square_cover_url,
      topic_list: course.topic_list,
      updated_at: course.updated_at,
      instructor: course.instructor,
      instructor_name: course.instructor.full_name,
      tags: course.tags,
      title: course.title,
      name: course.title,
      description: course.description,
      path: course.path,
      id: String(course.id),
      objectID: String(course.id),
      published_at_timestamp: new Date(course.updated_at).getTime(),
    })
}
