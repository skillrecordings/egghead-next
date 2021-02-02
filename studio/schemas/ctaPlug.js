export default {
  type: 'object',
  name: 'ctaPlug',
  title: 'Call to action',
  fields: [
    {
      name: 'label',
      type: 'string',
    },
    {
      name: 'title',
      type: 'string',
      title: 'Title',
    },
    {
      name: 'body',
      type: 'blockContent',
      title: 'Body',
    },
    {
      name: 'ctas',
      type: 'array',
      of: [
        {
          name: 'cta',
          type: 'cta',
        },
      ],
    },
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'label',
    },
    prepare({title, subtitle}) {
      return {
        title: `Call to action: ${title || 'Title not set'}`,
        subtitle,
      }
    },
  },
}
