import {defineArrayMember, defineField, defineType} from 'sanity'
import {JoystickIcon} from '@sanity/icons'


export default defineType({
  name: 'lesson',
  type: 'document',
  title: 'Lesson',
  icon: JoystickIcon,
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      title: 'Title',
      description: 'Titles should be catchy, descriptive, and not too long',
      readOnly: true,
      validation: (Rule) =>
        Rule.custom((field, context) =>
          context?.document?.status &&
          context?.document?.status === 'published' &&
          (field === undefined || field.length < 1)
            ? 'Must have a title to publish'
            : true,
        ),
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      title: 'Slug',
      readOnly: true,
      validation: (Rule) => Rule.required(),
      description:
        'Some frontends will require a slug to be set to be able to show the post',
      options: {
        source: 'title',
        maxLength: 96,
      },
    }),
    defineField({
      title: 'Rails Lesson ID',
      description: 'Rails lesson id',
      readOnly: true,
      name: 'railsLessonId',
      type: 'number',
    }),
    defineField({
      name: 'resources',
      description:
        'Attach a resource to this lesson (Video, Audio, Text, etc.)',
      title: 'Resources',
      type: 'array',
      of: [
        defineArrayMember({
          title: 'Video Resource',
          type: 'reference',
          to: [{type: 'videoResource'}],
        }),
        defineArrayMember({
          title: 'Scrimba Resource',
          type: 'scrimbaResource',
        }),
      ],
    }),
    defineField({
      name: 'description',
      type: 'markdown',
      title: 'Description',
      description:
        'This can be used to provide a short description of the lesson.',
    }),
    defineField({
      name: 'repoUrl',
      type: 'url',
      title: 'Github Repository Url',
      description:
        "A link to the Github repository where the lesson's code is hosted",
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
      title: 'Status',
      name: 'status',
      type: 'string',
      readOnly: true,
      options: {
        list: [
          {title: 'Needs Review', value: 'needs-review'},
          {title: 'Approved', value: 'approved'},
          {title: 'Published', value: 'published'},
          {title: 'Archived', value: 'archived'},
        ],
      },
    }),
    defineField({
      title: 'Access Level',
      name: 'accessLevel',
      type: 'string',
      readOnly: true,
      options: {
        list: [
          {title: 'Free', value: 'free'},
          {title: 'Pro', value: 'pro'},
        ],
        layout: 'radio',
      },
    }),
    defineField({
      name: 'thumbnailUrl',
      title: 'Thumbnail URL',
      type: 'url',
    }),
    defineField({
      name: 'iconUrl',
      title: 'Icon URL',
      type: 'url',
    }),
    defineField({
      name: 'codeUrl',
      title: 'Code URL',
      type: 'url',
    }),
    defineField({
      name: 'displayedUpdatedAt',
      description: 'The last time this lesson was meaningfully updated',
      title: 'Displayed Updated At',
      type: 'date',
    }),
    defineField({
      name: 'publishedAt',
      description: 'The date this lesson was published',
      title: 'Published At',
      type: 'date',
    }),
    defineField({
      name: 'eggheadRailsCreatedAt',
      title: 'egghead Rails Created At',
      description: 'Date this lesson resource was created on egghead.io',
      type: 'datetime',
    }),
    defineField({
      title: 'The lessons internal ID on egghead-rails',
      name: 'eggheadRailsLessonId',
      type: 'number',
      hidden: true,
    }),
  ],
})
