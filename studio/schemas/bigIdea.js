import {MdLightbulbOutline as icon} from 'react-icons/md'

export default {
  name: 'bigIdea',
  title: 'Big Idea',
  type: 'document',
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
      name: 'essentialQuestions',
      title: 'Essential Questions',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{type: 'essentialQuestion'}],
        },
      ],
    },
  ],
}
