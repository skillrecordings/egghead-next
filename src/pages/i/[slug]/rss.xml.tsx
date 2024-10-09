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
    res.setHeader('content-type', 'text/xml')
    res.write(feed.rss2()) // NOTE: You can also use feed.atom1() or feed.json1() for other feed formats
    res.end()
  }

  return {
    props: {},
  }
}

const RssPage = () => null

export default RssPage
