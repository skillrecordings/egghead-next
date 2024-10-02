import * as React from 'react'
import {useRouter} from 'next/router'
import Search from '@/components/pages/home/search'
import Jumbotron from '@/components/pages/home/jumbotron'
import SanitySections from '@/components/pages/home/sanity-sections'
import toast, {Toaster} from 'react-hot-toast'
import {trpc} from '@/app/_trpc/client'
import {SanitySectionType, CuratedHomePageDataType} from '@/pages/learn'
import TheFeed from './the-feed'
import {InstantSearchSSRProvider} from 'react-instantsearch'

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
  const {data: completedCourseIds} = trpc.progress.completedCourseIds.useQuery()

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
          <SanitySections
            sections={data.sections}
            location={location}
            completedCoursesIds={completedCourseIds}
          />
        </section>
        <InstantSearchSSRProvider {...searchServerState}>
          <TheFeed />
        </InstantSearchSSRProvider>
      </main>
    </>
  )
}

export default Home
