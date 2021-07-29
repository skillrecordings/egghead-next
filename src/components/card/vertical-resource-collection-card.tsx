import * as React from 'react'
import {
  Card,
  CardPreview,
  CardHeader,
  CardContent,
  CardBody,
  CardMeta,
} from './index'
import Image from 'next/image'
import Link from 'next/link'
import Markdown from '../markdown'
import {track} from 'utils/analytics'
import {get} from 'lodash'
import {CardResource} from 'types'
import Textfit from 'react-textfit'

const VerticalResourceCollectionCard: React.FC<{
  resource: CardResource
  location?: string
  describe?: boolean
  className?: string
}> = ({resource, location, className = '', ...props}) => {
  className = `${className} border-none flex flex-col sm:py-8 py-6`

  return (
    <Card {...props} className={className}>
      {resource.image && (
        <Link href={resource.path}>
          <a
            onClick={() => {
              track('clicked resource', {
                resource: resource.path,
                linkType: 'image',
                location,
              })
            }}
            className="block flex-shrink-0 sm:w-auto m:w-24 w-36"
            tabIndex={-1}
          >
            <CardPreview>
              <Image
                src={get(resource.image, 'src', resource.image)}
                width={220}
                height={220}
                layout="fixed"
                className="object-cover rounded-md"
                alt={`illustration for ${resource.title}`}
              />
            </CardPreview>
          </a>
        </Link>
      )}
      <CardContent>
        <CardHeader>
          <h2 className="uppercase font-semibold text-xs mb-1 text-gray-700 dark:text-gray-300">
            {resource.name}
          </h2>
          {resource.path ? (
            <Link href={resource.path}>
              <a
                onClick={() => {
                  track('clicked resource', {
                    resource: resource.path,
                    linkType: 'text',
                    location,
                  })
                }}
                className="hover:text-blue-600 dark:hover:text-blue-300"
              >
                <h3 className="text-xl font-bold leading-tighter">
                  {resource.title}
                </h3>
              </a>
            </Link>
          ) : (
            <h3 className="text-xl font-bold leading-tighter">
              {resource.title}
            </h3>
          )}
        </CardHeader>
        <CardMeta className="text-xs text-gray-600 dark:text-gray-300 mb-2 mt-1">
          {resource.byline}
        </CardMeta>
        {resource.description && (
          <CardBody className="prose dark:prose-dark dark:prose-dark-sm prose-sm max-w-none">
            <Markdown>{resource.description}</Markdown>
          </CardBody>
        )}
        {resource.resources &&
          resource.resources.map((resource) => {
            const getImageSize = (image: string) => {
              return image.includes('tags') ? 32 : 50
            }
            const className = `flex items-center py-2`
            return (
              <Card {...props} className={className} quiet>
                {resource.image && (
                  <Link href={resource.path}>
                    <a
                      onClick={() => {
                        track('clicked resource', {
                          resource: resource.path,
                          linkType: 'image',
                          location,
                        })
                      }}
                      className="sm:w-12 w-12 flex-shrink-0 flex justify-center items-center"
                      tabIndex={-1}
                    >
                      <CardPreview>
                        <Image
                          src={get(resource.image, 'src', resource.image)}
                          width={getImageSize(
                            get(resource.image, 'src', resource.image),
                          )}
                          height={getImageSize(
                            get(resource.image, 'src', resource.image),
                          )}
                          alt={`illustration for ${resource.title}`}
                        />
                      </CardPreview>
                    </a>
                  </Link>
                )}
                <CardContent
                  className={`${resource.image ? 'ml-3' : ''} flex flex-col`}
                >
                  <CardHeader>
                    <Link href={resource.path}>
                      <a
                        onClick={() => {
                          track('clicked resource', {
                            resource: resource.path,
                            linkType: 'text',
                            location,
                          })
                        }}
                        className="hover:text-blue-600 dark:hover:text-blue-300"
                      >
                        <h4 className="text-lg font-semibold leading-tight">
                          <Textfit mode="multi" min={14} max={17}>
                            {resource.title}
                          </Textfit>
                        </h4>
                      </a>
                    </Link>
                  </CardHeader>
                  <CardMeta className="text-xs text-gray-600 dark:text-gray-300">
                    {resource.byline}
                  </CardMeta>
                </CardContent>
              </Card>
            )
          })}
      </CardContent>
    </Card>
  )
}

export {VerticalResourceCollectionCard}
