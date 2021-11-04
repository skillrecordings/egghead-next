import * as React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {useTheme} from 'next-themes'
import {useViewer} from 'context/viewer-context'

const TechLogos = () => {
  const {viewer} = useViewer()
  const {resolvedTheme} = useTheme()
  const logos = [
    'react',
    'next',
    'gatsby',
    'vue',
    'redux',
    'js',
    'ts',
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
        return viewer ? (
          <Link key={tech} href={`/q/${tech}`}>
            <a className="px-2 py-1 scale-75 lg:px-4 md:px-2 sm:scale-90">
              <Image
                src={require(`./${
                  resolvedTheme === 'dark' ? 'dark' : 'light'
                }/${tech}.svg`)}
                alt={tech}
              />
            </a>
          </Link>
        ) : (
          <div
            key={tech}
            className="px-2 py-1 scale-75 lg:px-4 md:px-2 sm:scale-90"
          >
            <Image
              src={require(`./${
                resolvedTheme === 'dark' ? 'dark' : 'light'
              }/${tech}.svg`)}
              alt={tech}
            />
          </div>
        )
      })}
    </div>
  )
}

export default TechLogos
