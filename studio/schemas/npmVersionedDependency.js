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
  preview: {
    select: {
      version: 'version',
      name: 'npmDependency.name',
    },
    prepare(selection) {
      const {version, name} = selection
      return {
        title: `${name} v${version}`,
      }
    },
  },
}
