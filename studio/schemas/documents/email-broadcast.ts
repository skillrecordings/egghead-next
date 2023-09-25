import {defineArrayMember, defineField, defineType} from 'sanity'

export default defineType({
  name: 'emailBroadcast',
  type: 'document',
  title: 'Email Broadcast',
  groups: [
    {
      name: 'setup',
      title: 'Setup',
    },
    {
      name: 'email',
      title: 'Email',
    }
  ],
  fields: [
    defineField({
      name: 'name',
      type: 'string',
      title: 'Name',
      description: 'Internal name for this broadcast',
      validation: (Rule) => Rule.required(),
      group: 'setup',
    }),
    defineField({
      title: 'Status',
      name: 'status',
      type: 'string',
      initialValue: 'draft',
      options: {
        list: [
          {title: 'Draft', value: 'draft'},
          {title: 'Scheduled', value: 'scheduled'},
          {title: 'Sending', value: 'sending'},
          {title: 'Sent', value: 'sent'},
          {title: 'Cancelled', value: 'cancelled'}
        ],
      },
    }),
    defineField({
      name: 'template',
      title: 'Template',
      description: 'The Template to Use',
      type: 'reference',
      to: {type: 'emailTemplate'},
      group: 'setup',
    }),
    defineField({
      name: 'sendAt',
      type: 'emailSendAt',
      title: 'Scheduled Send Time',
      description: 'When to send this broadcast',
      group: 'setup',
    }),
    defineField({
      name: 'sendFromEmail',
      title: 'Send From Email',
      description: 'The email address that this broadcast will be sent from',
      type: 'reference',
      to: {type: 'emailAddress'},
      validation: (Rule) => Rule.required(),
      group: 'email',
    }),
    defineField({
      name: 'subject',
      type: 'string',
      title: 'Subject',
      description: 'The Subject line for this broadcast',
      group: 'email',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'preheader',
      type: 'string',
      title: 'Pre-Header Text',
      description: 'Text that appears after the subject line in the inbox',
      group: 'email',
    }),
    defineField({
      name: 'body',
      type: 'markdown',
      title: 'Body',
      group: 'email',
      validation: (Rule) => Rule.required(),
    })
  ]
})
