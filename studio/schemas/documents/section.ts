import {MdLooks as icon} from 'react-icons/md'
import {defineArrayMember, defineField, defineType} from 'sanity'


export default defineType({
  name: 'section',
  type: 'document',
  title: 'Section',
  description: 'A named group of resources within a module.',
  icon,
  preview: {
    select: {
      title: 'title',
    },
    prepare({title}) {
      return {
        title: `${title} (Section)`,
      }
    },
  },
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.max(90),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      validation: (Rule) => Rule.required(),
      options: {
        source: 'title',
        maxLength: 96,
      },
    }),
    defineField({
      name: 'resources',
      title: 'Resources',
      type: 'array',
      description: 'Lessons in the section',
      of: [
        defineArrayMember({
          title: 'Lesson',
          type: 'reference',
          to: [{type: 'lesson'}],
        }),
      ],
    }),
  ],
})
