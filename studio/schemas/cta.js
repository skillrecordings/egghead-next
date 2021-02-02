export default {
  title: 'Call to action',
  name: 'cta',
  type: 'object',
  fieldsets: [
    {
      title: 'Link',
      name: 'link',
      description: 'Only the first value of these will be used',
    },
  ],
  fields: [
    {
      title: 'Title',
      name: 'title',
      type: 'string',
    },
    {
      title: 'Resource',
      name: 'resource',
      type: 'reference',
      fieldset: 'link',
      to: [{type: 'resource'}],
    },
    {
      title: 'Path',
      name: 'route',
      fieldset: 'link',
      description: 'Example: /blog',
      type: 'string',
    },
    {
      title: 'External link',
      name: 'link',
      type: 'string',
      description: 'Example: https://egghead.io',
      fieldset: 'link',
    },
    {
      title: 'Kind',
      name: 'kind',
      type: 'string',
      options: {
        layout: 'radio',
        list: ['button', 'link'],
      },
    },
  ],
  preview: {
    select: {
      title: 'title',
      landingPage: 'resource.slug.current',
      resource: 'resource',
      link: 'link',
    },
    prepare({title, landingPage, resource, link}) {
      let subtitle = 'Not set'
      if (landingPage) {
        subtitle = `Resource: /${landingPage}`
      }
      if (resource) {
        subtitle = `Resource: ${resource}`
      }
      if (link) {
        subtitle = `External: ${link}`
      }
      return {
        title,
        subtitle,
      }
    },
  },
}
