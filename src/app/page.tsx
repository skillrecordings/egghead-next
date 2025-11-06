import {Suspense} from 'react'
import WorkshopCTA from '@/components/workshop/workshop-cta'
import CompactFeed from './_components/compact-feed'
import CompactFeedSkeleton from './_components/compact-feed-skeleton'
import LatestCoursesFeed from '@/components/courses/latest-courses-feed'
import Header from '@/components/app/header'
import Search from '@/components/pages/home/search'
import Topics from '@/components/pages/home/topics'
import Footer from '@/components/app/footer'
import {Providers} from './providers'
import '@/styles/index.css'

const topics = [
  {
    image:
      'https://res.cloudinary.com/dg3gyk0gu/image/upload/v1758918145/claude_hfq89e.png',
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

export const metadata = {
  title: 'Home - App Router',
  robots: {
    index: false,
    follow: false,
  },
}

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  return (
    <Providers>
      <div className="min-h-screen dark:bg-gray-900 bg-gray-50">
        <Header />

        <Search />

        <Topics topics={topics} />

        <section>
          <Suspense fallback={<div>Loading...</div>}>
            <WorkshopCTA
              workshopLink="/workshop/claude-code"
              featureFlagName="featureFlagClaudeCodeWorkshopSale"
              imageUrl="https://res.cloudinary.com/dg3gyk0gu/image/upload/v1752698761/claude-code-workshop-logo-square_hopfzn.png"
              imageAlt="Claude Code Workshop"
              title="Transform into a Claude Code Power User"
              description="Join a hands-on session to unlock advanced Claude Code workflows, automation, and integrations that will transform your development process."
              featureTags={[
                'Live Q&A',
                'TypeScript SDK',
                'Custom Hooks',
                'MCP Integration',
              ]}
              analyticsLabel="Claude Code Workshop"
            />
            <WorkshopCTA
              workshopLink="/workshop/cursor"
              featureFlagName="featureFlagCursorWorkshopSale"
              imageUrl="https://d2eip9sf3oo6c2.cloudfront.net/tags/images/000/001/411/full/cursor.png"
              imageAlt="Cursor Workshop"
              title="Become a Cursor Power User"
              description="Join a hands-on session to unlock advanced Cursor workflows, automation, and integrations that will transform your development process."
              featureTags={[
                'Live Q&A',
                'Cursor CLI',
                'Custom Hooks',
                'MCP Integration (Chrome MCP)',
              ]}
              analyticsLabel="Claude Code Workshop"
            />
          </Suspense>
        </section>

        {/* Latest Courses Section */}
        <div className="max-w-screen-xl mx-auto w-full p-5 mb-8">
          <LatestCoursesFeed />
        </div>

        {/* All Content Feed Section */}
        <div className="max-w-screen-xl mx-auto w-full">
          <div className="flex sm:items-end items-center justify-between px-5 py-4">
            <h2 className="lg:text-2xl sm:text-xl text-lg dark:text-white font-semibold leading-tight">
              The Feed
            </h2>
          </div>
          <Suspense fallback={<CompactFeedSkeleton />}>
            <CompactFeed />
          </Suspense>
        </div>

        <Footer />
      </div>
    </Providers>
  )
}
