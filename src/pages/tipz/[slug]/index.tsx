import React from 'react'
import {GetStaticPaths, GetStaticProps, NextPage} from 'next'
import {getAllTips, getTip, Tip} from 'lib/tips'
import serializeMDX from 'markdown/serialize-mdx'
import {MDXRemoteSerializeResult} from 'next-mdx-remote'

export const getStaticProps: GetStaticProps = async ({params}) => {
  try {
    const tip = await getTip(params?.tip as string)
    const tipBodySerialized =
      tip.body &&
      (await serializeMDX(tip.body, {
        syntaxHighlighterOptions: {
          theme: 'material-theme-palenight',
          showCopyButton: true,
        },
      }))
    const tips = await getAllTips()

    return {
      props: {
        tip,
        tipBodySerialized,
        tips,
        ...(tip.transcript && {transcript: tip.transcript}),
        videoResourceId: tip.videoResourceId,
      },
      revalidate: 10,
    }
  } catch (error) {
    console.error(error)
    return {
      notFound: true,
    }
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  const tips = await getAllTips()
  const paths = tips.map((tip) => ({
    params: {slug: tip.slug},
  }))
  return {paths, fallback: 'blocking'}
}

export type TipPageProps = {
  tip: Tip
  tipBodySerialized: MDXRemoteSerializeResult
  tips: Tip[]
  transcript: any[]
  videoResourceId: string
}

const TipPage: NextPage<TipPageProps> = ({
  tip,
  tipBodySerialized,
  tips,
  transcript,
  videoResourceId,
}) => {
  return <div>{tip.title}</div>
}

export default TipPage
