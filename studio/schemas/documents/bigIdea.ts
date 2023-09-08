import {MdLightbulbOutline as icon} from 'react-icons/md'
import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'bigIdea',
  title: 'Big Idea',
  type: 'document',
  icon,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required().max(120),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'markdown',
    }),
    defineField({
      name: 'essentialQuestions',
      title: 'Essential Questions',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{type: 'essentialQuestion'}],
        },
      ],
    }),
  ],
})
