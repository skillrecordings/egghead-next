import {FunctionComponent} from 'react'
import {GetServerSideProps} from 'next'
import {loadPodcasts} from 'lib/podcasts'
import Link from 'next/link'

type PodcastProps = {
  podcasts: any[]
}

const PodcastIndex: FunctionComponent<PodcastProps> = ({podcasts}) => {
  return (
    <div className="prose">
      <h1>egghead developer chats</h1>
      <h3>
        Humans talking about the business of building software, constant
        learning, and balancing it with everyday life.
      </h3>
      <div>
        <div className="max-w-sm w-full lg:max-w-full lg:flex">
          <div className="border-r border-b border-l border-gray-400 lg:border-l lg:border-t lg:border-gray-400 bg-white rounded-b lg:rounded-b-none lg:rounded-r p-4 flex flex-col justify-between leading-normal">
            <div className="mb-8">
              <p className="text-gray-700 text-base">
                Some of my favorite developer podcasts I've listened to recently
                are the egghead developer chats where{' '}
                <a href="https://twitter.com/jhooks">@jhooks</a> is
                interviewing. He has a great rapport with his guests. You just
                feel like a fly on the wall during an interesting conversation
                about software.
              </p>
            </div>
            <div className="flex items-center">
              <img
                className="w-10 h-10 rounded-full mr-4"
                src="https://pbs.twimg.com/profile_images/1291781417119232005/YqmtL1aD_400x400.jpg"
                alt="Avatar of Jonathan Reinink"
              />
              <div className="text-sm">
                <p className="text-gray-900 leading-none">
                  Tony Cimaglia{' '}
                  <a href="https://twitter.com/TonyCimaglia/status/1295763329999417360">
                    on Twitter
                  </a>
                </p>
                <p className="text-gray-600">Aug 18</p>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-6 prose">
          {podcasts.map((podcast) => {
            return (
              <div key={podcast.slug}>
                <Link href={podcast.path}>
                  <a>{podcast.title}</a>
                </Link>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default PodcastIndex

export const getServerSideProps: GetServerSideProps = async ({res}) => {
  res.setHeader('Cache-Control', 's-maxage=600, stale-while-revalidate')
  const podcasts = await loadPodcasts()
  return {
    props: {
      podcasts,
    },
  }
}
