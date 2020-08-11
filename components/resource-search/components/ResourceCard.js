import React from 'react'
import get from 'lodash/get'
import Markdown from 'react-markdown'
import isEmpty from 'lodash/isEmpty'
import {Menu, MenuList, MenuButton} from '@reach/menu-button'
import '@reach/menu-button/styles.css'

import colorValues from 'lib/colorValues'

import iconDotsVertical from 'assets/images/icon-dots-vertical.svg'
import iconAvatarPlaceholder from 'assets/images/icon-avatar-placeholder.svg'

function ResourceCard({resource, children}) {
  const image =
    get(resource, 'image', get(resource, 'illustrationUrl')) ||
    get(resource, 'smallIconUrl')
  const instructorAvatar = get(
    resource,
    'instructor_avatar_url',
    get(resource, 'instructorAvatar256Url'),
  )
  const tagImage = get(
    resource,
    'primary_tag_image_url',
    get(resource, 'tagImage'),
  )
  const instructorName = get(
    resource,
    'instructor_name',
    get(resource, 'instructorName'),
  )
  const type = get(resource, 'type', get(resource, 'contentType'))
  const tagLabel = get(resource, 'primary_tag.label', get(resource, 'tag'))
  return (
    <div key={resource.id} className="flex flex-grow-1">
      {image && (
        <img
          src={image}
          role="presentation"
          alt={`Illustration for ${resource.title}`}
          className="db flex-shrink-0 mr3"
          css={{
            width: '60px',
            height: '60px',
          }}
        />
      )}
      <div className="flex-grow-1">
        <div className="flex items-center mt1">
          <h2
            className="lh-title fw6 black ma0 flex-grow-1"
            css={{fontSize: '22px'}}
          >
            <a href={resource.url} className="black link">
              {resource.title}
            </a>
          </h2>
          {type && <div className="flex-shrink-0 mh3 black-80 ttc">{type}</div>}
        </div>
        <div className="flex items-center mt2 pt1">
          <div className="flex items-center">
            {instructorAvatar && (
              <img
                src={instructorAvatar || iconAvatarPlaceholder}
                alt=""
                className="mr2 db br-100"
                css={{width: '24px', height: '24px'}}
              />
            )}
            {instructorName && (
              <a href={resource.instructor_url} className="link ttc black-80">
                {instructorName}
              </a>
            )}
          </div>
          <div className="flex items-center ml4">
            {tagImage && (
              <img
                src={tagImage}
                alt=""
                className="mr2 db"
                css={{width: '20px', height: '20px'}}
              />
            )}
            {tagLabel && (
              <a
                href={get(resource, 'primary_tag.url', get(resource, 'tagUrl'))}
                className="link ttc black-80"
              >
                {tagLabel}
              </a>
            )}
          </div>
        </div>
        <div
          className="black-80 lh-copy mt2 pt1"
          css={{
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            p: {
              margin: 0,
            },
          }}
        >
          <Markdown>{resource.description || resource.summary}</Markdown>
        </div>
      </div>
      {!isEmpty(children) && (
        <div className="flex-shrink-0 ml3">
          <Menu>
            <MenuButton className="w2 h2 db pointer bg-gray br2 bn flex justify-center items-center">
              <img src={iconDotsVertical} alt="" />
            </MenuButton>
            <MenuList
              className="mt2"
              css={{
                borderRadius: '5px',
                padding: 0,
                borderColor: '#dae4ea',
                color: colorValues['black-80'],
                fontSize: '1rem',
              }}
            >
              {children}
            </MenuList>
          </Menu>
        </div>
      )}
    </div>
  )
}

export default ResourceCard
