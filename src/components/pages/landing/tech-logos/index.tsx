import * as React from 'react'
import Image from 'next/legacy/image'
import Link from 'next/link'
import {useTheme} from 'next-themes'
import {useViewer} from '@/context/viewer-context'
import {track} from '@/utils/analytics'
import axios from '@/utils/configured-axios'
import cookies from '@/utils/cookies'

// Dark theme SVG imports
import darkA11y from './dark/a11y.svg'
import darkAngular from './dark/angular.svg'
import darkAws from './dark/aws.svg'
import darkCss from './dark/css.svg'
import darkGatsby from './dark/gatsby.svg'
import darkGraphql from './dark/graphql.svg'
import darkHtml from './dark/html.svg'
import darkJavascript from './dark/javascript.svg'
import darkNext from './dark/next.svg'
import darkReact from './dark/react.svg'
import darkRedux from './dark/redux.svg'
import darkTypescript from './dark/typescript.svg'
import darkVue from './dark/vue.svg'

// Light theme SVG imports
import lightA11y from './light/a11y.svg'
import lightAngular from './light/angular.svg'
import lightAws from './light/aws.svg'
import lightCss from './light/css.svg'
import lightGatsby from './light/gatsby.svg'
import lightGraphql from './light/graphql.svg'
import lightHtml from './light/html.svg'
import lightJavascript from './light/javascript.svg'
import lightNext from './light/next.svg'
import lightReact from './light/react.svg'
import lightRedux from './light/redux.svg'
import lightTypescript from './light/typescript.svg'
import lightVue from './light/vue.svg'

// SVG mapping objects
const darkLogos = {
  a11y: darkA11y,
  angular: darkAngular,
  aws: darkAws,
  css: darkCss,
  gatsby: darkGatsby,
  graphql: darkGraphql,
  html: darkHtml,
  javascript: darkJavascript,
  next: darkNext,
  react: darkReact,
  redux: darkRedux,
  typescript: darkTypescript,
  vue: darkVue,
}

const lightLogos = {
  a11y: lightA11y,
  angular: lightAngular,
  aws: lightAws,
  css: lightCss,
  gatsby: lightGatsby,
  graphql: lightGraphql,
  html: lightHtml,
  javascript: lightJavascript,
  next: lightNext,
  react: lightReact,
  redux: lightRedux,
  typescript: lightTypescript,
  vue: lightVue,
}

const useCustomer = () => {
  const [customer, setCustomer] = React.useState()

  React.useEffect(() => {
    setCustomer(cookies.get('customer'))
  }, [])

  return customer
}

const TechLogos = () => {
  const {viewer} = useViewer()
  const customer = useCustomer()
  const {resolvedTheme} = useTheme()
  const logos = [
    'react',
    'next',
    'gatsby',
    'vue',
    'redux',
    'javascript',
    'typescript',
    'angular',
    'a11y',
    'graphql',
    'html',
    'css',
    'aws',
  ]

  return (
    <div className="flex flex-wrap items-center justify-center md:max-w-none sm:max-w-lg max-w-[450px]">
      {logos.map((tech) => {
        return viewer || customer ? (
          <Link
            key={tech}
            href={`/q?q=${tech}`}
            className="px-2 py-1 scale-75 lg:px-4 md:px-2 sm:scale-90"
            onClick={() => {
              track('clicked topic', {
                topic: tech,
                location: 'signup page',
              })
              axios.post(`/api/topic`, {
                topic: tech,
                amount: 1,
              })
            }}
          >
            <Image
              src={
                resolvedTheme === 'dark'
                  ? darkLogos[tech as keyof typeof darkLogos]
                  : lightLogos[tech as keyof typeof lightLogos]
              }
              alt={tech}
            />
          </Link>
        ) : (
          <Link
            key={tech}
            href={`/q?q=${tech}`}
            className="px-2 py-1 scale-75 lg:px-4 md:px-2 sm:scale-90"
            onClick={() => {
              track('clicked topic', {
                topic: tech,
                location: 'signup page',
              })
            }}
          >
            <Image
              src={
                resolvedTheme === 'dark'
                  ? darkLogos[tech as keyof typeof darkLogos]
                  : lightLogos[tech as keyof typeof lightLogos]
              }
              alt={tech}
            />
          </Link>
        )
      })}
    </div>
  )
}

export default TechLogos
