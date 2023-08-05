import * as React from 'react'
import {useRouter} from 'next/router'
import Search from 'components/pages/home/search'
import Jumbotron from 'components/pages/home/jumbotron'
import SanitySections from 'components/pages/home/sanity-sections'
import toast, {Toaster} from 'react-hot-toast'
import {trpc} from 'trpc/trpc.client'
import {SanitySectionType, CuratedHomePageDataType} from 'pages/learn'

const Home: React.FC<React.PropsWithChildren<any>> = ({
  data,
  jumbotron,
  location,
}: {
  data: CuratedHomePageDataType
  jumbotron: SanitySectionType
  location: string
}) => {
  const router = useRouter()
  const {data: completeCourseData} = trpc.progress.completedCourses.useQuery()
  const completedCoursesIds = completeCourseData?.map(
    (course: any): number => course.collection.id,
  )

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
      <div className="md:container">
        <Jumbotron data={jumbotron} />
      </div>
      <div className="container">
        <main className="pt-8 sm:pt-16">
          <SanitySections
            sections={data.sections}
            location={location}
            completedCoursesIds={completedCoursesIds}
          />
          <Search />
        </main>
      </div>
    </>
  )
}

export default Home
