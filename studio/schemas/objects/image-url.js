import {MdPages as icon} from 'react-icons/md'
import React from 'react'

export default {
  name: 'image-url',
  title: 'Image URL',
  type: 'object',
  icon,
  fields: [
    {
      name: 'label',
      title: 'Label',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'url',
      title: 'URL',
      type: 'url',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'alt',
      title: 'Alt',
      type: 'text',
    },
    {
      name: 'description',
      title: 'Description',
      type: 'markdown',
    },
  ],
  preview: {
    select: {
      title: 'label',
      imageUrl: 'url',
      alt: 'alt',
    },
    prepare(selection) {
      const {title, alt, imageUrl} = selection

      return {
        title: title,
        media: <img src={imageUrl} alt={`${alt}`} />,
      }
    },
  },
}
