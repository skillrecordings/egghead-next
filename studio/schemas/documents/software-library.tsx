import {MdLibraryBooks as icon} from 'react-icons/md'
import * as React from 'react'
import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'software-library',
  title: 'software library (dependency)',
  type: 'document',
  icon,
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        maxLength: 100,
        source: 'name',
      },
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'markdown',
    }),
    defineField({
      name: 'path',
      description: 'Path on egghead.io (if applicable)',
      title: 'egghead.io/ Path',
      type: 'string',
    }),
    defineField({
      title: 'Link to library',
      name: 'url',
      type: 'url',
    }),
    defineField({
      name: 'image',
      description: 'An associated image URL. Probably a logo.',
      title: 'Image URL',
      type: 'image-url',
    }),
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
})
