import {getTags} from '@lib/tags'
import Link from 'next/link'

export default function Tags({tags}) {
  return (
    <div className="grid grid-cols-8 gap-4">
      {tags.map((tag) => {
        return (
          <div key={tag.slug}>
            <img src={tag.image_64_url} />
            <Link href={`/learn/[slug]`} as={`/learn/${tag.slug}`}>
              <a className="no-underline hover:underline text-blue-500">
                {tag.label}
              </a>
            </Link>
          </div>
        )
      })}
    </div>
  )
}

export function getStaticProps() {
  const tags = getTags()
  return {
    props: {
      tags,
    },
  }
}
