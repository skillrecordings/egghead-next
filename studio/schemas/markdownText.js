import {MdPages as icon} from 'react-icons/md'

export default {
  name: 'markdownText',
  title: 'Markdown Text',
  type: 'object',
  icon,
  fields: [
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
      title: 'text',
    },
  },
}
