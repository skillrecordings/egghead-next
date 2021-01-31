export default {
  name: 'staffReview',
  description: 'How fresh is this resource really?',
  title: 'Freshness',
  type: 'object',
  fields: [
    {
      name: 'status',
      type: 'string',
      title: 'Status',
      options: {
        list: [
          {
            title: 'classic',
            value: 'classic',
          },
          {
            title: 'stale',
            value: 'stale',
          },
          {
            title: 'fresh',
            value: 'fresh',
          },
        ],
      },
    },
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      options: {
        maxLength: 90,
      },
    },
    {
      name: 'summary',
      title: 'summary',
      type: 'markdown',
      options: {
        maxLength: 240,
      },
    },
    {
      name: 'reviewedBy',
      title: 'Reviewed By',
      type: 'person',
    },
    {
      title: 'Staff Review Data',
      name: 'staffReviewDate',
      type: 'date',
      options: {
        dateFormat: 'YYYY-MM-DD',
        calendarTodayLabel: 'Today',
      },
    },
  ],
}
