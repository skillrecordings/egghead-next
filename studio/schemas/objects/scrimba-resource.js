export default {
  name: 'scrimbaResource',
  type: 'object',
  title: 'Scrimba Resource',
  fields: [
    {
      title: 'Scrimba URL',
      name: 'url',
      type: 'url',
    },
    {
      name: 'transcript',
      title: 'Transcript',
      type: 'text',
      rows: 10,
    },
  ],
}
