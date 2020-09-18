import React, {FunctionComponent} from 'react'
import {isEmpty, get} from 'lodash'
import Markdown from 'react-markdown'
import Eggo from '../../../components/images/eggo.svg'

type MetadataProps = {
  title: string
  instructor: {
    full_name: string
    http_url: string
    avatar_64_url: string
  }
  tags: [
    {
      name: string
      http_url: string
      image_url: string
    },
  ]
  summary: string
  [cssRelated: string]: any
}

const Metadata: FunctionComponent<MetadataProps> = ({
  title,
  instructor,
  tags,
  summary,
  ...restProps
}: MetadataProps) => {
  return (
    <div {...restProps}>
      {title && <h3 className="mt-0 text-2xl">{title}</h3>}
      <div className="flex items-center mt-4">
        <a href={get(instructor, 'http_url', '#')} className="mr-4">
          {get(instructor, 'avatar_64_url') ? (
            <img
              src={instructor.avatar_64_url}
              alt=""
              className="w-8 rounded-full m-0"
            />
          ) : (
            <Eggo className="w-8 rounded-full" />
          )}
        </a>
        {get(instructor, 'full_name') && (
          <a href={get(instructor, 'http_url', '#')}>{instructor.full_name}</a>
        )}
        {!isEmpty(tags) && (
          <div className="flex ml-6">
            {tags.map((tag, index) => (
              <a
                href={tag.http_url}
                key={index}
                className="flex items-center ml-4 first:ml-0"
              >
                <img
                  src={tag.image_url}
                  alt=""
                  className="w-5 h-5 flex-shrink-0"
                />
                <span className="ml-2">{tag.name}</span>
              </a>
            ))}
          </div>
        )}
      </div>
      {summary && <Markdown className="mt-4">{summary}</Markdown>}
    </div>
  )
}

export default Metadata
