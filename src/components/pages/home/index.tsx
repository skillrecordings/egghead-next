import React, {FunctionComponent} from 'react'
import Card from './components/card'
import EggheadPlayer from 'components/EggheadPlayer'
import Link from 'next/link'
import Image from 'next/image'
import {map, get, find, take, reject, isEmpty} from 'lodash'
import Textfit from 'react-textfit'
import Markdown from 'react-markdown'
import {useViewer} from 'context/viewer-context'
import Header from './components/header'
import homepageData from './homepage-data'
import SortingHat from 'components/survey/sorting-hat'
import useLastResource from 'hooks/use-last-resource'
import useEggheadSchedule, {ScheduleEvent} from 'hooks/use-egghead-schedule'

const Home: FunctionComponent = () => {
  const {viewer, loading} = useViewer()
  const {lastResource} = useLastResource()
  const [schedule, scheduleLoading] = useEggheadSchedule()
  const video: any = find(homepageData, {id: 'video'})

  let featured: any = get(find(homepageData, {id: 'featured'}), 'resources', {})
  const devEssentials: any = find(homepageData, {id: 'devEssentials'})
  const freeCourses: any = find(homepageData, {id: 'freeCourses'})
  const stateManagement: any = find(homepageData, {
    id: 'stateManagement',
  })
  const advancedCourse: any = find(homepageData, {id: 'advancedCourse'})
  const sideProject: any = find(homepageData, {id: 'sideProject'})
  const buildInPublic: any = find(homepageData, {id: 'buildInPublic'})
  const portfolioProject: any = find(homepageData, {id: 'portfolioProject'})
  const portfolioBlog: any = find(homepageData, {id: 'portfolioBlog'})
  const mdxConf: any = find(homepageData, {id: 'mdxConf'})
  const topics: any = find(homepageData, {id: 'topics'})
  const swag: any = find(homepageData, {id: 'swag'})

  if (lastResource) {
    featured = [
      {
        name: `Keep Watching`,
        title: lastResource.title,
        path: lastResource.path,
        image: lastResource.image_url,
      },
      ...take(reject(featured, {path: lastResource.path}), featured.length - 1),
    ]
  }

  type CardProps = {
    data: any
    className?: string
  }

  const CardVerticalLarge: FunctionComponent<CardProps> = ({data}) => {
    const {path, image, title, name, byline} = data
    return (
      <Card className="border-none flex flex-col items-center justify-center text-center sm:py-8 py-6">
        <>
          {image && (
            <Link href={path}>
              <a className="mb-2 sm:w-auto w-24">
                <Image
                  width={140}
                  height={140}
                  src={image}
                  alt={`illustration for ${title}`}
                />
              </a>
            </Link>
          )}
          <h2 className="uppercase font-semibold text-xs mb-1 text-gray-700">
            {name}
          </h2>
          <Link href={path}>
            <a className="hover:text-blue-600">
              <h3 className="md:text-lg text-base sm:font-semibold font-bold leading-tight">
                <Textfit mode="multi" min={14} max={20}>
                  {title}
                </Textfit>
              </h3>
            </a>
          </Link>
          <div className="text-xs text-gray-600 mt-1">{byline}</div>
        </>
      </Card>
    )
  }

  const CardVerticalWithStack: FunctionComponent<CardProps> = ({
    data,
    className,
  }) => {
    const {name, title, description, resources, path} = data
    return (
      <Card>
        <>
          <h2 className="uppercase font-semibold text-xs mb-1 text-gray-700">
            {name}
          </h2>
          {path ? (
            <Link href={path}>
              <a className="hover:text-blue-600">
                <h3 className="text-xl font-bold tracking-tight leading-tight mb-2">
                  {title}
                </h3>
              </a>
            </Link>
          ) : (
            <h3 className="text-xl font-bold tracking-tight leading-tight mb-2">
              {title}
            </h3>
          )}
          <div>
            <Markdown className="prose prose-sm max-w-none mb-3">
              {description}
            </Markdown>
            <ul>
              {map(resources, (resource) => {
                const {title, path, image, byline} = resource
                const isLesson = path.includes('lessons')
                const imageSize = isLesson ? 32 : 50
                return (
                  <li
                    key={resource.path}
                    className={`flex items-center py-2 ${
                      className ? className : ''
                    }`}
                  >
                    {image && (
                      <Link href={path}>
                        <a className="sm:w-12 w-12 flex-shrink-0 flex justify-center items-center ">
                          <Image
                            src={image}
                            width={imageSize}
                            height={imageSize}
                            alt={`illustration for ${title}`}
                          />
                        </a>
                      </Link>
                    )}
                    <div className="ml-3">
                      <Link href={path}>
                        <a className="hover:text-blue-600">
                          <h4 className="text-lg font-semibold leading-tight">
                            <Textfit mode="multi" min={14} max={17}>
                              {title}
                            </Textfit>
                          </h4>
                        </a>
                      </Link>
                      <div className="text-xs text-gray-600">{byline}</div>
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>
        </>
      </Card>
    )
  }

  return (
    <>
      <div className="space-y-5">
        {!viewer && !loading && <Header />}
        <div className="grid lg:grid-cols-8 grid-cols-1 gap-5">
          <Card className="lg:col-span-6">
            <div className="flex sm:flex-row flex-col justify-center">
              <div className="flex flex-col justify-between items-start sm:pr-16 sm:pb-0 pb-10">
                <div>
                  <h2 className="uppercase font-semibold text-xs text-gray-700">
                    {video.name}
                  </h2>
                  <Link href={video.path}>
                    <a className="hover:text-blue-600">
                      <h3 className="text-2xl font-bold tracking-tight leading-tighter mt-2">
                        {video.title}
                      </h3>
                    </a>
                  </Link>
                  <div className="text-sm text-gray-600 hover:text-gray-900 transition-colors duration-150 ease-in-out mt-1">
                    <Link href={video.instructor_path || ''}>
                      <a className="hover:text-blue-600">{video.instructor}</a>
                    </Link>
                  </div>
                  <Markdown className="prose prose-sm mt-4">
                    {video.description}
                  </Markdown>
                </div>
              </div>
              <div className="sm:w-full -m-5 flex items-center flex-grow bg-black">
                <EggheadPlayer
                  preload={false}
                  autoplay={false}
                  poster={video.poster}
                  hls_url={video.hls_url}
                  dash_url={video.dash_url}
                  subtitlesUrl={video.subtitlesUrl}
                  width="100%"
                  height="auto"
                />
              </div>
            </div>
          </Card>
          <Card className="lg:col-span-2 relative bg-gradient-to-br from-blue-600 via-blue-600 to-indigo-600 text-white">
            <>
              <h2 className="uppercase font-semibold text-xs text-blue-200">
                Upcoming Events
              </h2>
              {!isEmpty(schedule) ? (
                <ul className="mt-4 leading-tight space-y-3 relative z-10">
                  {map(schedule, (resource: ScheduleEvent) => (
                    <li className="w-full" key={resource.informationUrl}>
                      <div className="font-semibold">
                        <div>
                          {resource.informationUrl ? (
                            <Link href={resource.informationUrl}>
                              <a className="hover:underline">
                                {resource.title}
                              </a>
                            </Link>
                          ) : (
                            resource.title
                          )}
                        </div>
                      </div>
                      <div className="w-full flex items-center mt-1">
                        {resource.subtitle && (
                          <time className="mr-1 tabular-nums text-xs">
                            {resource.subtitle}
                          </time>
                        )}
                        {resource.calendarUrl && (
                          <Link href={resource.calendarUrl}>
                            <a className="inline-flex rounded-md items-center font-semibold p-1 text-xs bg-blue-700 hover:bg-blue-800 text-white duration-150 transition-colors ease-in-out">
                              {/* prettier-ignore */}
                              <svg className="inline-flex" width="14" height="14" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><g fill="none"><path d="M10 2a6 6 0 0 0-6 6v3.586l-.707.707A1 1 0 0 0 4 14h12a1 1 0 0 0 .707-1.707L16 11.586V8a6 6 0 0 0-6-6z" fill="currentColor"/><path d="M10 18a3 3 0 0 1-3-3h6a3 3 0 0 1-3 3z" fill="currentColor"/></g></svg>
                            </a>
                          </Link>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <ul className="mt-4 leading-tight space-y-3 relative z-10">
                  <li className="w-full">
                    <div className="font-semibold">
                      {scheduleLoading
                        ? ``
                        : `Nothing is scheduled at this time!`}
                    </div>
                  </li>
                </ul>
              )}
              <div
                className="absolute top-0 left-0 w-full h-full sm:opacity-75 opacity-25 pointer-events-none z-0"
                css={{
                  backgroundImage:
                    'url(https://res.cloudinary.com/dg3gyk0gu/image/upload/v1606467202/next.egghead.io/eggodex/playful-eggo_2x.png)',
                  backgroundSize: 200,
                  backgroundPosition: 'bottom 5px right -5px',
                  backgroundRepeat: 'no-repeat',
                }}
              />
            </>
          </Card>
        </div>
        <div className="grid lg:grid-cols-12 grid-cols-1 gap-5">
          <div className="lg:col-span-8 space-y-5">
            <div
              className={`grid sm:grid-cols-${featured.length} grid-cols-2 sm:gap-5 gap-3`}
            >
              {map(featured, (resource) => {
                return <CardVerticalLarge key={resource.path} data={resource} />
              })}
            </div>
            <Card className="border-none my-4">
              <>
                <div className="flex space-x-5">
                  {portfolioProject.image && (
                    <Link href={portfolioProject.path}>
                      <a className="block flex-shrink-0 sm:w-auto w-20">
                        <Image
                          src={portfolioProject.image}
                          width={160}
                          height={160}
                          alt={`illustration for ${portfolioProject.title}`}
                        />
                      </a>
                    </Link>
                  )}
                  <div className="flex flex-col justify-center items-start">
                    <h2 className=" uppercase font-semibold text-xs tracking-tight text-gray-700 mb-1">
                      {portfolioProject.name}
                    </h2>
                    <Link href={portfolioProject.path}>
                      <a className="hover:text-blue-600">
                        <h3 className="text-xl font-bold leading-tighter">
                          {portfolioProject.title}
                        </h3>
                      </a>
                    </Link>
                    <div className="text-xs text-gray-600 mb-2">
                      {portfolioProject.byline}
                    </div>
                    <Markdown className="prose prose-sm max-w-none">
                      {portfolioProject.description}
                    </Markdown>
                  </div>
                </div>
              </>
            </Card>
            <Card className="border-none my-4">
              <>
                <div className="flex space-x-5">
                  {portfolioBlog.image && (
                    <Link href={portfolioBlog.path}>
                      <a className="block flex-shrink-0 sm:w-auto w-20">
                        <Image
                          src={portfolioBlog.image}
                          width={160}
                          height={160}
                          alt={`illustration for ${portfolioBlog.title}`}
                        />
                      </a>
                    </Link>
                  )}
                  <div className="flex flex-col justify-center items-start">
                    <h2 className=" uppercase font-semibold text-xs tracking-tight text-gray-700 mb-1">
                      {portfolioBlog.name}
                    </h2>
                    <Link href={portfolioBlog.path}>
                      <a className="hover:text-blue-600">
                        <h3 className="text-xl font-bold leading-tighter">
                          {portfolioBlog.title}
                        </h3>
                      </a>
                    </Link>
                    <div className="text-xs text-gray-600 mb-2">
                      {portfolioBlog.byline}
                    </div>
                    <Markdown className="prose prose-sm max-w-none">
                      {portfolioBlog.description}
                    </Markdown>
                  </div>
                </div>
              </>
            </Card>
            <div className="grid xl:grid-cols-2 lg:grid-cols-1 md:grid-cols-2 grid-cols-1 gap-5">
              <CardVerticalWithStack data={devEssentials} />
              <CardVerticalWithStack data={freeCourses} />
            </div>

            <Card className="border-none my-4">
              <>
                <div className="flex space-x-5">
                  {advancedCourse.image && (
                    <Link href={advancedCourse.path}>
                      <a className="block flex-shrink-0 sm:w-auto w-20">
                        <Image
                          src={advancedCourse.image}
                          width={160}
                          height={160}
                          alt={`illustration for ${advancedCourse.title}`}
                        />
                      </a>
                    </Link>
                  )}
                  <div className="flex flex-col justify-center items-start">
                    <h2 className=" uppercase font-semibold text-xs tracking-tight text-gray-700 mb-1">
                      {advancedCourse.name}
                    </h2>
                    <Link href={advancedCourse.path}>
                      <a className="hover:text-blue-600">
                        <h3 className="text-xl font-bold leading-tighter">
                          {advancedCourse.title}
                        </h3>
                      </a>
                    </Link>
                    <div className="text-xs text-gray-600 mb-2">
                      {advancedCourse.byline}
                    </div>
                    <Markdown className="prose prose-sm max-w-none">
                      {advancedCourse.description}
                    </Markdown>
                  </div>
                </div>
              </>
            </Card>
            <Card className="border-none my-4">
              <>
                <div className="flex space-x-5">
                  {buildInPublic.image && (
                    <Link href={buildInPublic.path}>
                      <a className="block flex-shrink-0 sm:w-auto w-20">
                        <Image
                          src={buildInPublic.image}
                          width={160}
                          height={160}
                          alt={`illustration for ${buildInPublic.title}`}
                        />
                      </a>
                    </Link>
                  )}
                  <div className="flex flex-col justify-center items-start">
                    <h2 className=" uppercase font-semibold text-xs tracking-tight text-gray-700 mb-1">
                      {buildInPublic.name}
                    </h2>
                    <Link href={buildInPublic.path}>
                      <a className="hover:text-blue-600">
                        <h3 className="text-xl font-bold leading-tighter">
                          {buildInPublic.title}
                        </h3>
                      </a>
                    </Link>
                    <div className="text-xs text-gray-600 mb-2">
                      {buildInPublic.byline}
                    </div>
                    <Markdown className="prose prose-sm max-w-none">
                      {buildInPublic.description}
                    </Markdown>
                  </div>
                </div>
              </>
            </Card>
            <Card className="border-none my-4">
              <>
                <div className="flex space-x-5">
                  {sideProject.image && (
                    <Link href={sideProject.path}>
                      <a className="block flex-shrink-0 sm:w-auto w-20">
                        <Image
                          src={sideProject.image}
                          width={160}
                          height={160}
                          alt={`illustration for ${sideProject.title}`}
                        />
                      </a>
                    </Link>
                  )}
                  <div className="flex flex-col justify-center items-start">
                    <h2 className=" uppercase font-semibold text-xs tracking-tight text-gray-700 mb-1">
                      {sideProject.name}
                    </h2>
                    <Link href={sideProject.path}>
                      <a className="hover:text-blue-600">
                        <h3 className="text-xl font-bold leading-tighter">
                          {sideProject.title}
                        </h3>
                      </a>
                    </Link>
                    <div className="text-xs text-gray-600 mb-2">
                      {sideProject.byline}
                    </div>
                    <Markdown className="prose prose-sm max-w-none">
                      {sideProject.description}
                    </Markdown>
                  </div>
                </div>
              </>
            </Card>
          </div>
          <aside className="lg:col-span-4 space-y-5">
            <SortingHat
              className="sm:py-3 py-2 h-full flex flex-col justify-between"
              alternative={
                <CardVerticalWithStack
                  className="sm:py-3 py-2"
                  data={stateManagement}
                />
              }
            />
            <Card className="shadow-none bg-gray-50" padding={'sm:p-0 p-0'}>
              <h2 className="uppercase font-semibold text-xs text-gray-700">
                {topics.name}
              </h2>
              <div>
                <ul className="space-y-2">
                  {map(get(topics, 'resources'), (resource) => (
                    <li className="inline-block mr-2" key={resource.path}>
                      <Link href={resource.path}>
                        <a className="bg-white border border-gray-100 active:bg-gray-50 hover:shadow-sm transition-all ease-in-out duration-150 rounded-md py-2 px-3 space-x-1 text-base tracking-tight font-bold leading-tight flex items-center hover:text-blue-600">
                          {resource.image && (
                            <Image
                              src={resource.image}
                              width={24}
                              height={24}
                              alt={`${resource.title} logo`}
                            />
                          )}{' '}
                          <span>{resource.title}</span>
                        </a>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </Card>
            <Card>
              <>
                <h2 className="uppercase font-semibold text-xs text-gray-700 mb-1">
                  {mdxConf.name}
                </h2>
                <Link href={mdxConf.path}>
                  <a className="inline-block hover:text-blue-600">
                    <h3 className="text-xl tracking-tight font-bold leading-tight mb-1">
                      {mdxConf.title}
                    </h3>
                  </a>
                </Link>
                <div className="text-xs text-gray-600 mb-2">
                  {mdxConf.byline}
                </div>
                <Markdown className="prose prose-sm mb-2">
                  {mdxConf.description}
                </Markdown>
                <ul>
                  {map(get(mdxConf, 'resources'), (resource) => (
                    <li className="py-1" key={resource.path}>
                      <Link href={resource.path}>
                        <a className="hover:text-blue-600 font-semibold">
                          {resource.title}
                        </a>
                      </Link>
                      <div className="text-xs text-gray-600">
                        {resource.byline}
                      </div>
                    </li>
                  ))}
                </ul>
              </>
            </Card>

            <Card>
              <>
                <Link href={swag.path}>
                  <a className="inline-block hover:text-blue-600">
                    <h2 className="uppercase font-semibold text-xs text-gray-600">
                      {swag.name}
                    </h2>
                  </a>
                </Link>
                <Link href={swag.path}>
                  <a className="inline-block hover:text-blue-600">
                    <h3 className="text-lg tracking-tight font-bold leading-tight mb-1">
                      {swag.title}
                    </h3>
                  </a>
                </Link>
                <ul className="grid grid-cols-2 gap-3 mt-3">
                  {map(get(swag, 'resources'), (resource) => (
                    <li
                      className="py-1 flex flex-col items-center text-center  text-gray-600 hover:text-blue-600"
                      key={resource.path}
                    >
                      {resource.image && (
                        <div className="flex-shrink-0">
                          <Link href={resource.path}>
                            <a>
                              <Image
                                className="rounded-lg"
                                src={resource.image}
                                alt={resource.title}
                                width={205}
                                height={205}
                              />
                            </a>
                          </Link>
                        </div>
                      )}
                      <Link href={resource.path}>
                        <a className="text-xs leading-tight">
                          {resource.title}
                        </a>
                      </Link>
                    </li>
                  ))}
                </ul>
              </>
            </Card>
          </aside>
        </div>
      </div>
    </>
  )
}

export default Home
