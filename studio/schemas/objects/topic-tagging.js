import React from 'react'

export default {
  name: 'topic-tagging',
  title: 'Topic Tagging',
  type: 'object',
  fields: [
    {
      name: 'version',
      title: 'Version (if applicable)',
      type: 'string',
    },
    {
      name: 'topic',
      title: 'Topic (Libraries/Frameworks/Languages/Etc.)',
      type: 'reference',
      to: [{type: 'topic'}],
    },
  ],
  preview: {
    select: {
      version: 'version',
      name: 'topic.name',
      media: 'topic.image.url',
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
