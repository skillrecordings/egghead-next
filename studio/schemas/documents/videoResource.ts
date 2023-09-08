import * as _ from 'lodash'
import {defineArrayMember, defineField, defineType} from 'sanity'


export default defineType({
  name: 'videoResource',
  title: 'Video Resource',
  type: 'document',
  fields: [
    defineField({
      name: 'filename',
      title: 'Filename',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'originalVideoUrl',
      title: 'Original Video URL',
      type: 'url',
      validation: (Rule) =>
        Rule.custom((originalVideoUrl, context) => {
          if (_.isEmpty(originalVideoUrl) && _.isEmpty(context?.document?.hlsUrl)) {
            return 'Either "Original Video URL" or "HLS URL" must be set.'
          }

          return true
        }),
    }),
    defineField({
      name: 'muxAsset',
      title: 'Mux Asset',
      type: 'muxAsset',
    }),
    defineField({
      name: 'transcriptUrl',
      title: 'Transcript URL',
      type: 'url',
    }),
    defineField({
      name: 'transcript',
      type: 'object',
      fields: [
        defineField({name: 'text', type: 'text'}),
        defineField({name: 'srt', type: 'text'}),
      ],
    }),
    defineField({
      name: 'subtitlesUrl',
      title: 'Subtitles URL',
      type: 'url',
    }),
    defineField({
      name: 'duration',
      title: 'Duration',
      description: 'Duration in seconds',
      type: 'number',
    }),
  ],
  preview: {
    select: {
      title: 'filename',
    },
  },
})
