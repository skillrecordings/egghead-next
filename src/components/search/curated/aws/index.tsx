import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {NextSeo} from 'next-seo'
import Topic from '../../components/topic'
import awsPageData from './aws-page-data'
import {find, get} from 'lodash'
import ExternalTrackedLink from '../../../external-tracked-link'
import {track} from 'utils/analytics'
import {bpMinMD} from 'utils/breakpoints'
import {useTheme} from 'next-themes'
import {ThreeLevels} from '../curated-essential'
import VideoCard from '../../../pages/home/video-card'
import {VerticalResourceCollectionCard} from '../../../card/vertical-resource-collection-card'
import {useRouter} from 'next/router'

const SearchAWS = () => {
  const location = 'AWS landing'
  const description = `Life is too short for lonnnnnng boring videos. Learn AWS using the best screencast tutorial videos online led by working professionals that learn in public.`
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

  const router = useRouter()

  return (
    <div>
      <NextSeo
        canonical={`${process.env.NEXT_PUBLIC_DEPLOYMENT_URL}${router.asPath}`}
        description={description}
        title={title}
        titleTemplate={'%s | egghead.io'}
        twitter={{
          site: `@eggheadio`,
          cardType: 'summary_large_image',
        }}
        openGraph={{
          title,
          url: `${process.env.NEXT_PUBLIC_DEPLOYMENT_URL}${router.asPath}`,
          description: description,
          site_name: 'egghead',
          images: [
            {
              url: `https://res.cloudinary.com/dg3gyk0gu/image/upload/v1611981777/egghead-next-pages/graphql/graphql-share-image_2x.png`,
            },
          ],
        }}
      />
      <div className="md:grid md:grid-cols-12 grid-cols-1 items-start space-y-5 md:space-y-0 dark:bg-gray-900 -mx-5">
        <Topic
          className="col-span-8"
          title="AWS"
          imageUrl="https://og-image-react-egghead.now.sh/topic/aws?orientation=portrait&v=20201105"
        >
          {`
Amazon Web Services (AWS) is a powerful expansive cloud infrastructure platform for building modern web applications.

AWS provides services for data, presentation, authentication, security, video encoding, and much more. Offering over 175 fully-featured services from data centers globally, AWS powers a large percentage of the internet.

`}
        </Topic>
        <AWSCourse location="AWS Page" />
      </div>

      <ThreeLevels
        beginner={beginner}
        intermediate={intermediate}
        advanced={advanced}
        location={location}
      />

      <div className="grid md:grid-cols-3 grid-cols-1 mt-8">
        <VideoCard
          resource={awsVideo}
          className="flex md:flex-row flex-col col-span-2 md:mr-4 mr-0"
          location={location}
        />
        <VerticalResourceCollectionCard
          resource={awsSam}
          location={location}
          className="md:mt-0 mt-4"
        />
      </div>
    </div>
  )
}

const AWSCourse: React.FC<React.PropsWithChildren<{location: string}>> = ({
  location,
}) => {
  const {path, title, byline, name, description, image, background, slug} = {
    title: 'Deploy Ghost to AWS using RDS and EC2',
    byline: 'Sam Julien',
    name: 'FEATURED COURSE',
    description: `This course ties together skills like networking, SSH, and using the command line while getting a realistic full-stack platform up and running.`,
    image:
      'https://d2eip9sf3oo6c2.cloudfront.net/playlists/square_covers/000/437/276/full/EGH_ghost-aws_1000.png',
    background:
      'https://res.cloudinary.com/dg3gyk0gu/image/upload/v1634231703/egghead-next-pages/deploy-ghost-to-aws-using-rds-and-ec2/featured-card-background.png',
    path: '/courses/deploy-ghost-to-aws-using-rds-and-ec2-a3487caa',
    slug: 'deploy-ghost-to-aws-using-rds-and-ec2-a3487caa',
  }
  return (
    <div className="md:min-h-[477px] block md:col-span-4 w-full h-full overflow-hidden border-0 border-gray-100 relative text-center">
      <ExternalTrackedLink
        eventName="clicked AWS page CTA"
        params={{location}}
        className="md:-mt-5 flex items-center justify-center bg-white dark:bg-gray-900 text-white overflow-hidden rounded-b-lg md:rounded-t-none rounded-t-lg shadow-sm"
        href="/courses/deploy-ghost-to-aws-using-rds-and-ec2-a3487caa"
      >
        <div className="relative z-10 px-5 py-10 text-center sm:py-16 sm:text-left">
          <div className="flex items-center justify-center max-w-screen-xl mx-auto space-y-5">
            <div className="flex flex-col items-center justify-center space-y-5 sm:space-x-5 sm:space-y-0">
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
              <div className="flex flex-col items-center sm:items-start">
                <p className="mb-2 text-xs font-semibold text-white uppercase">
                  {byline}
                </p>
                <Link href={path}>
                  <a
                    className="text-xl font-extrabold leading-tighter hover:text-blue-300"
                    onClick={() =>
                      track('clicked jumbotron resource', {
                        resource: path,
                        linkType: 'text',
                      })
                    }
                  >
                    <h2>{title}</h2>
                  </a>
                </Link>
                <p className="mt-4">{description}</p>
              </div>
            </div>
          </div>
        </div>
        <Image
          className="absolute top-0 left-0 z-0 w-full h-full"
          src={background}
          alt=""
          layout="fill"
        />
      </ExternalTrackedLink>
    </div>
  )
}

export default SearchAWS
