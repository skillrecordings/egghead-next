export default {
  name: 'productionProcessState',
  title: 'Production Process State',
  type: 'string',
  initialValue: 'new',
  validation: (Rule) => Rule.required(),
  options: {
    list: [
      {
        title: 'new',
        value: 'new',
      },
      {
        title: 'drafting',
        value: 'drafting',
      },
      {
        title: 'published',
        value: 'published',
      },
      {
        title: 'content review',
        value: 'contentReview',
      },
      {
        title: 'pre release',
        value: 'preRelease',
      },
      {
        title: 'retired',
        value: 'retired',
      },
    ],
  },
}
