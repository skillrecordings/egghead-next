import React from 'react'

export default {
  name: 'caseStudy',
  type: 'document',
  title: 'Case Study',
  fields: [
    {
      name: 'title',
      type: 'string',
      title: 'Title',
      description: 'Titles should be catchy, descriptive, and not too long',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'publishedAt',
      type: 'datetime',
      title: 'Published at',
      description: 'This can be used to schedule case study for publishing',
    },
    {
      name: 'description',
      type: 'markdown',
      title: 'Description',
      description:
        'This can be used to provide a short description of the article. Max 150 characters',
      validation: (Rule) => Rule.max(150),
    },
    {
      name: 'body',
      type: 'markdown',
      title: 'Body',
    },
    {
      name: 'slug',
      type: 'slug',
      title: 'Slug',
      validation: (Rule) => Rule.required(),
      description:
        'Some frontends will require a slug to be set to be able to show the case study',
      options: {
        source: 'title',
        maxLength: 96,
      },
    },
    {
      name: 'coverImage',
      type: 'image-url',
      title: 'Cover image',
    },
    {
      name: 'seo',
      type: 'seo',
      title: 'SEO',
    },
    {
      name: 'excerpt',
      type: 'markdown',
      title: 'Excerpt',
      description:
        'This ends up on summary pages, on Google, when people share your case study in social media.',
    },
    {
      name: 'authors',
      title: 'Authors',
      description:
        'Humans that worked on the case study and get credit for the effort.',
      type: 'array',
      of: [
        {
          type: 'authorReference',
        },
      ],
    },
    {
      name: 'featuredInstructors',
      description: 'Instructor(s) featured in the case study.',
      title: 'Featured Instructors',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{type: 'collaborator'}],
        },
      ],
    },
    {
      name: 'resources',
      description:
        'Arbitrary resources, maybe this is a collection? Internal to this resource (not shared at the top level)',
      title: 'Resources',
      type: 'array',
      of: [
        {
          type: 'resource',
          title: 'Resource',
        },
        {
          type: 'reference',
          title: 'Resources Refs',
          to: [{type: 'resource'}],
        },
      ],
    },
    {
      name: 'projects',
      description: 'Related Project Resources',
      title: 'Projects',
      type: 'array',
      of: [
        {type: 'link'},
        {
          type: 'resource',
          title: 'Resource',
        },
        {
          type: 'reference',
          title: 'Resources Refs',
          to: [{type: 'resource'}],
        },
      ],
    },
  ],
  orderings: [
    {
      name: 'publishingDateAsc',
      title: 'Publishing date new–>old',
      by: [
        {
          field: 'publishedAt',
          direction: 'asc',
        },
        {
          field: 'title',
          direction: 'asc',
        },
      ],
    },
    {
      name: 'publishingDateDesc',
      title: 'Publishing date old->new',
      by: [
        {
          field: 'publishedAt',
          direction: 'desc',
        },
        {
          field: 'title',
          direction: 'asc',
        },
      ],
    },
  ],
  preview: {
    select: {
      title: 'title',
      publishedAt: 'publishedAt',
      slug: 'slug',
      image: 'coverImage.url',
    },
    prepare({title = 'No title', publishedAt, slug = {}, image}) {
      const path = `/case-studies/${slug.current}`
      return {
        title,
        subtitle: publishedAt ? path : 'Missing publishing date',
        media: <img src={image} alt={`${title} preview`} />,
      }
    },
  },
}
