import {UserIcon} from '@sanity/icons'
import * as React from 'react'
import {defineArrayMember, defineField, defineType} from 'sanity'


export default defineType({
  name: 'person',
  title: 'Person',
  type: 'document',
  icon: UserIcon,
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      description: 'Please use "Firstname Lastname" format',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 100,
      },
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
      description: 'Required for creating instructor in accounting system',
      validation: (Rule) =>
        Rule.regex(/.+@.+/, {
          name: 'email', // Error message is "Does not match email-pattern"
          invert: false, // Boolean to allow any value that does NOT match pattern
        }),
    }),
    defineField({
      name: 'image',
      title: 'Image URL',
      type: 'image-url',
    }),
    defineField({
      name: 'website',
      title: 'Website',
      type: 'url',
    }),
    defineField({
      name: 'twitter',
      title: 'Twitter',
      type: 'url',
    }),
  ],
  preview: {
    select: {
      title: 'name',
      media: 'image.url',
    },
    prepare(selection) {
      const {title, media} = selection

      return {
        title: title,
        media: media && (<img src={media} alt={title} />),
      }
    },
  },
})
