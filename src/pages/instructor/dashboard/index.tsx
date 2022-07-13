import * as React from 'react'
import {GetServerSideProps} from 'next'
import groq from 'groq'
import {sanityClient} from 'utils/sanity-client'

import {ACCESS_TOKEN_KEY} from 'utils/auth'
import {getAbilityFromToken} from 'server/ability'

const Dashboard: React.FunctionComponent<any> = ({queryResult}) => {
  console.log('queryResult:', queryResult)
  return (
    <section className="py-10">
      <div className="container">
        <div>
          <h1>instructor dashboard</h1>
        </div>
      </div>
    </section>
  )
}

export const getServerSideProps: GetServerSideProps = async function ({req}) {
  const ability = await getAbilityFromToken(req.cookies[ACCESS_TOKEN_KEY])

  if (ability.can('upload', 'Video')) {
    const testQuery = groq`
    *[_type == 'resource' && type == 'course'][0...5]{
      title,
      'description': summary,
      path,
      byline,
      image,
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
      }
    }`

    const queryResult: any = await sanityClient.fetch(testQuery)

    return {
      props: {
        queryResult,
      },
    }
  } else {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }
}

export default Dashboard
