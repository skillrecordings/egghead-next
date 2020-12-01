import React, {FunctionComponent} from 'react'
import Card from './components/card'
import EggheadPlayer from 'components/EggheadPlayer'
import Link from 'next/link'
import Image from 'next/image'
import {map, get, find} from 'lodash'
import Textfit from 'react-textfit'
import Markdown from 'react-markdown'

type HomeProps = {}

const Home: FunctionComponent<HomeProps> = () => {
  const data = [
    {
      id: 'video',
      name: 'Work Smarter',
      title: 'Rethinking How to Use a Keyboard',
      description:
        'A keyboard is the gateway to code. Your hands are the tools that manage the keyboard. Many people develop pain in their hands from repetitive stress injuries that can seriously damage their ability to code. This talk is about making your keyboard experience as gentle as possible on your hands so your hands are happier and you work more effeciently.',
      instructor: 'John Lindquist',
      instructor_path: '/q/resources-by-john-lindquist',
      path:
        'talks/egghead-save-your-hands-and-save-your-time-rethinking-how-to-use-a-keyboard',
      poster:
        'https://res.cloudinary.com/dg3gyk0gu/image/upload/v1606471489/next.egghead.io/posters/egghead-save-your-hands-and-save-your-time-rethinking-how-to-use-a-keyboard_2x_shrink.png',
      hls_url:
        'https://d2c5owlt6rorc3.cloudfront.net/egghead-save-your-hands-and-save-your-time-rethinking-how-to-use-a-keyboard-McpE69LtI/hls/egghead-save-your-hands-and-save-your-time-rethinking-how-to-use-a-keyboard-McpE69LtI.m3u8',

      dash_url:
        'https://d2c5owlt6rorc3.cloudfront.net/egghead-save-your-hands-and-save-your-time-rethinking-how-to-use-a-keyboard-McpE69LtI/dash/egghead-save-your-hands-and-save-your-time-rethinking-how-to-use-a-keyboard-McpE69LtI.mpd',

      subtitlesUrl:
        'https://egghead.io/api/v1/lessons/egghead-save-your-hands-and-save-your-time-rethinking-how-to-use-a-keyboard/subtitles',
    },
    {
      id: 'featured',
      title: 'Featured',
      resources: [
        {
          name: 'Newest Course',
          title:
            'React Real-Time Messaging with GraphQL using urql and OneGraph',
          byline: 'Ian Jones',
          image:
            'https://d2eip9sf3oo6c2.cloudfront.net/playlists/square_covers/000/409/013/square_280/EGH_RealtimeGraphqL.png',
          path:
            'playlists/react-real-time-messaging-with-graphql-using-urql-and-onegraph-be5a',
        },
        {
          name: 'Featured Playlist',
          title: 'Scale React Development with NX',
          byline: 'Juri Strumpflohner',
          image:
            'https://d2eip9sf3oo6c2.cloudfront.net/playlists/square_covers/000/405/344/full/EGH_ScalingReactNx.png',
          path: 'playlists/scale-react-development-with-nx-4038',
        },
        {
          name: 'Level Up',
          title: 'Advanced JavaScript Foundations',
          byline: 'Tyler Clark',
          image:
            'https://d2eip9sf3oo6c2.cloudfront.net/series/square_covers/000/000/353/full/foundation.png',
          path: 'courses/advanced-javascript-foundations',
        },
      ],
    },
    {
      id: 'devEssentials',
      name: 'Practice Makes Perfect',
      title: 'Web Development Essentials',
      description: '',
      resources: [
        {
          title: 'Web Security Essentials: MITM, CSRF, and XSS',
          byline: 'Mike Sherov・50m・Course',
          image:
            'https://d2eip9sf3oo6c2.cloudfront.net/series/square_covers/000/000/413/square_280/EGH_WebSecurity.png',
          path: 'courses/web-security-essentials-mitm-csrf-and-xss',
        },
        {
          title: "The Beginner's Guide to React",
          byline: 'Kent C. Dodds・2h 27m・Course',
          image:
            'https://d2eip9sf3oo6c2.cloudfront.net/series/square_covers/000/000/160/full/EGH_BeginnersReact2.png',
          path: 'courses/the-beginner-s-guide-to-react',
        },
        {
          title: 'Fix Common Git Mistakes',
          byline: 'Chris Achard・44m・Course',
          image:
            'https://d2eip9sf3oo6c2.cloudfront.net/series/square_covers/000/000/401/full/GitMistakes_1000.png',
          path: 'courses/fix-common-git-mistakes',
        },
        {
          title: 'GraphQL Query Language',
          byline: 'Eve Porcello・30m・Course',
          image:
            'https://d2eip9sf3oo6c2.cloudfront.net/series/square_covers/000/000/236/full/EGH_GraphQLQuery_Final.png',
          path: 'courses/graphql-query-language',
        },
        {
          title: 'Develop Accessible Web Apps with React',
          byline: 'Erin Doyle・1h 28m・Course',
          image:
            'https://d2eip9sf3oo6c2.cloudfront.net/series/square_covers/000/000/412/full/AccessibleReact_1000.png',
          path: 'courses/develop-accessible-web-apps-with-react',
        },
        {
          title: 'Debug the DOM in Chrome with the Devtools Elements panel',
          byline: 'Mykola Bilokonsky・25m・Course',
          image:
            'https://d2eip9sf3oo6c2.cloudfront.net/series/square_covers/000/000/060/full/EGH_Chrome_Elements.png',
          path: 'courses/using-chrome-developer-tools-elements',
        },
      ],
    },
    {
      id: 'stateManagement',
      name: 'Research Panel',
      title: 'React State Management in 2020',
      description: '',
      resources: [
        {
          title: 'Using Redux in Modern React Apps with Mark Erikson',
          byline: 'Mark Erikson & Joel Hooks・90m・Chat',
          image:
            'https://d2eip9sf3oo6c2.cloudfront.net/tags/images/000/000/386/thumb/redux.png',
          path:
            'lessons/react-using-redux-in-modern-react-apps-with-mark-erikson?pl=react-state-management-2020-6bec',
        },
        {
          title:
            'XState for State Management in React Apps with David Khourshid',
          byline: 'David Khourshid & Joel Hooks・55m・Chat',
          image:
            'https://d2eip9sf3oo6c2.cloudfront.net/tags/images/000/001/282/thumb/xstate.png',
          path:
            'lessons/react-xstate-for-state-management-in-react-apps-with-david-khourshid?pl=react-state-management-2020-6bec',
        },
        {
          title: 'State Management in React with Chance Strickland',
          byline: 'Chance Strickland & Joel Hooks・46m・Chat',
          image:
            'https://d2eip9sf3oo6c2.cloudfront.net/tags/images/000/000/026/thumb/react.png',
          path:
            'lessons/react-state-management-in-react-with-chance-strickland?pl=react-state-management-2020-6bec',
        },
        {
          title:
            'Using Recoil to Manage Orthogonal State in React Apps with David McCabe',
          byline: 'David McCabe & Joel Hooks・34m・Chat',
          image:
            'https://d2eip9sf3oo6c2.cloudfront.net/tags/images/000/000/026/thumb/react.png',
          path:
            'lessons/react-using-recoil-to-manage-orthogonal-state-in-react-apps-with-david-mccabe?pl=react-state-management-2020-6bec',
        },
        {
          title: 'Managing Complex State in React with Jared Palmer',
          byline: 'Jared Palmer & Joel Hooks・1h 28m・Chat',
          image:
            'https://d2eip9sf3oo6c2.cloudfront.net/tags/images/000/000/026/thumb/react.png',
          path:
            'lessons/egghead-managing-complex-state-in-react-with-jared-palmer?pl=react-state-management-2020-6bec',
        },
      ],
    },
    {
      id: 'sideProject',
      name: 'Weekend Side Project',
      title: 'Build a Video Chat App with Twilio and Gatsby',
      path: 'courses/build-a-video-chat-app-with-twilio-and-gatsby',
      image:
        'https://d2eip9sf3oo6c2.cloudfront.net/series/square_covers/000/000/395/full/TwilioGatsby_Final.png',
      byline: 'Jason Lengstorf',
      description:
        'In this workshop, Jason Lengstorf will take you from an empty project folder all the way through deployment of a Twilio-powered video chat app built on Gatsby.',
    },
    {
      id: 'mdxConf',
      name: 'Future of Markdown',
      title: 'MDX Conf 2020',
      path: 'playlists/mdx-conf-3fc2',
      byline: 'Chris Biscardi',
      image:
        'https://d2eip9sf3oo6c2.cloudfront.net/tags/images/000/001/289/full/mdx.png',
      description:
        'MDX has grown rapidly since the first commit two and a half years ago. Learn how MDX increases developer productivity, improves educational content authoring, and even peek behind the curtains to see how MDX works.',
      resources: [
        {
          title: 'Demystifying MDX',
          byline: 'Cole Bremis',
          path: 'talks/mdx-demystifying-mdx',
        },
        {
          title: 'MDX v2 Syntax',
          byline: 'Laurie Barth',
          path: 'talks/egghead-mdx-v2-syntax',
        },
        {
          title: 'MDX and VueJS/NuxtJS',
          byline: 'Cole Bremis',
          path: 'talks/mdx-mdx-and-vuejs-nuxtjs',
        },
        {
          title: 'Migrating to MDX',
          byline: 'Monica Powell',
          path: 'talks/mdx-migrating-to-mdx',
        },
        {
          title: 'Personal Site Playground with MDX',
          byline: 'Prince Wilson',
          path: 'talks/mdx-personal-site-playgrounds-with-mdx',
        },
        {
          title: 'The X in MDX',
          byline: 'Rodrigo Pombo',
          path: 'talks/mdx-the-x-in-mdx',
        },
        {
          title: 'Digital Gardening with MDX Magic',
          byline: 'Kathleen McMahon',
          path: 'talks/mdx-digital-gardening-with-mdx-magic',
        },
      ],
    },
    {
      id: 'schedule',
      name: 'Schedule',
      title: 'Upcoming Events',
      resources: [
        {
          title: 'egghead talk with James Quick and Jason Lengstorf',
          byline: 'Dec 2nd @ 12PM PST',
          path:
            'https://egghead.zoom.us/webinar/register/5416061508899/WN_cvmQMHRzRj6aad9pkBWoFg',
          calendar: '',
        },
      ],
    },
    {
      id: 'topics',
      name: 'Popular Topics',
      resources: [
        {
          title: 'React',
          path: 's/react',
          image:
            'https://d2eip9sf3oo6c2.cloudfront.net/tags/images/000/000/026/thumb/react.png',
        },
        {
          title: 'JavaScript',
          path: 's/javascript',
          image:
            'https://d2eip9sf3oo6c2.cloudfront.net/tags/images/000/000/205/thumb/javascriptlang.png',
        },
        {
          title: 'Angular',
          path: 's/angular',
          image:
            'https://d2eip9sf3oo6c2.cloudfront.net/tags/images/000/000/300/thumb/angular2.png',
        },
        {
          title: 'Node',
          path: 's/node',
          image:
            'https://d2eip9sf3oo6c2.cloudfront.net/tags/images/000/000/256/thumb/nodejslogo.png',
        },
        {
          title: 'Gatsby',
          path: 's/gatsby',
          image:
            'https://d2eip9sf3oo6c2.cloudfront.net/tags/images/000/001/211/thumb/gatsby.png',
        },
        {
          title: 'GraphQL',
          path: 's/graphql',
          image:
            'https://d2eip9sf3oo6c2.cloudfront.net/tags/images/000/001/034/thumb/graphqllogo.png',
        },
        {
          title: 'AWS',
          path: 's/aws',
          image:
            'https://d2eip9sf3oo6c2.cloudfront.net/tags/images/000/001/090/thumb/aws.png',
        },
        {
          title: 'RxJS',
          path: 's/rxjs',
          image:
            'https://d2eip9sf3oo6c2.cloudfront.net/tags/images/000/000/375/thumb/rxlogo.png',
        },
        {
          title: 'Redux',
          path: 's/redux',
          image:
            'https://d2eip9sf3oo6c2.cloudfront.net/tags/images/000/000/386/thumb/redux.png',
        },
      ],
    },
    {
      id: 'swag',
      name: 'swag',
      title: '',
      path: 'https://store.egghead.io',
      resources: [
        {
          title: 'GraphQL Query Language Poster',
          path:
            'https://store.egghead.io/product/poster-graphql-query-language',
          image:
            'https://res.cloudinary.com/dg3gyk0gu/image/upload/v1606472163/next.egghead.io/store/poster-graphql-query-language.png',
        },
        {
          title: 'egghead Crewneck',
          path: 'https://store.egghead.io/product/egghead-crewneck',
          image:
            'https://res.cloudinary.com/dg3gyk0gu/image/upload/v1606474619/next.egghead.io/store/egghead-crewneck.png',
        },
        // {
        //   title: 'Shirt',
        //   path: 'https://store.egghead.io/product/egghead-shirt',
        //   image:
        //     'https://res.cloudinary.com/dg3gyk0gu/image/upload/v1606473230/next.egghead.io/store/egghead-shirt.jpg',
        // },
        // {
        //   title: 'Beanie',
        //   path: 'https://store.egghead.io/product/knit-beanie',
        //   image:
        //     'https://res.cloudinary.com/dg3gyk0gu/image/upload/v1606472232/next.egghead.io/store/knit-beanie.jpg',
        // },
      ],
    },
  ]

  const video: any = find(data, {id: 'video'})
  const schedule: any = find(data, {id: 'schedule'})
  const featured: any = get(find(data, {id: 'featured'}), 'resources', {})
  const devEssentials: any = find(data, {id: 'devEssentials'})
  const stateManagement: any = find(data, {
    id: 'stateManagement',
  })
  const sideProject: any = find(data, {id: 'sideProject'})
  const mdxConf: any = find(data, {id: 'mdxConf'})
  const topics: any = find(data, {id: 'topics'})
  const swag: any = find(data, {id: 'swag'})

  type CardProps = {
    data: any
    className?: string
  }

  const CardVerticalLarge: FunctionComponent<CardProps> = ({data}) => {
    const {path, image, title, name, byline} = data
    return (
      <Card className="border-none flex flex-col items-center justify-center text-center sm:py-8 py-6">
        <>
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
    const {name, title, description, resources} = data
    return (
      <Card>
        <>
          <h2 className="uppercase font-semibold text-xs mb-1 text-gray-700">
            {name}
          </h2>
          <h3 className="text-xl font-bold tracking-tight leading-tight mb-2">
            {title}
          </h3>
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
              <div className="sm:w-full -m-5 flex items-center flex-grow bg-gray-900">
                <EggheadPlayer
                  preload={false}
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
                {schedule.title}
              </h2>
              <ul className="mt-4 leading-tight space-y-3 relative z-10">
                {map(get(schedule, 'resources'), (resource) => (
                  <li className="w-full" key={resource.path}>
                    <div className="font-semibold">
                      <div>
                        <a className="hover:underline" href={resource.path}>
                          {resource.title}
                        </a>
                      </div>
                    </div>
                    <div className="w-full flex items-center mt-1">
                      <time className="mr-1 tabular-nums text-xs">
                        {resource.byline}
                      </time>
                      {resource.calendar && (
                        <a
                          href={resource.calendar}
                          className="inline-flex rounded-md items-center font-semibold p-1 text-xs bg-blue-700 hover:bg-blue-800 text-white duration-150 transition-colors ease-in-out"
                        >
                          {/* prettier-ignore */}
                          <svg className="inline-flex" width="14" height="14" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><g fill="none"><path d="M10 2a6 6 0 0 0-6 6v3.586l-.707.707A1 1 0 0 0 4 14h12a1 1 0 0 0 .707-1.707L16 11.586V8a6 6 0 0 0-6-6z" fill="currentColor"/><path d="M10 18a3 3 0 0 1-3-3h6a3 3 0 0 1-3 3z" fill="currentColor"/></g></svg>
                        </a>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
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
            <div className="grid sm:grid-cols-3 grid-cols-2 sm:gap-5 gap-3">
              {map(featured, (resource) => {
                return <CardVerticalLarge key={resource.path} data={resource} />
              })}
            </div>
            <div className="grid xl:grid-cols-2 lg:grid-cols-1 md:grid-cols-2 grid-cols-1 gap-5">
              <CardVerticalWithStack data={devEssentials} />
              <CardVerticalWithStack
                className="sm:py-3 py-2"
                data={stateManagement}
              />
            </div>
            <Card className="border-none my-4">
              <>
                <div className="flex space-x-5">
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
                          <Image
                            src={resource.image}
                            width={24}
                            height={24}
                            alt={`${resource.title} logo`}
                          />{' '}
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
