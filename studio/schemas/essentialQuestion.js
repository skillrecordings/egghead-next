import {MdQuestionAnswer as icon} from 'react-icons/md'

export default {
  name: 'essentialQuestion',
  title: 'Essential Question',
  type: 'document',
  icon,
  preview: {
    select: {title: 'question'},
  },
  fields: [
    {
      name: 'question',
      title: 'Question',
      type: 'text',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'description',
      title: 'Description',
      type: 'markdown',
    },
    {
      name: 'bigIdeas',
      title: 'Big Ideas',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{type: 'bigIdea'}],
        },
      ],
    },
  ],
}
