import {defineArrayMember, defineField, defineType} from 'sanity'

export default defineType({
  name: 'podcastSeason',
  title: 'Podcast Season',
  description: 'Podcast Seasons on egghead',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      description:
        'Remember that if your title is too long, it may be truncated in various podcatchers-',
    }),
    defineField({
      name: 'byline',
      description: 'Subheading to the season',
      title: 'Byline',
      type: 'string',
    }),
    defineField({
      name: 'slug',
      title: 'Podcast slug',
      type: 'slug',
      description: 'For when you need to refer to your podcast in a url.',
      options: {
        source: 'title',
        slugify: (input) =>
          input.toLowerCase().replace(/\s+/g, '-').slice(0, 200),
      },
    }),
    defineField({
      name: 'summary',
      description: 'Short description, like for a tweet',
      title: 'Summary',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.max(240),
    }),
    defineField({
      name: 'description',
      description: 'Full description, no limits',
      title: 'Description',
      type: 'markdown',
    }),
    defineField({
      name: 'imageUrl',
      description: 'Image URL for the cover art for this season',
      title: 'Image URL',
      type: 'url',
    }),
    defineField({
      name: 'updatedAt',
      description: 'The last time this resource was meaningfully updated',
      title: 'Updated At',
      type: 'date',
    }),
    defineField({
      name: 'podcastEpisodes',
      description: 'The episodes that comprise this season',
      title: 'Episodes',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'reference',
          to: [{type: 'podcastEpisode'}],
        }),
      ],
    }),
    defineField({
      name: 'collaborators',
      description:
        'Humans that worked on this season and get credit for the effort.',
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
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'byline',
      description: 'description',
      media: 'imageUrl',
    },
  },
})
