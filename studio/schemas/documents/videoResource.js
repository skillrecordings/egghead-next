import isEmpty from 'lodash/isEmpty'

export default {
  name: 'videoResource',
  title: 'Video Resource',
  type: 'document',
  fields: [
    {
      name: 'filename',
      title: 'Filename',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'originalVideoUrl',
      title: 'Original Video URL',
      type: 'url',
      validation: (Rule) =>
        Rule.custom((originalVideoUrl, context) => {
          if (isEmpty(originalVideoUrl) && isEmpty(context.document.hlsUrl)) {
            return 'Either "Original Video URL" or "HLS URL" must be set.'
          }

          return true
        }),
    },
    {
      name: 'hlsUrl',
      title: 'HLS URL',
      type: 'url',
      validation: (Rule) =>
        Rule.custom((hlsUrl, context) => {
          if (isEmpty(hlsUrl) && isEmpty(context.document.originalVideoUrl)) {
            return 'Either "HLS URL" or "Original Video URL" must be set.'
          }

          return true
        }),
    },
  ],
  preview: {
    select: {
      title: 'filename',
    },
  },
}
