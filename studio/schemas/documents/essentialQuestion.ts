import {MdQuestionAnswer as icon} from 'react-icons/md'
import {defineArrayMember, defineField, defineType} from 'sanity'

export default defineType({
  name: 'essentialQuestion',
  title: 'Essential Question',
  type: 'document',
  icon,
  preview: {
    select: {title: 'question'},
  },
  fields: [
    defineField({
      name: 'question',
      title: 'Question',
      type: 'text',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'markdown',
    }),
    defineField({
      name: 'bigIdeas',
      title: 'Big Ideas',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'reference',
          to: [{type: 'bigIdea'}],
        }),
      ],
    }),
  ],
})
