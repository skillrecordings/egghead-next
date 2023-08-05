import * as React from 'react'
import {FunctionComponent} from 'react'
import {GetServerSideProps} from 'next'
import {loadTag} from 'lib/tags'
import Markdown from 'react-markdown'

type TagProps = {
  tag: any
}

const Tag: FunctionComponent<React.PropsWithChildren<TagProps>> = ({tag}) => {
  return (
    <div>
      <img alt="" src={tag.image_480_url} />
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
  res.setHeader('Cache-Control', 's-maxage=1, stale-while-revalidate')

  const tag = params && (await loadTag(params.slug as string))
  return {
    props: {
      tag,
    },
  }
}
