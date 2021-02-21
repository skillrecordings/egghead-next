import {MdPages as icon} from 'react-icons/md'

export default {
  name: 'seo',
  title: 'SEO (Open Graph)',
  type: 'object',
  icon,
  fieldsets: [
    {
      name: 'openGraph',
      title: 'Open Graph',
    },
    {
      name: 'twitter',
      title: 'Twitter',
    },
  ],
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      options: {
        maxLength: 60,
      },
    },
    {
      name: 'titleTemplate',
      title: 'Title Template',
      type: 'string',
      options: {
        maxLength: 60,
      },
    },
    {
      name: 'description',
      title: 'Description',
      type: 'string',
      options: {
        maxLength: 155,
      },
    },
    {
      name: 'canonical',
      title: 'Canonical URL',
      type: 'string',
    },
    {
      name: 'ogTitle',
      title: 'Title',
      fieldset: 'openGraph',
      type: 'string',
      options: {
        maxLength: 55,
      },
    },
    {
      name: 'ogDescription',
      title: 'Description',
      fieldset: 'openGraph',
      type: 'string',
      options: {
        maxLength: 55,
      },
    },
    {
      name: 'ogImage',
      title: 'OG:Image',
      fieldset: 'openGraph',
      type: 'url',
    },
    {
      name: 'handle',
      title: 'Handle',
      fieldset: 'twitter',
      type: 'string',
    },
    {
      name: 'site',
      title: 'Site',
      fieldset: 'twitter',
      type: 'string',
    },
    {
      name: 'cardType',
      title: 'Card Type',
      fieldset: 'twitter',
      type: 'string',
      options: {
        list: [
          {
            title: 'summary',
            value: 'summary',
          },
          {
            title: 'summary large image',
            value: 'summary_large_image',
          },
        ],
      },
    },
  ],
  preview: {
    select: {
      title: 'label',
    },
  },
}
