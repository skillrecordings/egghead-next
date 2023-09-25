import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'emailSendAt',
  type: 'object',
  title: 'Schedule Email Send',
  fields: [
    defineField({
      name: 'sendAtTime',
      type: 'datetime',
      title: 'Send at Time',
      description: 'The Date & Time to Send this Email (default Pacific)'
    }),
    defineField({
      name: 'useRecipientTimezone',
      type: 'boolean',
      title: 'Use Recipient Timezone',
      initialValue: false,
      description: 'Try to send in the recipients timezone',
      validation: (Rule) => Rule.required(),
    })
  ]
})
