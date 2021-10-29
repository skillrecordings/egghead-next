import * as React from 'react'
import Image from 'next/image'
import {useTheme} from 'next-themes'

const TechLogos = () => {
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
        return (
          <div
            key={tech}
            className="lg:px-4 md:px-2 px-2 py-1 sm:scale-90 scale-75"
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
