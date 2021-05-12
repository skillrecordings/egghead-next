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

const HorizontalResourceCard: React.FC<any> = ({
  resource,
  location,
  className = 'border-none my-4',
  ...props
}) => {
  className = `${className} flex sm:flex-row flex-col sm:space-x-5 space-x-0 sm:space-y-0 space-y-5 items-center sm:text-left text-center`

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
                width={160}
                height={160}
                layout="fixed"
                className="object-cover rounded-md"
                alt={`illustration for ${resource.title}`}
              />
            </CardPreview>
          </a>
        </Link>
      )}
      <CardContent className="flex flex-col justify-center sm:items-start items-center">
        <CardHeader>
          <h2 className=" uppercase font-semibold text-xs tracking-tight text-gray-700 dark:text-gray-300 mb-1">
            {resource.name}
          </h2>
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
        </CardHeader>
        <CardMeta className="text-xs text-gray-600 dark:text-gray-300 mb-2 mt-1">
          {resource.byline}
        </CardMeta>
        <CardBody className="prose dark:prose-dark dark:prose-dark-sm prose-sm max-w-none">
          <Markdown>{resource.description}</Markdown>
        </CardBody>
      </CardContent>
    </Card>
  )
}

export {HorizontalResourceCard}
