import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {NextSeo} from 'next-seo'
import Card from 'components/pages/home/card'
import Collection from 'components/pages/home/collection'
import Topic from '../../components/topic'
import awsPageData from './aws-page-data'
import {find, get} from 'lodash'
import EggheadPlayer from 'components/EggheadPlayer'
import ExternalTrackedLink from '../../../external-tracked-link'
import {track} from 'utils/analytics'
import {bpMinMD} from 'utils/breakpoints'
import {useTheme} from 'next-themes'

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
        <AWSCourse location="AWS Page" />
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

const AWSCourse: React.FC<{location: string}> = ({location}) => {
  const resource: any = find(awsPageData, {id: 'jumbotron'})
  const {path, image, title, byline, instructor} = resource
  return (
    <ExternalTrackedLink
      eventName="clicked epic react banner"
      params={{location}}
      className="block md:col-span-4 rounded-md w-full h-full overflow-hidden border-0 border-gray-100 relative text-center"
      href="/playlists/containerize-full-stack-javascript-applications-with-docker-30a8"
    >
      <div
        className="md:-mt-5 flex items-center justify-center bg-gray-900 dark:bg-gray-800 text-white overflow-hidden rounded-b-lg md:rounded-t-none rounded-t-lg shadow-sm"
        css={{
          [bpMinMD]: {
            minHeight: 477,
          },
        }}
      >
        <div className="relative z-10 px-5 sm:py-16 py-10 sm:text-left text-center">
          <div className="space-y-5 mx-auto flex items-center justify-center max-w-screen-xl">
            <div className="flex flex-col items-center justify-center sm:space-x-5 sm:space-y-0 space-y-5">
              <div className="flex-shrink-0">
                <Link href={path}>
                  <a
                    tabIndex={-1}
                    onClick={() =>
                      track('clicked jumbotron resource', {
                        resource: path,
                        linkType: 'image',
                      })
                    }
                  >
                    <Image
                      quality={100}
                      src={get(image, 'src', image)}
                      width={250}
                      height={250}
                      alt={get(image, 'alt', `illustration for ${title}`)}
                    />
                  </a>
                </Link>
              </div>
              <div className="flex flex-col sm:items-start items-center">
                <h2 className="text-xs text-orange-300 uppercase font-semibold mb-2">
                  {byline}
                </h2>
                <Link href={path}>
                  <a
                    className="text-xl font-extrabold leading-tighter hover:text-blue-300 text-gray-800 dark:text-gray-200"
                    onClick={() =>
                      track('clicked jumbotron resource', {
                        resource: path,
                        linkType: 'text',
                      })
                    }
                  >
                    <h1>{title}</h1>
                  </a>
                </Link>
                <Link href={instructor.path}>
                  <a
                    className="mt-4 flex items-center space-x-2 text-base group"
                    onClick={() =>
                      track('clicked instructor in jumbotron', {
                        instructor: instructor.slug,
                      })
                    }
                  >
                    <Image
                      src={instructor.image}
                      width={40}
                      height={40}
                      className="rounded-full"
                      alt={instructor.name}
                    />
                    <span className="group-hover:text-blue-200 text-gray-900 dark:text-gray-200">
                      {instructor.name}
                    </span>
                  </a>
                </Link>
              </div>
            </div>
          </div>
        </div>
        <UniqueBackground className="absolute" />
      </div>
    </ExternalTrackedLink>
  )
}

const UniqueBackground = ({className}: any) => {
  const {theme} = useTheme()

  const fill = theme === 'dark' ? '#121927' : '#ffffff'
  const stroke = theme === 'dark' ? '#C1D7EC' : '#0f131e'
  return (
    <svg
      viewBox="0 0 540 1200"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clip-path="url(#clip0)">
        <rect width="540" height="960" fill={fill} />
        <g opacity="0.2">
          <rect
            width="149.278"
            height="149.278"
            transform="matrix(0.866044 0.499967 -0.866044 0.499967 544.593 36.5376)"
            stroke={stroke}
            stroke-width="1.59375"
          />
        </g>
        <g opacity="0.2">
          <rect
            width="149.278"
            height="149.278"
            transform="matrix(0.866044 0.499967 -0.866044 0.499967 542.85 780.054)"
            stroke={stroke}
            stroke-width="1.59375"
          />
        </g>
        <g opacity="0.2">
          <rect
            width="149.278"
            height="149.278"
            transform="matrix(0.866044 0.499967 -0.866044 0.499967 25.6729 631.264)"
            stroke={stroke}
            stroke-width="1.59375"
          />
          <rect
            width="149.278"
            height="149.278"
            transform="matrix(0.866044 0.499967 -0.866044 0.499967 -103.608 705.898)"
            fill="white"
            fill-opacity="0.1"
            stroke={stroke}
            stroke-width="1.59375"
          />
          <rect
            width="149.278"
            height="149.278"
            transform="matrix(0.866044 0.499967 -0.866044 0.499967 154.955 705.898)"
            fill="white"
            fill-opacity="0.1"
            stroke={stroke}
            stroke-width="1.59375"
          />
          <rect
            width="149.278"
            height="149.278"
            transform="matrix(0.866044 0.499967 -0.866044 0.499967 -103.156 556.39)"
            fill="white"
            fill-opacity="0.1"
            stroke={stroke}
            stroke-width="1.59375"
          />
          <rect
            width="149.278"
            height="149.278"
            transform="matrix(0.866044 0.499967 -0.866044 0.499967 25.6729 780.533)"
            stroke={stroke}
            stroke-width="1.59375"
          />
          <rect
            width="149.278"
            height="149.278"
            transform="matrix(0.866044 0.499967 -0.866044 0.499967 -103.608 855.167)"
            fill="white"
            fill-opacity="0.1"
            stroke={stroke}
            stroke-width="1.59375"
          />
          <rect
            width="149.278"
            height="149.278"
            transform="matrix(0.866044 0.499967 -0.866044 0.499967 284.236 780.533)"
            stroke={stroke}
            stroke-width="1.59375"
          />
          <rect
            width="149.278"
            height="149.278"
            transform="matrix(0.866044 0.499967 -0.866044 0.499967 154.953 855.167)"
            fill="white"
            fill-opacity="0.1"
            stroke={stroke}
            stroke-width="1.59375"
          />
          <rect
            width="149.278"
            height="149.278"
            transform="matrix(0.866044 0.499967 -0.866044 0.499967 25.6729 929.801)"
            stroke={stroke}
            stroke-width="1.59375"
          />
          <rect
            width="149.278"
            height="149.278"
            transform="matrix(0.866044 0.499967 -0.866044 0.499967 413.517 855.167)"
            fill="white"
            fill-opacity="0.1"
            stroke={stroke}
            stroke-width="1.59375"
          />
          <rect
            width="149.278"
            height="149.278"
            transform="matrix(0.866044 0.499967 -0.866044 0.499967 284.235 929.801)"
            stroke={stroke}
            stroke-width="1.59375"
          />
        </g>
        <g opacity="0.2">
          <rect
            width="149.278"
            height="149.278"
            transform="matrix(0.866044 0.499967 -0.866044 0.499967 542.832 183.762)"
            stroke={stroke}
            stroke-width="1.59375"
          />
          <rect
            width="149.278"
            height="149.278"
            transform="matrix(0.866044 0.499967 -0.866044 0.499967 413.55 258.396)"
            fill="white"
            fill-opacity="0.1"
            stroke={stroke}
            stroke-width="1.59375"
          />
          <rect
            width="149.278"
            height="149.278"
            transform="matrix(0.866044 0.499967 -0.866044 0.499967 284.269 333.031)"
            stroke={stroke}
            stroke-width="1.59375"
          />
          <rect
            width="149.278"
            height="149.278"
            transform="matrix(0.866044 0.499967 -0.866044 0.499967 154.987 407.665)"
            fill="white"
            fill-opacity="0.1"
            stroke={stroke}
            stroke-width="1.59375"
          />
          <rect
            width="149.278"
            height="149.278"
            transform="matrix(0.866044 0.499967 -0.866044 0.499967 25.7041 482.299)"
            stroke={stroke}
            stroke-width="1.59375"
          />
          <rect
            width="149.278"
            height="149.278"
            transform="matrix(0.866044 0.499967 -0.866044 0.499967 542.831 333.031)"
            stroke={stroke}
            stroke-width="1.59375"
          />
          <rect
            width="149.278"
            height="149.278"
            transform="matrix(0.866044 0.499967 -0.866044 0.499967 413.55 407.665)"
            fill="white"
            fill-opacity="0.1"
            stroke={stroke}
            stroke-width="1.59375"
          />
          <rect
            width="149.278"
            height="149.278"
            transform="matrix(0.866044 0.499967 -0.866044 0.499967 284.269 482.299)"
            stroke={stroke}
            stroke-width="1.59375"
          />
          <rect
            width="149.278"
            height="149.278"
            transform="matrix(0.866044 0.499967 -0.866044 0.499967 154.987 556.934)"
            fill="white"
            fill-opacity="0.1"
            stroke={stroke}
            stroke-width="1.59375"
          />
          <rect
            width="149.278"
            height="149.278"
            transform="matrix(0.866044 0.499967 -0.866044 0.499967 542.831 482.299)"
            stroke={stroke}
            stroke-width="1.59375"
          />
          <rect
            width="149.278"
            height="149.278"
            transform="matrix(0.866044 0.499967 -0.866044 0.499967 413.55 556.934)"
            fill="white"
            fill-opacity="0.1"
            stroke={stroke}
            stroke-width="1.59375"
          />
          <rect
            width="149.278"
            height="149.278"
            transform="matrix(0.866044 0.499967 -0.866044 0.499967 284.269 631.568)"
            stroke={stroke}
            stroke-width="1.59375"
          />
          <rect
            width="149.278"
            height="149.278"
            transform="matrix(0.866044 0.499967 -0.866044 0.499967 542.831 631.568)"
            stroke={stroke}
            stroke-width="1.59375"
          />
          <rect
            width="149.278"
            height="149.278"
            transform="matrix(0.866044 0.499967 -0.866044 0.499967 413.55 706.202)"
            fill="white"
            fill-opacity="0.1"
            stroke={stroke}
            stroke-width="1.59375"
          />
        </g>
        <g opacity="0.2">
          <rect
            width="149.278"
            height="149.278"
            transform="matrix(0.866044 0.499967 -0.866044 0.499967 25.6729 -113.993)"
            stroke={stroke}
            stroke-width="1.59375"
          />
          <rect
            width="149.278"
            height="149.278"
            transform="matrix(0.866044 0.499967 -0.866044 0.499967 -103.608 -39.3584)"
            fill="white"
            fill-opacity="0.1"
            stroke={stroke}
            stroke-width="1.59375"
          />
          <rect
            width="149.278"
            height="149.278"
            transform="matrix(0.866044 0.499967 -0.866044 0.499967 154.955 -39.3584)"
            fill="white"
            fill-opacity="0.1"
            stroke={stroke}
            stroke-width="1.59375"
          />
          <rect
            width="149.278"
            height="149.278"
            transform="matrix(0.866044 0.499967 -0.866044 0.499967 25.6729 35.2759)"
            stroke={stroke}
            stroke-width="1.59375"
          />
          <rect
            width="149.278"
            height="149.278"
            transform="matrix(0.866044 0.499967 -0.866044 0.499967 -103.608 109.91)"
            fill="white"
            fill-opacity="0.1"
            stroke={stroke}
            stroke-width="1.59375"
          />
          <rect
            width="149.278"
            height="149.278"
            transform="matrix(0.866044 0.499967 -0.866044 0.499967 284.235 35.2759)"
            stroke={stroke}
            stroke-width="1.59375"
          />
          <rect
            width="149.278"
            height="149.278"
            transform="matrix(0.866044 0.499967 -0.866044 0.499967 154.955 109.91)"
            fill="white"
            fill-opacity="0.1"
            stroke={stroke}
            stroke-width="1.59375"
          />
          <rect
            width="149.278"
            height="149.278"
            transform="matrix(0.866044 0.499967 -0.866044 0.499967 25.6729 184.544)"
            stroke={stroke}
            stroke-width="1.59375"
          />
          <rect
            width="149.278"
            height="149.278"
            transform="matrix(0.866044 0.499967 -0.866044 0.499967 -103.608 259.179)"
            fill="white"
            fill-opacity="0.1"
            stroke={stroke}
            stroke-width="1.59375"
          />
          <rect
            width="149.278"
            height="149.278"
            transform="matrix(0.866044 0.499967 -0.866044 0.499967 413.517 109.91)"
            fill="white"
            fill-opacity="0.1"
            stroke={stroke}
            stroke-width="1.59375"
          />
          <rect
            y="0.546839"
            width="148.185"
            height="148.185"
            transform="matrix(0.866044 0.499967 -0.866044 0.499967 284.709 184.818)"
            stroke={stroke}
            stroke-width="1.59375"
          />
          <rect
            width="149.278"
            height="149.278"
            transform="matrix(0.866044 0.499967 -0.866044 0.499967 154.955 259.179)"
            fill="white"
            fill-opacity="0.1"
            stroke={stroke}
            stroke-width="1.59375"
          />
          <rect
            width="149.278"
            height="149.278"
            transform="matrix(0.866044 0.499967 -0.866044 0.499967 25.6729 333.813)"
            stroke={stroke}
            stroke-width="1.59375"
          />
          <rect
            width="149.278"
            height="149.278"
            transform="matrix(0.866044 0.499967 -0.866044 0.499967 -103.608 408.447)"
            fill="white"
            fill-opacity="0.1"
            stroke={stroke}
            stroke-width="1.59375"
          />
        </g>
        <rect width="545" height="960" fill="url(#paint0_linear)" />
      </g>
      <defs>
        <linearGradient
          id="paint0_linear"
          x1="273"
          y1="960"
          x2="273"
          y2="3.59151e-06"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color={fill} />
          <stop offset="1" stop-color={fill} stop-opacity=".5" />
        </linearGradient>
        <clipPath id="clip0">
          <rect width="540" height="960" fill="white" />
        </clipPath>
      </defs>
    </svg>
  )
}

export default SearchAWS
