import {getTag} from '@lib/tags'
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

export async function getServerSideProps({res, params, req}) {
  res.setHeader('Cache-Control', 's-maxage=500, stale-while-revalidate')

  const tag = await getTag(params.slug)
  return {
    props: {
      tag,
    },
  }
}
