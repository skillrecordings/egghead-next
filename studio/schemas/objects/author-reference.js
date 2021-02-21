export default {
  name: 'authorReference',
  type: 'object',
  title: 'Author reference',
  fields: [
    {
      name: 'author',
      type: 'reference',
      to: [
        {
          type: 'collaborator',
        },
      ],
    },
  ],
  preview: {
    select: {
      title: 'author.name',
      media: 'author.person.image.url',
    },
  },
}
