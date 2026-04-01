import * as React from 'react'
import useSwr from 'swr'
import {getGraphQLClient} from '@/utils/configured-graphql-client'
import {HorizontalResourceCard} from '../card/horizontal-resource-card'

const loadArticleCourseCard = async (slug: string) => {
  const query = /* GraphQL */ `
    query getArticleCourseCard($slug: String!) {
      playlist(slug: $slug) {
        slug
        title
        path
        square_cover_480_url
        instructor {
          full_name
        }
      }
    }
  `

  const graphQLClient = getGraphQLClient(undefined, {
    allowStoredTokenFallback: false,
  })
  const {playlist} = await graphQLClient.request(query, {slug})

  return playlist
}

const ArticleCourseCard: React.FC<
  React.PropsWithChildren<{course: string}>
> = ({course}) => {
  const {data, error} = useSwr(course, loadArticleCourseCard)

  React.useEffect(() => {
    if (error) {
      console.warn(`Failed to load article course card for ${course}`, error)
    }
  }, [course, error])

  return data ? (
    <div className="my-32">
      <HorizontalResourceCard
        resource={{
          name: 'check out this course',
          byline: data.instructor?.full_name ?? '',
          slug: data.slug,
          title: data.title,
          path: data.path,
          image: data.square_cover_480_url,
        }}
      />
    </div>
  ) : null
}

export default ArticleCourseCard
