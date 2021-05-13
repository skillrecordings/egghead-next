import * as React from 'react'
import {GetServerSideProps} from 'next'
import {bundleMDX} from 'mdx-bundler'
import {getMDXComponent} from 'mdx-bundler/client'
import {sanityClient} from 'utils/sanity-client'
import groq from 'groq'
import Image from 'next/image'
import path from 'path'

const OnlinePresenceArticle: React.FC<any> = ({code, title}) => {
  const Component = React.useMemo(() => getMDXComponent(code), [code])

  return (
    <article className="mx-auto max-w-screen-md lg:mt-14 md:mt-8 mt-3">
      <header>
        <h1 className="max-w-screen-md lg:text-6xl md:text-5xl sm:text-4xl text-3xl w-full font-extrabold mb-8 lg:mb-10 leading-tighter">
          {title}
        </h1>
      </header>
      <main className="prose dark:prose-dark sm:prose-lg lg:prose-xl mt-5 max-w-none">
        <Component />
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
    if (process.platform === 'win32') {
      process.env.ESBUILD_BINARY_PATH = path.join(
        process.cwd(),
        'node_modules',
        'esbuild',
        'esbuild.exe',
      )
    } else {
      process.env.ESBUILD_BINARY_PATH = path.join(
        process.cwd(),
        'node_modules',
        'esbuild',
        'bin',
        'esbuild',
      )
    }

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

      const result = await bundleMDX(resource.article, {
        xdmOptions(options) {
          options.remarkPlugins = [...(options.remarkPlugins ?? [])]
          return options
        },
        esbuildOptions(options) {
          options.minify = false
          options.target = [
            'es2020',
            'chrome58',
            'firefox57',
            'safari11',
            'edge16',
            'node12',
          ]

          return options
        },
      })

      const {code} = result

      res.setHeader('Cache-Control', 's-maxage=1, stale-while-revalidate')
      return {
        props: {code, title: resource.title},
      }
    } catch (e) {
      console.error(e.message)
      res.statusCode = 404
      res.end()
      return {props: {}}
    }
  }

  res.statusCode = 404
  res.end()
  return {props: {}}
}
