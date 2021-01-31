import {MdPages as icon} from 'react-icons/md'

export default {
  name: 'markdownText',
  title: 'Markdown Text',
  type: 'object',
  icon,
  fields: [
    {
      name: 'label',
      title: 'label',
      type: 'string',
      validation: (Rule) => Rule.required(),
      options: {
        maxLength: 45,
      },
    },
    {
      name: 'text',
      title: 'Text',
      type: 'markdown',
    },
    {
      name: 'type',
      title: 'Type',
      type: 'string',
    },
  ],
  preview: {
    select: {
      title: 'label',
    },
  },
}
