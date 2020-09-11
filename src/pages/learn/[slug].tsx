import {FunctionComponent} from 'react'
import {GetServerSideProps} from 'next'
import {getTag} from 'lib/tags'
import Markdown from 'react-markdown'

type TagProps = {
  tag: any
}

const Tag: FunctionComponent<TagProps> = ({tag}) => {
  return (
    <div>
      <img src={tag.image_64_url} />
      <div>{tag.label}</div>
      <Markdown className="prose max-w-none">{tag.description}</Markdown>
    </div>
  )
}

export default Tag

export const getServerSideProps: GetServerSideProps = async function ({
  res,
  params,
  req,
}) {
  res.setHeader('Cache-Control', 's-maxage=500, stale-while-revalidate')

  const tag = params && (await getTag(params.slug as string))
  return {
    props: {
      tag,
    },
  }
}
