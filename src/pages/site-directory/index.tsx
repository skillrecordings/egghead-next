import Link from 'next/link'

const Index = (props: any) => {
  const tagSlugs: string[] = props.tagSlugs

  return (
    <>
      {tagSlugs.map((path) => {
        return (
          <Link href={`/site-directory/${path}`} key={path}>
            <a>{path}</a>
          </Link>
        )
      })}
    </>
  )
}

export async function getStaticProps(context: any) {
  const tags: any = await import('./tags.json').then((data) => data.default)
  const tagSlugs = tags.map(({slug}: {slug: string}) => slug).sort()

  return {
    props: {tagSlugs},
  }
}

export default Index
