import React from 'react'
import {NextSeo} from 'next-seo'
import Card from 'components/pages/home/card'
import Collection from 'components/pages/home/collection'
import Topic from '../../components/topic'
import awsPageData from './aws-page-data'
import {find} from 'lodash'
import EggheadPlayer from 'components/EggheadPlayer'
import Image from 'next/image'
import ExternalTrackedLink from '../../../external-tracked-link'

const SearchAWS = () => {
  const location = 'AWS landing'
  const description = `Life is too short for lonnnnnng boring videos. Learn AWS using the best screencast tutorial videos online.`
  const title = `In-Depth Up-to-Date AWS Tutorials for ${new Date().getFullYear()}`

  const beginner: any = find(awsPageData, {id: 'beginner'})
  const intermediate: any = find(awsPageData, {
    id: 'aws-amplify',
  })
  const advanced: any = find(awsPageData, {
    id: 'lambda',
  })
  const awsVideo: any = find(awsPageData, {
    id: 'aws-video',
  })
  const awsSam: any = find(awsPageData, {
    id: 'aws-sam',
  })

  return (
    <div className="mb-10 pb-10 xl:px-0 px-5 max-w-screen-xl mx-auto dark:bg-gray-900">
      <NextSeo
        description={description}
        title={title}
        titleTemplate={'%s | egghead.io'}
        twitter={{
          site: `@eggheadio`,
          cardType: 'summary_large_image',
        }}
        openGraph={{
          title,
          description: description,
          site_name: 'egghead',
          images: [
            {
              url: `https://res.cloudinary.com/dg3gyk0gu/image/upload/v1611981777/egghead-next-pages/graphql/graphql-share-image_2x.png`,
            },
          ],
        }}
      />
      <div className="md:grid md:grid-cols-12 grid-cols-1 gap-5 items-start space-y-5 md:space-y-0 dark:bg-gray-900">
        <Topic
          className="col-span-8"
          title="AWS"
          imageUrl="https://og-image-react-egghead.now.sh/topic/aws?orientation=portrait&v=20201104"
        >
          {`
Amazon Web Services (AWS) is a powerful expansive cloud infrastructure platform for building modern web applications.

AWS provides services for data, presentation, authentication, security, video encoding, and much more. Offering over 175 fully-featured services from data centers globally, AWS powers a large percentage of the internet.

`}
        </Topic>
        <ExternalTrackedLink
          eventName="clicked graphql workshop banner"
          params={{location}}
          className="block md:col-span-4 rounded-md w-full h-full overflow-hidden border-0 border-gray-100 relative text-center"
          href="https://graphqlworkshop.com/"
        >
          <Image
            priority
            quality={100}
            width={417}
            height={463}
            src="https://res.cloudinary.com/dg3gyk0gu/image/upload/v1611920902/graphqlworkshop.com/graphqlworkshop-banner_2x.png"
            alt="graphqlworkshop.com by Eve Porcello"
          />
        </ExternalTrackedLink>
      </div>

      <div className="grid md:grid-cols-3 grid-cols-1 gap-5 items-start sm:mt-5 mt-3">
        <Card resource={beginner} location={location} className="h-full">
          <Collection />
        </Card>
        <Card resource={intermediate} location={location} className="h-full">
          <Collection />
        </Card>
        <Card resource={advanced} location={location} className="h-full">
          <Collection />
        </Card>
      </div>

      <div className="grid md:grid-cols-3 grid-cols-1 mt-8">
        <Card
          resource={awsVideo}
          className="flex md:flex-row flex-col col-span-2 md:mr-4 mr-0"
          location={location}
        >
          <div className="sm:w-full sm:-mt-5 -mt-0 sm:-mb-5 -mb-4 md:-mr-5 -mr-4 md:ml-8 -ml-4  flex items-center bg-black flex-shrink-0 md:max-w-sm">
            <EggheadPlayer
              preload={false}
              autoplay={false}
              poster={awsVideo.poster}
              hls_url={awsVideo.hls_url}
              dash_url={awsVideo.dash_url}
              subtitlesUrl={awsVideo.subtitlesUrl}
              width="100%"
              height="auto"
            />
          </div>
        </Card>
        <Card resource={awsSam} location={location} className="md:mt-0 mt-4">
          <Collection />
        </Card>
      </div>
    </div>
  )
}

export default SearchAWS
