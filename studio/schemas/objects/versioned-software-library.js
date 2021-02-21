import React from 'react'

export default {
  name: 'versioned-software-library',
  title: 'Versioned Software Library (Dependency)',
  type: 'object',
  fields: [
    {
      name: 'version',
      title: 'Version',
      type: 'string',
    },
    {
      name: 'library',
      title: 'Software Library (Dependency)',
      type: 'reference',
      to: [{type: 'software-library'}],
    },
  ],
  preview: {
    select: {
      version: 'version',
      name: 'library.name',
      media: 'library.image.url',
    },
    prepare(selection) {
      const {version, name, media} = selection
      return {
        title: version ? `${name} v${version}` : name,
        media: <img src={media} alt={`${name}`} />,
      }
    },
  },
}
