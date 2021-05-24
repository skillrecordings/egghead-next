import * as React from 'react'
import JumbotronC from '../components/pages/home/jumbotron'
import {GetServerSideProps} from 'next'
import {loadCourse} from '../lib/courses'
import groq from 'groq'
import {sanityClient} from '../utils/sanity-client'
import {loadHomePageData} from '../lib/pages/home-page-data'

export const Jumbotron = ({resources}: {resources: any}) => {
  return (
    <main className="bg-gray-50 dark:bg-gray-900 sm:-my-5 -my-3 -mx-5 p-5">
      <div className="max-w-screen-xl mx-auto">
        <div className="lg:space-y-6 space-y-4">
          <JumbotronC resource={resources?.jumbotron} />
        </div>
      </div>
    </main>
  )
}

export default Jumbotron

export const getServerSideProps: GetServerSideProps = async ({res, params}) => {
  res.setHeader('Cache-Control', 's-maxage=1, stale-while-revalidate')

  const resources = await loadHomePageData()

  return {
    props: {
      resources,
    },
  }
}
