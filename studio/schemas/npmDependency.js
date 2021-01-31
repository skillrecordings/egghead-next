import {MdLibraryBooks as icon} from 'react-icons/md'

export default {
  name: 'npmDependency',
  title: 'npm Dependency',
  type: 'object',
  icon,
  fields: [
    {
      title: 'Version Range',
      name: 'versions',
      type: 'string',
    },
    {
      name: 'name',
      title: 'Name',
      type: 'string',
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
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        maxLength: 100,
      },
    },
    {
      title: 'Link to npm',
      name: 'url',
      type: 'url',
    },
  ],
}
