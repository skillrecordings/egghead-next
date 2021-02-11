import axios from 'utils/configured-axios'

export type Comment = {
  title?: string
  comment: string
  role?: string
}

export async function saveCommentForLesson(slug: string, comment: Comment) {
  return await axios
    .post(
      `${process.env.NEXT_PUBLIC_AUTH_DOMAIN}/api/v1/lessons/${slug}/comments`,
      {comment},
    )
    .then(({data}) => data)
}
