'use client'
import * as React from 'react'
import {
  MDXRemote,
  MDXRemoteSerializeResult,
  type MDXRemoteProps,
} from 'next-mdx-remote'
import mdxComponents from './mdx-components'
let CH: any
try {
  CH = require('@code-hike/mdx/components').CH
} catch (e) {
  CH = () => null
}

const defaultComponents = {
  CH,
  ...mdxComponents,
}

/**
 * Renders compiled source from @skillrecordings/skill-lesson/markdown/serialize-mdx
 * with syntax highlighting and code-hike components.
 * @param {MDXRemoteSerializeResult} contents
 * @returns <MDXRemote components={components} {...contents} />
 */

const MDX: React.FC<{
  contents: MDXRemoteSerializeResult
  components?: MDXRemoteProps['components']
}> = ({contents, components}) => {
  return (
    <MDXRemote
      components={{...defaultComponents, ...components}}
      {...contents}
    />
  )
}

export default MDX
