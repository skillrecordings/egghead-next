export default {
  name: 'npmVersionedDependency',
  title: 'npm Versioned Dependency',
  type: 'object',
  fields: [
    {
      name: 'version',
      title: 'Version',
      type: 'string',
    },
    {
      name: 'npmDependency',
      title: 'NPM Dependency',
      type: 'reference',
      to: [{type: 'npmDependency'}],
    },
  ],
}
