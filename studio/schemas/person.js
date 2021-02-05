import UserIcon from 'part:@sanity/base/user-icon'
import React from 'react'

export default {
  name: 'person',
  title: 'Person',
  type: 'document',
  icon: UserIcon,
  fields: [
    {
      name: 'name',
      title: 'Name',
      type: 'string',
      description: 'Please use "Firstname Lastname" format',
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 100,
      },
    },
    {
      name: 'image',
      title: 'Image URL',
      type: 'image-url',
    },
    {
      name: 'website',
      title: 'Website',
      type: 'url',
    },
    {
      name: 'twitter',
      title: 'Twitter',
      type: 'url',
    },
  ],
  preview: {
    select: {
      title: 'name',
      media: 'image.url',
    },
    prepare(selection) {
      const {title, alt, media} = selection

      return {
        title: title,
        media: <img src={media} alt={`${alt}`} />,
      }
    },
  },
}
