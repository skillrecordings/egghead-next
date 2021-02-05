import {MdLibraryBooks as icon} from 'react-icons/md'

export default {
  name: 'npmDependency',
  title: 'npm Dependency',
  type: 'document',
  icon,
  fields: [
    {
      name: 'name',
      title: 'Name',
      type: 'string',
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        maxLength: 100,
        source: 'name',
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
    {
      name: 'path',
      description: 'Path on egghead.io (if applicable)',
      title: 'egghead.io/ Path',
      type: 'string',
    },
    {
      title: 'Link to npm',
      name: 'url',
      type: 'url',
    },
    {
      name: 'imageUrl',
      description: 'An associated image URL. Probably a logo.',
      title: 'Image URL',
      type: 'url',
    },
  ],
}
