import {GetServerSideProps} from 'next'
import {getInstructorFeed} from '@/lib/instructor-feed'

export const getServerSideProps: GetServerSideProps = async (context) => {
  if (context && context.res) {
    const {res} = context

    const instructorSlug = context.params?.slug as string

    const feed = await getInstructorFeed(instructorSlug)

    if (!feed) {
      return {
        notFound: true,
      }
    }

    res.setHeader('Cache-Control', 's-maxage=1, stale-while-revalidate')
    res.setHeader('content-type', 'application/json')
    res.write(feed.json1())
    res.end()
  }

  return {
    props: {},
  }
}

const RssPage = () => null

export default RssPage
