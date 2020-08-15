import NextApp from 'next/app'
import {CacheProvider} from '@emotion/core'
import Button from '@components/Button'
import ContainerLayout from '@components/ContainerLayout'
import Course from '@components/mdx/course'
import {MDXProvider} from '@mdx-js/react'
import {ViewerProvider} from '@context/viewer-context'
import Link from 'next/link'
// Use only { cache } from 'emotion'. Don't use { css }.
import {cache} from 'emotion'

import '../styles/index.css'
import AppLayout from '@components/app/Layout'

const shortCodes = {Button, ContainerLayout, Link, Course}

export default class App extends NextApp {
  render() {
    const {Component, pageProps} = this.props
    return (
      <ViewerProvider>
        <MDXProvider components={shortCodes}>
          <CacheProvider value={cache}>
            <AppLayout>
              <Component {...pageProps} />
            </AppLayout>
          </CacheProvider>
        </MDXProvider>
      </ViewerProvider>
    )
  }
}
