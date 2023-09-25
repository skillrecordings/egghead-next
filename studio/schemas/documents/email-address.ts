import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'emailAddress',
  type: 'document',
  title: 'Email Address',
  fields: [
    defineField({
      name: 'name',
      type: 'string',
      title: 'Name',
      description: 'The display name'
    }),
    defineField({
      name: 'email',
      type: 'string',
      title: 'Email',
      description: 'The email address',
      validation: (Rule) => Rule.required(),
    })
  ]
})
