import {MdLibraryBooks as icon} from 'react-icons/md'
import React from 'react'

export default {
  name: 'software-library',
  title: 'software library (dependency)',
  type: 'document',
  icon,
  fields: [
    {
      name: 'name',
      title: 'Name',
      type: 'string',
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        maxLength: 100,
        source: 'name',
      },
    },
    {
      name: 'description',
      title: 'Description',
      type: 'markdown',
      options: {
        maxLength: 180,
      },
    },
    {
      name: 'path',
      description: 'Path on egghead.io (if applicable)',
      title: 'egghead.io/ Path',
      type: 'string',
    },
    {
      title: 'Link to library',
      name: 'url',
      type: 'url',
    },
    {
      name: 'image',
      description: 'An associated image URL. Probably a logo.',
      title: 'Image URL',
      type: 'image-url',
    },
  ],
  preview: {
    select: {
      name: 'name',
      media: 'image.url',
    },
    prepare(selection) {
      const {name, media} = selection
      return {
        title: `${name}`,
        media: <img src={media} alt={`${name}`} />,
      }
    },
  },
}
