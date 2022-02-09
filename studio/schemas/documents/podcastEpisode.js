/*
 * Here is an example podcast as stored in egghead-rails:

#<Podcast:0x00007f805f2e74a8
 id: 390,
 title: "Accessible Cross-Browser CSS Form Styling with Stephanie Eckles",
 summary: "Taylor and Stephanie talk about accessibility, the sticking points, and Stephanie's experience with learning about forms. ",
 media_url: "https://cdn.simplecast.com/audio/11504d19-d225-48ff-9ce0-ef8f15d8ec54/episodes/ab9e263c-ef52-48c9-8e6a-c52b087e852a/audio/f73552ba-0c97-44f6-96a4-def07242f391/default_tc.mp3",
 image_url: "https://image.simplecastcdn.com/images/dd208eee-4c40-435d-bea7-b94ef1899216/bea12aca-8642-46db-89d9-fad79d6d8159/avatar-for-stephanie-eckles.jpg",
 related_content: [],
 created_at: Mon, 22 Feb 2021 13:45:28 CST -06:00,
 updated_at: Mon, 22 Feb 2021 13:45:29 CST -06:00,
 slug: "accessible-cross-browser-css-form-styling-with-stephanie-eckles",
 image_file_name: nil,
 image_content_type: nil,
 image_file_size: nil,
 image_updated_at: nil,
 simplecast_uid: "ab9e263c-ef52-48c9-8e6a-c52b087e852a",
 transcript: nil,
 episode_number: 26,
 description: nil,
 published_at: Mon, 22 Feb 2021 13:45:17 CST -06:00,
 duration: 1064,
 visibility_state: "indexed",
 contributors: "Taylor Bell",
 square_cover_file_name: nil,
 square_cover_content_type: nil,
 square_cover_file_size: nil,
 square_cover_updated_at: nil,
 square_cover_processing: nil,
 show_guid: "11504d19-d225-48ff-9ce0-ef8f15d8ec54",
 row_order: 8388607>

 Questions:
 - do we need to represent transcripts in this Sanity data model?
 - do we care about transferring over the `show_guid`?
 - should the `id` be included as a reference back to egghead-rails DB?

*/

export default {
  name: 'podcastEpisode',
  title: 'Podcast Episode',
  description: 'Podcast Episodes on egghead',
  type: 'document',
  fields: [
    {
      name: 'title',
      type: 'string',
      required: true,
      description: 'Title for the individual epsiode',
    },
    {
      name: 'byline',
      description: 'Subheading to the season',
      title: 'Byline',
      type: 'string',
    },
    {
      name: 'slug',
      title: 'episode slug',
      type: 'slug',
      description: 'For when you need to refer to your podcast in a url.',
      options: {
        source: 'title',
        slugify: (input) =>
          input.toLowerCase().replace(/\s+/g, '-').slice(0, 200),
      },
    },
    {
      name: 'summary',
      description: 'Short description, like for a tweet',
      title: 'Summary',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.max(240),
      options: {
        maxLength: 240,
      },
    },
    {
      name: 'description',
      description: 'Full description, no limits',
      title: 'Description',
      type: 'markdown',
    },
    {
      name: 'simplecastUid',
      description: 'UID for episode in simplecast',
      title: 'Simplecast UID',
      type: 'string',
    },
    {
      name: 'mediaUrl',
      description: 'Media URL for the audio for the episode',
      title: 'Media URL',
      type: 'url',
    },
    {
      name: 'imageUrl',
      description: 'Image URL for the cover art for this season',
      title: 'Image URL',
      type: 'url',
    },
    {
      name: 'duration',
      title: 'Duration',
      description: 'HH:MM:SS',
      type: 'string',
    },
    {
      name: 'explicit',
      type: 'boolean',
      description:
        'Do you need to warn parents about the content in this podcast? (You can set this for individual episodes to)',
    },
    {
      name: 'urls',
      description: 'Links to things.',
      title: 'External URLs',
      type: 'array',
      of: [{type: 'link'}],
    },
    {
      name: 'updatedAt',
      description: 'The last time this resource was meaningfully updated',
      title: 'Updated At',
      type: 'date',
    },
    {
      name: 'publishedAt',
      description: 'The date this podcast episode was published',
      title: 'Published At',
      type: 'date',
    },
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'subtitle',
      description: 'description',
      media: 'coverArt',
    },
  },
}
