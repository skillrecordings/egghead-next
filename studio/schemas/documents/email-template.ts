import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'emailTemplate',
  type: 'document',
  title: 'Email Template',
  fields: [
    defineField({
      name: 'name',
      type: 'string',
      title: 'Template Name',
      description: 'The Template to Use'
    })
  ]
})
