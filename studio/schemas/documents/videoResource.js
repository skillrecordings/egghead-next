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
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'hslUrl',
      title: 'HSL URL',
      type: 'url',
    },
  ],
  preview: {
    select: {
      title: 'filename',
    },
  },
}
