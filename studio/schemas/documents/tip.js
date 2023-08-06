/* eslint-disable import/no-anonymous-default-export */
export default {
  name: 'tip',
  type: 'document',
  title: 'Tip',
  fields: [
    {
      name: 'title',
      type: 'string',
      title: 'Title',
      description: 'Titles should be catchy, descriptive, and not too long',
      validation: (Rule) =>
        Rule.custom((field, context) =>
          context.document.status &&
          context.document.status === 'published' &&
          (field === undefined || field.length < 1)
            ? 'Must have a title to publish'
            : true,
        ),
    },
    {
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
    },
    {
      title: 'Status',
      name: 'state',
      type: 'string',
      validation: (Rule) => Rule.required(),
      initialValue: 'new',
      options: {
        list: [
          {title: 'new', value: 'new'},
          {title: 'processing', value: 'processing'},
          {title: 'reviewing', value: 'reviewing'},
          {title: 'published', value: 'published'},
          {title: 'retired', value: 'retired'},
        ],
      },
    },
    {
      name: 'resources',
      description:
        'Attach a resource to this lesson (Video, Audio, Text, etc.)',
      title: 'Resources',
      type: 'array',
      of: [
        {
          title: 'Video Resource',
          type: 'reference',
          to: [{type: 'videoResource'}],
        },
      ],
    },
    {
      name: 'body',
      type: 'markdown',
      title: 'Body',
      description: 'Full markdown text version of Tip',
    },
    {
      name: 'description',
      type: 'text',
      title: 'Description',
      description:
        'This can be used to provide a short description of the lesson. SEO, etc',
    },
    {
      name: 'summary',
      type: 'markdown',
      title: 'Summary',
    },
    {
      name: 'repoUrl',
      type: 'url',
      title: 'Github Repository Url',
      description:
        "A link to the Github repository where the lesson's code is hosted",
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
      title: 'Status',
      name: 'status',
      type: 'string',
      options: {
        list: [
          {title: 'Needs Review', value: 'needs-review'},
          {title: 'Approved', value: 'approved'},
          {title: 'Published', value: 'published'},
          {title: 'Archived', value: 'archived'},
        ],
      },
    },
    {
      title: 'Access Level',
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
      name: 'thumbnailUrl',
      title: 'Thumbnail URL',
      type: 'url',
    },
    {
      name: 'iconUrl',
      title: 'Icon URL',
      type: 'url',
    },
    {
      name: 'codeUrl',
      title: 'Code URL',
      type: 'url',
    },
    {
      name: 'displayedUpdatedAt',
      description: 'The last time this lesson was meaningfully updated',
      title: 'Displayed Updated At',
      type: 'date',
    },
    {
      name: 'publishedAt',
      description: 'The date this lesson was published',
      title: 'Published At',
      type: 'date',
    },
    {
      name: 'eggheadRailsCreatedAt',
      title: 'egghead Rails Created At',
      description: 'Date this lesson resource was created on egghead.io',
      type: 'datetime',
      readOnly: true,
    },
    {
      title: 'The lessons internal ID on egghead-rails',
      name: 'eggheadRailsLessonId',
      type: 'number',
      readOnly: true,
    },
  ],
}
