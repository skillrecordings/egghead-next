import {MdKitchen as icon} from 'react-icons/md'

export default {
  name: 'resource',
  title: 'Resource',
  type: 'document',
  icon,
  fields: [
    {
      name: 'type',
      description: 'Resources have types that we can use to distinguish them.',
      title: 'Type',
      type: 'string',
      options: {
        list: [
          {
            title: 'course',
            value: 'course',
          },
          {
            title: 'collection',
            value: 'collection',
          },
          {
            title: 'project',
            value: 'project',
          },
          {
            title: 'podcast',
            value: 'podcast',
          },
          {
            title: 'article',
            value: 'article',
          },
        ],
      },
    },
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      options: {
        maxLength: 90,
      },
    },
    {
      name: 'url',
      description: 'Full url of this resources (if applicable).',
      title: 'URL',
      type: 'url',
    },
    {
      name: 'path',
      description: 'Path on egghead.io (if applicable)',
      title: 'Path',
      type: 'string',
    },
    {
      name: 'meta',
      description: 'A byline or bit of descriptive text.',
      title: 'meta',
      type: 'string',
    },
    {
      name: 'description',
      description: 'Full description, no limits',
      title: 'description',
      type: 'markdown',
    },
    {
      name: 'summary',
      description: 'Short description, like for a tweet',
      title: 'summary',
      type: 'markdown',
      options: {
        maxLength: 180,
      },
    },
    {
      name: 'slug',
      description: 'Can generate from title, not used as ID',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 100,
      },
    },
    {
      name: 'externalId',
      description: 'Numeric ID in egghead.io database.',
      title: 'External ID',
      type: 'number',
    },
    {
      name: 'externalPreviewImageUrl',
      description: 'An associated image URL. Maybe on Cloudinary?',
      title: 'External Preview Image',
      type: 'url',
    },
    {
      name: 'previewImage',
      description: 'Upload an image here.',
      title: 'Preview Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    },
    {
      name: 'externalNotesUrl',
      description: 'Notes, maybe a repository or gist.',
      title: 'External Notes',
      type: 'url',
    },
    {
      name: 'freshness',
      description: 'How fresh is this resource really?',
      title: 'Freshness',
      type: 'object',
      fields: [
        {
          name: 'status',
          type: 'string',
          title: 'Status',
          options: {
            list: [
              {
                title: 'classic',
                value: 'classic',
              },
              {
                title: 'stale',
                value: 'stale',
              },
              {
                title: 'fresh',
                value: 'fresh',
              },
            ],
          },
        },
        {
          name: 'title',
          title: 'Title',
          type: 'string',
          options: {
            maxLength: 90,
          },
        },
        {
          name: 'summary',
          title: 'summary',
          type: 'markdown',
          options: {
            maxLength: 240,
          },
        },
        {
          title: 'Staff Review Data',
          name: 'staffReviewDate',
          type: 'date',
          options: {
            dateFormat: 'YYYY-MM-DD',
            calendarTodayLabel: 'Today',
          },
        },
      ],
    },
    {
      name: 'bullets',
      title: 'Bullets',
      description: 'Topics, value, etc. A list.',
      type: 'array',
      of: [{type: 'string'}],
    },
    {
      name: 'projects',
      description: 'Related External Projects, maybe on Github',
      title: 'Projects',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'url',
              title: 'URL',
              type: 'url',
            },
            {
              name: 'title',
              title: 'Title',
              type: 'string',
              options: {
                maxLength: 90,
              },
            },
            {
              name: 'description',
              title: 'Description',
              type: 'markdown',
              options: {
                maxLength: 180,
              },
            },
          ],
        },
      ],
    },
    {
      name: 'npmDependencies',
      description: 'Versioned Dependencies from npm',
      title: 'NPM Dependencies',
      type: 'array',
      of: [{type: 'npmDependency'}],
    },
    {
      name: 'related',
      description: 'Stuff that pairs well with this resource. Watch next?',
      title: 'Related Resources',
      type: 'array',
      of: [{type: 'resource'}],
    },
    {
      name: 'prerequisites',
      description: 'Resources that would be good to watch first.',
      title: 'Prerequisite Resources',
      type: 'array',
      of: [{type: 'resource'}],
    },
    {
      name: 'resources',
      description: 'Arbitrary resources, maybe this is a collection?',
      title: 'resources',
      type: 'array',
      of: [{type: 'resource'}],
    },
    {
      name: 'collaborators',
      description:
        'Humans that worked on this resource and get credit for the effort.',
      title: 'Collaborators',
      type: 'array',
      of: [{type: 'collaborator'}],
    },
  ],
}
