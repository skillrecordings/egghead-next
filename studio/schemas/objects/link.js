import {MdPages as icon} from 'react-icons/md'

export default {
  name: 'link',
  title: 'URL',
  type: 'object',
  icon,
  fields: [
    {
      name: 'url',
      title: 'URL',
      type: 'url',
    },
    {
      name: 'label',
      title: 'Label',
      type: 'string',
    },
    {
      name: 'type',
      title: 'Type',
      type: 'string',
      options: {
        list: [
          {
            title: 'Open Graph Image',
            value: 'og-image',
          },
          {
            title: 'External Resource',
            value: 'external-resource',
          },
          {
            title: 'Notes',
            value: 'notes',
          },
          {
            title: 'Github',
            value: 'github',
          },
          {
            title: 'Tweet',
            value: 'tweet',
          },
        ],
      },
    },
    {
      name: 'description',
      title: 'Description',
      type: 'markdown',
    },
  ],
  preview: {
    select: {
      title: 'label',
    },
  },
}
