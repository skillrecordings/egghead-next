import {getTagSlugs, getTag} from '../../lib/tags'
import Markdown from 'react-markdown'

export default function Tag({tag}) {
  return (
    <div>
      <img src={tag.image_64_url} />
      <div>{tag.label}</div>
      <Markdown className="prose">{tag.description}</Markdown>
    </div>
  )
}
export async function getStaticPaths() {
  const paths = getTagSlugs()
  return {
    paths,
    fallback: false,
  }
}

export async function getStaticProps({params}) {
  const tag = getTag(params.slug)
  return {
    props: {
      tag,
    },
  }
}
