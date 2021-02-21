import React from 'react'

export default {
  name: 'authorReference',
  type: 'object',
  title: 'Author reference',
  fields: [
    {
      name: 'author',
      type: 'reference',
      to: [
        {
          type: 'person',
        },
      ],
    },
  ],
  preview: {
    select: {
      title: 'author.name',
      media: 'author.image',
    },
    prepare(selection) {
      const {title, media} = selection
      return {
        title,
        subtitle: `author`,
        media: <img src={media.url} alt={`${title}`} />,
      }
    },
  },
}
