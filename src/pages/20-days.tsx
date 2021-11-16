import * as React from 'react'
import groq from 'groq'
import Image from 'next/image'
import {NextSeo} from 'next-seo'
import {CardResource} from 'types'
import {GetServerSideProps} from 'next'
import {sanityClient} from 'utils/sanity-client'
import CourseGrid from 'components/pages/eoy-sale-2021/course-grid'

type EOYSale2021PageProps = {
  data: CardResource
}

const EOYSale2021Page: React.FC<EOYSale2021PageProps> & {getLayout?: any} = ({
  data,
}) => {
  return (
    <>
      <NextSeo noindex={true} title={'20 days of egghead'} />
      <div className="dark:bg-gray-900 bg-gray-50 -m-5">
        <div className="flex flex-col items-center justify-center w-full relative py-40">
          <h3 className="md:text-4xl sm:text-3xl text-2xl font-bold tracking-tight text-center relative z-10 leading-none pb-2">
            New Course a Day
          </h3>
          <p className="opacity-90 dark:text-pink-200 text-blue-500 pt-2 sm:text-base text-sm">
            For 20 days, lorem ipsum dolor sit amet
          </p>
          <Image
            src="https://res.cloudinary.com/dg3gyk0gu/image/upload/v1637069708/egghead-next-pages/20-days-of-egghead/bg_2x.png"
            quality={100}
            layout="fill"
            objectFit="cover"
            objectPosition="50% 50%"
            alt=""
            aria-hidden
            className="pointer-events-none"
          />
        </div>
        <div className="container px-3">
          <CourseGrid data={data} />
        </div>
      </div>
    </>
  )
}

export default EOYSale2021Page

async function loadResource(slug: string) {
  const data = await sanityClient.fetch(
    groq`
          *[slug.current == $slug][0]{
            title,
            resources[]->{
              'id': _id,
              title,
              'slug': slug.current,
              image,
              path,
              'instructor': collaborators[]->[role == 'instructor'][0]{
                title,
                'slug': person->slug.current,
                'name': person->name,
                'path': person->website,
                'twitter': person->twitter,
                'image': person->image.url
              },
            }
          }
        `,
    {slug},
  )

  return data
}

export const getServerSideProps: GetServerSideProps = async ({res, params}) => {
  const data = await loadResource('20-days-of-egghead')

  return {
    props: {
      data,
    },
  }
}
