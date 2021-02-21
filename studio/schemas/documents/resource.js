import {MdKitchen as icon} from 'react-icons/md'
import React from 'react'
import PathInput from '../components/path-input'

export default {
  name: 'resource',
  title: 'Resource',
  description: 'Almost anything, really.',
  type: 'document',
  icon,
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
  fields: [
    {
      name: 'title',
      description: 'the H1',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required().max(90),
      options: {
        maxLength: 90,
      },
    },
    {
      name: 'name',
      description:
        'Usually internal, but not always. Maybe for a collection or landing page.',
      title: 'Code Name',
      type: 'string',
      validation: (Rule) => Rule.max(90),
      options: {
        maxLength: 90,
      },
    },
    {
      name: 'tags',
      title: 'Tags',
      type: 'tags',
      description: 'an arbitrary set of global tags',
    },
    {
      name: 'type',
      description: 'Resources have types that we can use to distinguish them.',
      title: 'Type',
      type: 'string',
      validation: (Rule) => Rule.required(),
      options: {
        list: [
          {
            title: 'course',
            value: 'course',
          },
          {
            title: 'playlist',
            value: 'playlist',
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
          {
            title: 'landing page',
            value: 'landing-page',
          },
          {
            title: 'feature',
            value: 'feature',
          },
          {
            title: 'video (Lesson)',
            value: 'video',
          },
          {
            title: 'podcast',
            value: 'podcast',
          },
          {
            title: 'talk',
            value: 'talk',
          },
        ],
      },
    },
    {
      name: 'challengeRating',
      description: 'How difficult is this?',
      title: 'Challenge Rating',
      type: 'number',
      validation: (Rule) => Rule.min(0).max(10),
      options: {
        list: [
          {
            title: 'rudimentary',
            value: 1,
          },
          {
            title: 'basic',
            value: 1,
          },
          {
            title: 'novice',
            value: 2,
          },
          {
            title: 'beginner',
            value: 3,
          },
          {
            title: 'advanced beginner',
            value: 4,
          },
          {
            title: 'intermediate',
            value: 5,
          },
          {
            title: 'beyond intermediate',
            value: 6,
          },

          {
            title: 'advanced intermediate',
            value: 7,
          },
          {
            title: 'advanced',
            value: 8,
          },
          {
            title: 'extremely advanced',
            value: 9,
          },
          {
            title: 'expert',
            value: 10,
          },
        ],
      },
    },
    {
      name: 'challengeDescription',
      description: 'Describe the challenge rating tweet-sized.',
      title: 'Challenge Description',
      type: 'markdown',
      rows: 3,
      validation: (Rule) => Rule.max(160),
      options: {
        maxLength: 160,
      },
    },
    {
      name: 'externalId',
      fieldset: 'source',
      description: 'Numeric ID in egghead.io database. not a slug.',
      title: 'egghead ID',
      type: 'number',
    },
    {
      name: 'externalType',
      fieldset: 'source',
      description: 'what type of resource is this in egghead database',
      title: 'External Type',
      type: 'string',
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
      name: 'subTitle',
      description: 'Short punchy bit of text.',
      title: 'Sub-Title',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.max(120),
      options: {
        maxLength: 120,
      },
    },
    {
      name: 'byline',
      description: 'Who is it by?',
      title: 'Byline',
      type: 'string',
      validation: (Rule) => Rule.max(90),
      options: {
        maxLength: 90,
      },
    },
    {
      name: 'meta',
      description: 'A bit of descriptive text.',
      title: 'Meta',
      type: 'string',
      validation: (Rule) => Rule.max(90),
      options: {
        maxLength: 90,
      },
    },
    {
      name: 'description',
      description: 'Full description, no limits',
      title: 'Description',
      type: 'markdown',
    },
    {
      name: 'summary',
      description: 'Short description, like for a tweet',
      title: 'Summary',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.max(180),
      options: {
        maxLength: 180,
      },
    },
    {
      name: 'content',
      description: 'Various forms of content for this resource.',
      title: 'Content',
      type: 'array',
      of: [
        {
          type: 'ctaPlug',
        },
        {
          type: 'link',
        },
        {
          type: 'markdownText',
        },
        {
          type: 'string-list',
        },
      ],
    },
    {
      name: 'url',
      fieldset: 'source',
      description: 'Full url of this resources (if applicable).',
      title: 'External URL',
      type: 'url',
    },
    {
      name: 'path',
      fieldset: 'source',
      description: "Path on egghead.io. Don't forget the /",
      title: 'egghead.io/ Path',
      type: 'string',
      inputComponent: PathInput,
      options: {
        basePath: 'egghead.io',
        formatSlug: false,
      },
    },
    {
      name: 'image',
      description: 'Links to a full-sized primary image',
      title: 'Image Url',
      type: 'url',
    },
    {
      name: 'urls',
      description: 'Links to things.',
      title: 'External URLs',
      type: 'array',
      of: [{type: 'link'}],
    },
    {
      name: 'images',
      description: 'Links to image.',
      title: 'Images (URLs)',
      type: 'array',
      of: [{type: 'image-url'}],
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
      name: 'staffReviews',
      title: 'Freshness Reviews',
      description: 'Staff Reviews',
      type: 'array',
      of: [{type: 'staffReview'}],
    },
    {
      name: 'features',
      title: 'Features',
      description: 'A list of features (bullet points)',
      type: 'array',
      of: [{type: 'string'}],
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
      fieldset: 'relatedContent',
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
    {
      name: 'essentialQuestions',
      description: 'The important questions.',
      title: 'Essential Questions',
      type: 'array',
      of: [
        {
          type: 'reference',
          title: 'Essential Question',
          to: [{type: 'essentialQuestion'}],
        },
      ],
    },
    {
      name: 'related',
      description: 'Stuff that pairs well with this resource. Watch next?',
      title: 'Related Resources',
      fieldset: 'relatedContent',
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
      name: 'prerequisites',
      description: 'Resources that would be good to watch first.',
      title: 'Prerequisite Resources',
      fieldset: 'relatedContent',
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
      name: 'nextSteps',
      description: 'Resources that would be good to watch next.',
      title: 'Next Step Resources',
      type: 'array',
      fieldset: 'relatedContent',
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
  ],
  preview: {
    select: {
      title: 'title',
      name: 'name',
      meta: 'meta',
      media: 'previewImage',
      image: 'image',
      type: 'type',
    },
    prepare(selection) {
      const {title, name, type, media, image} = selection

      console.log(selection)

      return {
        title: name || title,
        subtitle: type,
        media: image ? (
          <img src={image} alt={`${title} movie poster`} />
        ) : (
          media
        ),
      }
    },
  },
}
