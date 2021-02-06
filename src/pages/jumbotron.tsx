import * as React from 'react'
import JumbotronC from '../components/pages/home/jumbotron'
import {GetServerSideProps} from 'next'
import {loadCourse} from '../lib/courses'
import groq from 'groq'
import {sanityClient} from '../utils/sanity-client'

export const Jumbotron = ({resource}: {resource: any}) => {
  console.log(resource)
  return (
    <main className="bg-gray-50 dark:bg-gray-900 sm:-my-5 -my-3 -mx-5 p-5">
      <div className="max-w-screen-xl mx-auto">
        <div className="lg:space-y-6 space-y-4">
          <JumbotronC resource={resource} />
        </div>
      </div>
    </main>
  )
}

export default Jumbotron

export const getServerSideProps: GetServerSideProps = async ({res, params}) => {
  const load = async () => {
    const data = await sanityClient.fetch(groq`
      *[slug.current == 'primary-jumbotron-cloudflare-workers-intro'][0]{
        name,
        title,
        description,
        summary,
        byline, 
        meta,
        path,
        'slug': resources[][0]->_id,
        'instructor': collaborators[]->[role == 'instructor'][0]{
          title,
          'slug': person->slug.current,
          'name': person->name,
          'path': person->website,
          'twitter': person->twitter,
          'image': person->image.url
        },
        'background': images[label == 'background'][0].url,
        'image': images[label == 'badge'][0].url,
      }
  `)
    console.log(data)
    return data
  }

  const resource = await load()

  res.setHeader('Cache-Control', 's-maxage=1, stale-while-revalidate')
  return {
    props: {
      resource,
    },
  }
}
