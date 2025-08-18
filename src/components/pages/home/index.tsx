import * as React from 'react'
import {useRouter} from 'next/router'
import Search from '@/components/pages/home/search'
import Jumbotron from '@/components/pages/home/jumbotron'
import Topics from './topics'
import WorkshopCTA from '../../workshop/claude-code/workshop-cta'
import toast, {Toaster} from 'react-hot-toast'
import {SanitySectionType, CuratedHomePageDataType} from '@/pages/learn'
import TheFeed from './the-feed'
import {InstantSearchSSRProvider} from 'react-instantsearch'

const topics = [
  {
    image:
      'https://res.cloudinary.com/dg3gyk0gu/image/upload/v1754499088/claude_hfq89e.png',
    path: '/q/claude-code',
    title: 'Claude Code',
  },
  {
    image:
      'https://res.cloudinary.com/dg3gyk0gu/image/upload/v1739440727/cursor-workshop_2x_blgeek.png',
    path: '/q/cursor',
    title: 'Cursor',
  },
  {
    image:
      'https://res.cloudinary.com/dg3gyk0gu/image/upload/v1750287455/tags/ai-sdk.png',
    path: '/q/ai-sdk',
    title: 'AI SDK',
  },
  {
    image:
      'https://res.cloudinary.com/dg3gyk0gu/image/upload/v1739295526/tags/tanstack-table.png',
    path: '/q/tanstack',
    title: 'TanStack',
  },
  {
    image:
      'https://d2eip9sf3oo6c2.cloudfront.net/tags/images/000/000/026/thumb/react.png',
    path: '/q/react',
    title: 'React',
  },
  {
    image:
      'https://d2eip9sf3oo6c2.cloudfront.net/tags/images/000/001/074/thumb/Group_1%281%29.png',
    path: '/q/next',
    title: 'Next.js',
  },
  {
    image:
      'https://d2eip9sf3oo6c2.cloudfront.net/tags/images/000/000/377/thumb/typescriptlang.png',
    path: '/q/typescript',
    title: 'TypeScript',
  },
  {
    image:
      'https://d2eip9sf3oo6c2.cloudfront.net/tags/images/000/000/205/thumb/javascriptlang.png',
    path: '/q/javascript',
    title: 'JavaScript',
  },
]

const Home: React.FC<React.PropsWithChildren<any>> = ({
  data,
  jumbotron,
  location,
  searchServerState,
}: {
  data: CuratedHomePageDataType
  jumbotron: SanitySectionType
  location: string
  searchServerState: any
}) => {
  const router = useRouter()

  React.useEffect(() => {
    const {query} = router
    if (query.message) {
      toast(query.message as string, {
        icon: '✅',
        duration: 5000,
      })
    }
  }, [router])

  React.useEffect(() => {
    const {query} = router
    if (query.type === 'claimed') {
      router.reload()
    }
  }, [])
  return (
    <>
      <main className="">
        <section aria-label="search or browse sections" className="">
          <Search />
          <Topics topics={topics} />
          <WorkshopCTA />
        </section>
        <InstantSearchSSRProvider {...searchServerState}>
          <TheFeed />
        </InstantSearchSSRProvider>
      </main>
    </>
  )
}

export default Home
