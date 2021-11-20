import React, {FunctionComponent} from 'react'
import {loadHolidayCourses, holidaySaleOn} from 'lib/holiday-sale'
import {sanityClient} from 'utils/sanity-client'
import Home from 'components/pages/home'
import {NextSeo} from 'next-seo'
import find from 'lodash/find'
import get from 'lodash/get'
import groq from 'groq'

const HomePage: FunctionComponent<any> = ({data, holidayCourses}) => {
  const location = 'home landing'
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

export default HomePage

const homepageQuery = groq`*[_type == 'resource' && slug.current == "curated-home-page"][0]{
    title,
    'sections': resources[]{
      'id': _id,
      title,
      'slug': slug.current,
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
        title,
        'name': type,
        'description': summary,
        path,
        image,
        images,
        'ogImage': images[label == 'main-og-image'][0].url,
        'instructor': collaborators[]->[role == 'instructor'][0]{
            'name': person->name,
            'image': person->image.url
            },
        }
    }
  }`

export async function getStaticProps() {
  const data = await sanityClient.fetch(homepageQuery)
  const holidayCourses = holidaySaleOn ? await loadHolidayCourses() : {}

  return {
    props: {
      holidayCourses,
      data,
    },
  }
}
