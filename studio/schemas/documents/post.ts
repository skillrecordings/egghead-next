import {defineArrayMember, defineField, defineType} from 'sanity'

export default defineType({
  name: 'post',
  type: 'document',
  title: 'Blog Post',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      title: 'Title',
      description: 'Titles should be catchy, descriptive, and not too long',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'publishedAt',
      type: 'datetime',
      title: 'Published at',
      description: 'This can be used to schedule post for publishing',
    }),
    defineField({
      name: 'description',
      type: 'markdown',
      title: 'Description',
      description:
        'This can be used to provide a short description of the article. Max 150 characters',
      validation: (Rule) => Rule.max(150),
    }),
    defineField({
      name: 'body',
      type: 'markdown',
      title: 'Body',
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      title: 'Slug',
      validation: (Rule) => Rule.required(),
      description:
        'Some frontends will require a slug to be set to be able to show the post',
      options: {
        source: 'title',
        maxLength: 96,
      },
    }),
    defineField({
      name: 'coverImage',
      type: 'image-url',
      title: 'Cover image',
    }),
    defineField({
      name: 'seo',
      type: 'seo',
      title: 'SEO',
    }),
    defineField({
      name: 'excerpt',
      type: 'markdown',
      title: 'Excerpt',
      description:
        'This ends up on summary pages, on Google, when people share your post in social media.',
    }),
    defineField({
      name: 'authors',
      title: 'Authors',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'authorReference',
        }),
      ],
    }),
    defineField({
      name: 'categories',
      type: 'array',
      title: 'Categories',
      of: [
        defineArrayMember({
          type: 'reference',
          to: {
            type: 'category',
          },
        }),
      ],
    }),
    defineField({
      name: 'softwareLibraries',
      description: 'Versioned Software Libraries',
      title: 'NPM or other Dependencies',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'versioned-software-library',
        }),
      ],
    }),
    defineField({
      name: 'essentialQuestions',
      description: 'The important questions.',
      title: 'Essential Questions',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'reference',
          title: 'Essential Question',
          to: [{type: 'essentialQuestion'}],
        }),
      ],
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
          to: [{type: 'resource'}],
        }),
      ],
    }),
    defineField({
      name: 'projects',
      description: 'Related Project Resources',
      title: 'Projects',
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
      media: 'mainImage',
    },
    prepare({title = 'No title', publishedAt, slug = {}, media}) {
      const path = `/blog/${slug.current}`
      return {
        title,
        media,
        subtitle: publishedAt ? path : 'Missing publishing date',
      }
    },
  },
})
