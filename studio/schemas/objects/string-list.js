import {MdLightbulbOutline as icon} from 'react-icons/md'

export default {
  name: 'string-list',
  title: 'Big Idea',
  type: 'object',
  icon,
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required().max(120),
      options: {
        maxLength: 120,
      },
    },
    {
      name: 'description',
      title: 'Description',
      type: 'markdown',
    },
    {
      name: 'items',
      title: 'Items',
      description: 'A list of features (bullet points)',
      type: 'array',
      of: [{type: 'string'}],
    },
  ],
}
