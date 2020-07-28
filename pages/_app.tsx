import NextApp from 'next/app'
import {CacheProvider} from '@emotion/core'
import {SWRConfig} from 'swr'
import Button from '../components/Button'
import ContainerLayout from '../components/ContainerLayout'
import {MDXProvider} from '@mdx-js/react'

// Use only { cache } from 'emotion'. Don't use { css }.
import {cache} from 'emotion'

import {globalStyles} from '../shared/styles'
import '../styles/index.css'

const shortCodes = {Button, ContainerLayout}

export default class App extends NextApp {
  render() {
    const {Component, pageProps} = this.props
    return (
      <MDXProvider components={shortCodes}>
        <CacheProvider value={cache}>
          {globalStyles}
          <Component {...pageProps} />
        </CacheProvider>
      </MDXProvider>
    )
  }
}
