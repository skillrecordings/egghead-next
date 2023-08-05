import React, {FunctionComponent} from 'react'
import {loadHolidayCourses, saleOn} from 'lib/sale'
import {sanityClient} from 'utils/sanity-client'
import Home from 'components/pages/home'
import {NextSeo} from 'next-seo'
import find from 'lodash/find'
import get from 'lodash/get'
import groq from 'groq'
import {z} from 'zod'
import {result} from 'lodash'

const LearnPage: FunctionComponent<React.PropsWithChildren<any>> = ({
  data,
  holidayCourses,
}) => {
  const location = 'curated home landing'
  const jumbotron = find(data.sections, {slug: 'jumbotron'})
  const ogImage = get(
    jumbotron,
    'resources[0].ogImage',
    'https://res.cloudinary.com/dg3gyk0gu/image/upload/v1637345011/egghead-next-pages/home-page/root-og_2x.png',
  )

  return (
    <>
      <NextSeo
        canonical={process.env.NEXT_PUBLIC_DEPLOYMENT_URL}
        openGraph={{
          images: [
            {
              url: ogImage,
              alt: 'Concise Programming Courses for Busy Web Developers',
            },
          ],
        }}
      />
      <div className="dark:bg-gray-900 bg-gray-100">
        <Home
          data={data}
          holidayCourses={holidayCourses}
          jumbotron={jumbotron}
          location={location}
        />
      </div>
    </>
  )
}

export default LearnPage

const homepageQuery = groq`*[_type == 'resource' && slug.current == "curated-home-page"][0]{
    title,
    'sections': resources[]{
      'id': _id,
      title,
      'slug': slug.current,
      displayComponent,
      image,
      path,
      description,
      'topics': resources[]{
        'id': _id,
        title,
        path,
        image,
      },
      resources[]->{
        'id': _id,
        externalId,
        title,
        'name': type,
        'description': summary,
        path,
        'slug': slug.current,
        byline,
        image,
        images {
          label,
          url,
        },
        'tag': softwareLibraries[][0] {
          'name': library->name,
         },
        'ogImage': images[label == 'main-og-image'][0].url,
        'instructor': collaborators[]->[role == 'instructor'][0]{
            'name': person->name,
            'image': person->image.url
            },
        }
    }
  }`

const Resource = z.object({
  id: z.string(),
  externalId: z.number(),
  title: z.string(),
  name: z.string(),
  description: z.string(),
  path: z.string(),
  slug: z.string(),
  byline: z.string(),
  image: z.union([z.string(), z.object({src: z.string(), alt: z.string()})]),
  images: z.object({
    label: z.string(),
    url: z.string(),
  }),
  tag: z.object({
    name: z.string(),
  }),
  ogImage: z.string(),
  instructor: z.object({
    name: z.string(),
    image: z.string(),
  }),
})
export type SanityResourceType = z.infer<typeof Resource>

const Topic = z.object({
  id: z.string().optional(),
  title: z.string().optional(),
  path: z.string().optional(),
  image: z.string().optional(),
})

const SanitySection = z.object({
  id: z.string().optional(),
  title: z.string(),
  slug: z.string().optional(),
  displayComponent: z.string().optional(),
  image: z.string().optional(),
  path: z.string().optional(),
  description: z.string().optional(),
  topics: z.array(Topic).optional(),
  resources: z.array(Resource).nullish(),
})
export type SanitySectionType = z.infer<typeof SanitySection>

const CuratedHomePageData = z.object({
  title: z.string(),
  sections: z.array(SanitySection).nonempty(),
})
export type CuratedHomePageDataType = z.infer<typeof CuratedHomePageData>

export async function getStaticProps() {
  const data = await sanityClient.fetch(homepageQuery)
  const holidayCourses = saleOn ? await loadHolidayCourses() : {}

  return {
    props: {
      holidayCourses,
      data,
    },
  }
}
