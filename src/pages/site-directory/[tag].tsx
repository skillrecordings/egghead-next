import Link from 'next/link'
import {useRouter} from 'next/router'

const createPath = (tags: string[]) => {
  return tags.sort().join('-and-')
}

const Tag = (props: any) => {
  const router = useRouter()
  const tag: string = router.query.tag as string
  const tagSlugs: [string] = props.tagSlugs

  return (
    <>
      <h2>{tag}</h2>
      {tagSlugs
        .filter((slug) => tag != slug)
        .map((slug) => {
          let path = createPath([tag, slug])
          return (
            <div key={path}>
              <hr />
              <Link href={`/s/${path}`}>
                <a>{path}</a>
              </Link>
              <br />

              {tagSlugs
                .filter((third) => tag != slug && tag != third && slug != third)
                .map((third) => {
                  let path = createPath([tag, slug, third])
                  return (
                    <span key={path}>
                      <Link href={`/s/${path}`}>
                        <a>{path}</a>
                      </Link>{' '}
                      |{' '}
                    </span>
                  )
                })}
            </div>
          )
        })}
    </>
  )
}

export async function getStaticProps(context: any) {
  const tags: any = await import('./tags.json').then((data) => data.default)
  const tagSlugs = tags.map(({slug}: {slug: string}) => slug).sort()

  return {
    props: {tagSlugs}, // will be passed to the page component as props
  }
}

export async function getStaticPaths() {
  const tags: any = await import('./tags.json').then((data) => data.default)
  const tagSlugs: [string] = tags.map(({slug}: {slug: string}) => slug).sort()
  const paths = tagSlugs.map((tag) => ({params: {tag}}))
  return {
    paths,
    fallback: false,
  }
}

export default Tag
