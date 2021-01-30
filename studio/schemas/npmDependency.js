export default {
  name: 'npmDependency',
  title: 'npm Dependency',
  type: 'object',
  fields: [
    {
      title: 'Version',
      name: 'version',
      type: 'text',
    },
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
      },
    },
    {
      title: 'Link to npm',
      name: 'url',
      type: 'url',
    },
  ],
}
