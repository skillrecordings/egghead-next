import {getInstructor, getInstructorSlugs} from '../../lib/instructors'

export default function Instructor({full_name, twitter}) {
  console.log({twitter})
  return (
    <div>
      <h2>{full_name}</h2>
      {twitter && <a href={`https://twitter.com/${twitter}`}>@{twitter}</a>}
    </div>
  )
}

export function getStaticPaths() {
  const paths = getInstructorSlugs()
  return {
    paths,
    fallback: false,
  }
}

const pageProps = ['id', 'slug', 'full_name', 'twitter']

export function getStaticProps({params}) {
  const props = getInstructor(params.slug, pageProps)

  return {
    props,
  }
}
