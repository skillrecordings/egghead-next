import {MdLooks as icon} from 'react-icons/md'
import React from 'react'

export default {
  name: 'section',
  type: 'document',
  title: 'Section',
  description: 'A named group of resources within a module.',
  icon,
  preview: {
    select: {
      title: 'title',
    },
    prepare({title}) {
      return {
        title: `${title} (Section)`,
      }
    },
  },
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.max(90),
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      validation: (Rule) => Rule.required(),
      options: {
        source: 'title',
        maxLength: 96,
      },
    },
    {
      name: 'resources',
      title: 'Resources',
      type: 'array',
      description: 'Lessons in the section',
      of: [
        {
          title: 'Lesson',
          type: 'reference',
          to: [{type: 'lesson'}],
        },
      ],
    },
  ],
}
