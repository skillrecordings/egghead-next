import {MdKitchen as icon} from 'react-icons/md'
import * as React from 'react'
import {defineArrayMember, defineField, defineType} from 'sanity'

export default defineType({
  name: 'guide',
  title: 'Guide',
  type: 'document',
  icon,
  fields: [
    defineField({
      name: 'title',
      description: 'the H1',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required().max(90),
    }),
    defineField({
      name: 'subTitle',
      description: 'Short punchy bit of text.',
      title: 'Sub-Title',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.max(120),
    }),
    defineField({
      name: 'slug',
      description: 'Can generate from title, not used as ID',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 100,
      },
    }),
    defineField({
      name: 'state',
      description: 'Is this a draft, published, etc',
      title: 'State',
      type: 'string',
      options: {
        list: [
          {title: 'Draft', value: 'draft'},
          {title: 'Published', value: 'published'},
          {title: 'Archived', value: 'archived'},
        ],
      },
    }),
    defineField({
      name: 'path',
      fieldset: 'source',
      description: "Path on egghead.io. Don't forget the /",
      title: 'egghead.io/ Path',
      type: 'string',
    }),
    defineField({
      name: 'resources',
      description:
        'Arbitrary resources, maybe this is a collection? Internal to this resource (not shared at the top level)',
      title: 'Resources',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'resource',
          title: 'Resource',
        }),
        defineArrayMember({
          type: 'reference',
          title: 'Resources Refs',
          to: [
            {title: 'Course', type: 'course'},
            {title: 'Resource Ref', type: 'resource'},
          ],
        }),
        defineArrayMember({
          type: 'post',
          title: 'Blog Post',
        }),
      ],
    }),

    defineField({
      name: 'description',
      description: 'Full description, no limits',
      title: 'Description',
      type: 'markdown',
    }),
    defineField({
      name: 'summary',
      description: 'Short description, like for a tweet',
      title: 'Summary',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.max(180),
    }),
    defineField({
      name: 'updatedAt',
      description: 'The last time this resource was meaningfully updated',
      title: 'Updated At',
      type: 'date',
    }),
    defineField({
      name: 'image',
      description: 'Links to a full-sized primary image',
      title: 'Image Url',
      type: 'url',
    }),
    defineField({
      name: 'ogImage',
      title: 'Share Card Url',
      type: 'url',
    }),
    defineField({
      name: 'collaborators',
      description: 'Humans that worked on this resource and get credit for the effort.',
      title: 'Collaborators',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'reference',
          to: [{type: 'collaborator'}],
        }),
      ],
    }),
    defineField({
      name: 'projects',
      description: 'Related Project Resources',
      title: 'Projects',
      fieldset: 'relatedContent',
      type: 'array',
      of: [
        defineArrayMember({type: 'link'}),
        defineArrayMember({
          type: 'resource',
          title: 'Resource',
        }),
        defineArrayMember({
          type: 'reference',
          title: 'Resources Refs',
          to: [{type: 'resource'}],
        }),
      ],
    }),
  ],
  fieldsets: [
    {
      name: 'relatedContent',
      title: 'Related Content',
      description: 'Usually you want to add to resources, but sometimes not.',
      options: {
        collapsible: true,
        collapsed: false,
      },
    },
    {
      name: 'source',
      title: 'Source',
      description: 'describe where this came from',
      options: {
        collapsible: true,
        collapsed: false,
      },
    },
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'subTitle',
      media: 'image',
    },
    prepare(selection: any) {
      const {title, media, subTitle} = selection
      return {
        title,
        subtitle: subTitle || 'guide',
        media: <img src={media} alt="" aria-hidden width={100} height={100} />,
      }
    },
  },
})
