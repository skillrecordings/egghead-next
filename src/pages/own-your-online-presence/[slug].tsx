import * as React from 'react'
import {GetServerSideProps} from 'next'
import mdxComponents from 'components/mdx'
import {sanityClient} from 'utils/sanity-client'
import groq from 'groq'
import {serialize} from 'next-mdx-remote/serialize'
import {MDXRemote} from 'next-mdx-remote'
import {withProse} from '../../utils/remark/with-prose'

const OnlinePresenceArticle: React.FC<any> = ({source, title}) => {
  return (
    <article className="mx-auto max-w-screen-md lg:mt-14 md:mt-8 mt-3">
      <header>
        <h1 className="max-w-screen-md lg:text-6xl md:text-5xl sm:text-4xl text-3xl w-full font-extrabold mb-8 lg:mb-10 leading-tighter">
          {title}
        </h1>
      </header>
      <main className="prose dark:prose-dark dark:prose-a:text-blue-300 prose-a:text-blue-500 sm:prose-lg lg:prose-xl mt-5 max-w-none">
        <MDXRemote {...source} components={mdxComponents} />
      </main>
    </article>
  )
}

export default OnlinePresenceArticle

export const getServerSideProps: GetServerSideProps = async function ({
  params,
  res,
}) {
  if (params?.slug) {
    try {
      const articleQuery = groq`
    *[_type == 'resource' && slug.current == 'own-your-online-presence'][0]{
    "resource": resources[slug.current == '${params.slug}'][0]{
      title,
      "article": content[label == "article"][0].text
    }
  }
  `

      const {resource} = await sanityClient.fetch(articleQuery)

      const source = await serialize(resource.article, {
        mdxOptions: {
          remarkPlugins: [
            withProse,
            require(`remark-slug`),
            require(`remark-footnotes`),
            require(`remark-code-titles`),
          ],
        },
      })

      res.setHeader('Cache-Control', 's-maxage=1, stale-while-revalidate')
      return {
        props: {source, title: resource.title},
      }
    } catch (e) {
      console.error(e)
      res.statusCode = 404
      res.end()
      return {props: {}}
    }
  }

  res.statusCode = 404
  res.end()
  return {props: {}}
}
