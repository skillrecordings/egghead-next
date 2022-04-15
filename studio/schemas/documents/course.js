export default {
  name: 'course',
  type: 'document',
  title: 'Course',
  fields: [
    {
      name: 'title',
      type: 'string',
      title: 'Title',
      description: 'Titles should be catchy, descriptive, and not too long',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'slug',
      type: 'slug',
      title: 'Slug',
      validation: (Rule) => Rule.required(),
      description: 'unique slug for the course, this will go in the URL',
      options: {
        source: 'title',
        maxLength: 96,
      },
    },
    {
      name: 'description',
      type: 'markdown',
      title: 'Description',
      description: 'A full description of the course.',
    },
    {
      name: 'publishedAt',
      description: 'The date this course was published',
      title: 'Published At',
      type: 'date',
    },
    {
      name: 'updatedAt',
      description: 'The last time this resource was meaningfully updated',
      title: 'Updated At',
      type: 'date',
    },
    {
      name: 'image',
      description: 'Links to a full-sized primary image',
      title: 'Image Url',
      type: 'url',
    },
    {
      name: 'softwareLibraries',
      description: 'Versioned Software Libraries',
      title: 'NPM or other Dependencies',
      type: 'array',
      of: [
        {
          type: 'versioned-software-library',
        },
      ],
    },
    {
      name: 'collaborators',
      description:
        'Humans that worked on this resource and get credit for the effort.',
      title: 'Collaborators',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{type: 'collaborator'}],
        },
      ],
    },
    {
      name: 'imageIllustrator',
      description: 'Human that illustrated the course cover image',
      title: 'Image Illustrator',
      type: 'reference',
      to: [{type: 'collaborator'}],
    },
    {
      name: 'lessons',
      description: 'the individual lessons that make up this course',
      title: 'Lessons',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{type: 'lesson'}],
        },
      ],
    },
    {
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
    },
    {
      title: 'Duration (minutes)',
      description: 'How many minutes does the course take to complete?',
      name: 'durationInMinutes',
      type: 'number',
    },
  ],
}
