import React from 'react'
import {NextSeo} from 'next-seo'
import Card from 'components/pages/home/card'
import Collection from 'components/pages/home/collection'
import Topic from '../../components/topic'
import angularPageData from './angular-page-data'
import {find} from 'lodash'
import Image from 'next/image'
import ExternalTrackedLink from 'components/external-tracked-link'

const SearchAngular = () => {
  const location = 'css landing'
  const description = `Life is too short for lonnnnnng boring videos. Learn Angular using the best screencast tutorial videos online.`
  const title = `In-Depth Up-to-Date Angular Tutorials for ${new Date().getFullYear()}`

  const beginner: any = find(angularPageData, {id: 'beginner'})
  const intermediate: any = find(angularPageData, {id: 'intermediate'})
  const advanced: any = find(angularPageData, {id: 'advanced'})

  return (
    <div className="mb-10 pb-10 xl:px-0 px-5 max-w-screen-xl mx-auto dark:bg-gray-900">
      <NextSeo
        description={description}
        title={title}
        titleTemplate={'%s | egghead.io'}
        twitter={{
          site: `@eggheadio`,
          cardType: 'summary',
        }}
        openGraph={{
          title,
          description: description,
          site_name: 'egghead',
          images: [
            {
              url: `https://d2eip9sf3oo6c2.cloudfront.net/tags/images/000/000/300/full/angular2.png`,
            },
          ],
        }}
      />
      <div className="md:grid md:grid-cols-12 grid-cols-1 gap-5 items-start space-y-5 md:space-y-0 dark:bg-gray-900">
        <Topic
          className="col-span-8"
          title="AWS"
          imageUrl="https://d2eip9sf3oo6c2.cloudfront.net/tags/images/000/000/300/full/angular2.png"
        >
          {`
Description of Angular
`}
        </Topic>
        <ExternalTrackedLink
          eventName="clicked epic react banner"
          params={{location}}
          className="block md:col-span-4 rounded-md w-full h-full overflow-hidden border-0 border-gray-100 relative text-center"
          href="https://epicreact.dev"
        >
          <Image
            priority
            quality={100}
            width={417}
            height={463}
            src="https://res.cloudinary.com/dg3gyk0gu/image/upload/v1611336740/next.egghead.io/react/epic_react_link_banner.png"
            alt="epicreact.dev by Kent C. Dodds"
          />
        </ExternalTrackedLink>
      </div>
      <div className="grid md:grid-cols-3 grid-cols-1 gap-5 items-start sm:mt-5 mt-3">
        <Card resource={beginner} location={location}>
          <Collection />
        </Card>
        <Card resource={intermediate} location={location} className="h-full">
          <Collection />
        </Card>
        <Card resource={advanced} location={location} className="h-full">
          <Collection />
        </Card>
      </div>
    </div>
  )
}

export default SearchAngular
