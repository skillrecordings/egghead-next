/* eslint-disable import/no-anonymous-default-export */
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
      name: 'muxAsset',
      title: 'Mux Asset',
      type: 'muxAsset',
    },
    {
      name: 'transcriptBody',
      title: 'Transcript Body',
      type: 'text',
    },
    {
      name: 'transcriptUrl',
      title: 'Transcript URL',
      type: 'url',
    },
    {
      name: 'subtitlesUrl',
      title: 'Subtitles URL',
      type: 'url',
    },
    {
      name: 'duration',
      title: 'Duration',
      description: 'Duration in seconds',
      type: 'number',
    },
  ],
  preview: {
    select: {
      title: 'filename',
    },
  },
}
