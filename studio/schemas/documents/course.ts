import {nanoid} from 'nanoid'
import {defineField, defineType, defineArrayMember} from 'sanity'

export default defineType({
  name: 'course',
  type: 'document',
  title: 'Course',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      title: 'Title',
      description: 'Titles should be catchy, descriptive, and not too long',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      title: 'Slug',
      validation: (Rule) => Rule.required(),
      description: 'unique slug for the course, this will go in the URL',
      options: {
        source: 'title',
        maxLength: 96,
      },
    }),
    defineField({
      name: 'path',
      description: "Path on egghead.io. Don't forget the /",
      title: 'egghead.io/ Path',
      type: 'string',
    }),
    defineField({
      name: 'sharedId',
      type: 'string',
      title: 'Shared ID',
      validation: (Rule) => Rule.required(),
      initialValue: () => nanoid(),
    }),
    defineField({
      name: 'productionProcessState',
      title: 'Production Process State',
      type: 'productionProcessState',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      type: 'markdown',
      title: 'Description',
      description: 'A full description of the course.',
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
      name: 'byline',
      description:
        'Metadata to display on cards (e.g. "Kent C. Dodds • 2h 29m • Course")',
      title: 'Byline',
      type: 'string',
      validation: (Rule) => Rule.max(90),
    }),
    defineField({
      name: 'publishedAt',
      description: 'The date this course was published',
      title: 'Published At',
      type: 'date',
    }),
    defineField({
      name: 'updatedAt',
      description: 'The last time this resource was meaningfully updated',
      title: 'Updated At',
      type: 'date',
    }),
    defineField({
      name: 'image',
      description: 'Links to a full-sized primary image/illustration',
      title: 'Image/Illustration Url',
      type: 'url',
    }),
    defineField({
      name: 'images',
      description: 'Links to image.',
      title: 'Images (URLs)',
      type: 'array',
      of: [defineArrayMember({type: 'image-url'})],
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
      name: 'collaborators',
      description:
        'Humans that worked on this resource and get credit for the effort.',
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
      name: 'imageIllustrator',
      description: 'Human that illustrated the course cover image',
      title: 'Image Illustrator',
      type: 'reference',
      to: [{type: 'collaborator'}],
    }),
    defineField({
      name: 'resources',
      description:
        'Sections or the individual lessons that make up this course',
      title: 'Resources',
      type: 'array',
      of: [
        defineArrayMember({
          title: 'Sections and Lessons',
          type: 'reference',
          to: [
            {title: 'Section', type: 'section'},
            {title: 'Lesson', type: 'lesson'},
          ],
        }),
      ],
    }),
    defineField({
      title: 'Access Level',
      description:
        'Does this course require Pro access or is it a community resource?',
      name: 'accessLevel',
      type: 'string',
      options: {
        list: [
          {title: 'Free', value: 'free'},
          {title: 'Pro', value: 'pro'},
        ],
        layout: 'radio',
      },
      initialValue: 'pro',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      title: 'Search Indexing State',
      description: 'Is this course ready to be indexed for search?',
      name: 'searchIndexingState',
      type: 'string',
      options: {
        list: [
          {title: 'Hidden', value: 'hidden'},
          {title: 'Indexed', value: 'indexed'},
        ],
        layout: 'radio',
      },
      initialValue: 'hidden',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      title: 'Rails Course ID',
      description: 'Rails course id',
      name: 'railsCourseId',
      type: 'number',
    }),
    defineField({
      title: 'Duration (minutes)',
      description: 'How many minutes does the course take to complete?',
      name: 'durationInMinutes',
      type: 'number',
    }),
    defineField({
      name: 'related',
      description:
        'Any content that pairs well with this course (for now just Courses and Resources, but could be Articles, Podcasts, etc.).',
      title: 'Related Resources',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'reference',
          title: 'Course/Resource Refs',
          to: [{type: 'resource'}, {type: 'course'}],
        }),
      ],
    }),
  ],
})
