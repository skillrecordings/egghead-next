export const cloudflareLesson = {
  slug: 'cloudflare-create-a-cloudflare-workers-account',
  title: 'Create a Cloudflare Workers Account',
  transcript_url:
    'http://egghead.af:5000/api/v1/lessons/cloudflare-create-a-cloudflare-workers-account/transcript',
  transcript:
    "Kristian Freeman: [0:02] To deploy our first serverless function to Cloudflare Workers, we'll need to sign up for a Cloudflare Workers account and pick our workers.dev subdomain. Navigate to workers.cloudflare.com, and click the Sign up button.\n\n[0:13] Here, I'll just put a new email and password. Once I've created my account, I can pick my Cloudflare Workers subdomain. Every user of Cloudflare Workers has their own unique workers.dev sub domain, which means that I can deploy, for instance, mywebsite.signalnerve4360.workers.dev.\n\n[0:41] In this case, I'll just put my name, Kristian. Oh, looks like it's not available, so I'll do khristianfreeman.workers.dev. For instance, I can see, \"A Worker named my worker would be deployed to myworker.kristianfreeman.workers.dev.\"\n\n[0:58] I'll click setup, and then I can choose my worker's plan. Right now, there's two plans. The Free plan is obviously $ and includes 100,000 requests per day as well as access to worker's KV. For now, this is all we need to deploy our first serverless function.\n\n[1:15] Though if you ever find yourself working with a worker that has a ton of requests or needs a lot more features, you can check out Workers Bundle. That's only $5 per month.\n\n[1:24] The last thing to do is to confirm my email. Here, I have my Cloudflare, \"Please verify your email address.\" I'll just click this link. Now, I've verified my account, and I'm in the Workers' Dashboard.",
  subtitles_url:
    'http://egghead.af:5000/api/v1/lessons/cloudflare-create-a-cloudflare-workers-account/subtitles',
  next_up_url:
    'http://egghead.af:5000/api/v1/lessons/cloudflare-create-a-cloudflare-workers-account/next_up',
  description:
    "To deploy a Cloudflare Workers serverless function, you'll need to sign up for a free Cloudflare Workers account, and select your unique workers.dev subdomain to deploy your functions to.",
  dash_url:
    'https://d2c5owlt6rorc3.cloudfront.net/egghead-a-very-important-message-Bj1vvtnxY/dash/egghead-a-very-important-message-Bj1vvtnxY.mpd',
  hls_url:
    'https://d2c5owlt6rorc3.cloudfront.net/egghead-a-very-important-message-Bj1vvtnxY/hls/egghead-a-very-important-message-Bj1vvtnxY.m3u8',
  free_forever: true,
  http_url:
    'http://egghead.af:5000/lessons/cloudflare-create-a-cloudflare-workers-account',
  media_url:
    'http://egghead.af:5000/api/v1/lessons/cloudflare-create-a-cloudflare-workers-account/media',
  lesson_view_url:
    'http://egghead.af:5000/api/v1/lessons/cloudflare-create-a-cloudflare-workers-account/views',
  path: '/lessons/cloudflare-create-a-cloudflare-workers-account',
  icon_url:
    'https://d2eip9sf3oo6c2.cloudfront.net/tags/images/000/001/293/thumb/cloudflare-2000.png',
  download_url:
    'https://ir.stonybrook.edu/xmlui/bitstream/handle/11401/9656/rickroll.mp4?sequence=1',
  collection: {
    title: 'Introduction to Cloudflare Workers',
    slug: 'introduction-to-cloudflare-workers-5aa3',
    type: 'playlist',
    square_cover_480_url:
      'https://d2eip9sf3oo6c2.cloudfront.net/playlists/square_covers/000/418/892/square_480/EGH_IntroCloudFlareWorkers_Final.png',
    path: '/playlists/introduction-to-cloudflare-workers-5aa3',
    lessons: [
      {
        slug: 'cloudflare-create-a-cloudflare-workers-account',
        type: 'lesson',
        path: '/lessons/cloudflare-create-a-cloudflare-workers-account',
        title: 'Create a Cloudflare Workers Account',
      },
      {
        slug:
          'cloudflare-install-and-configure-the-cloudflare-workers-cli-wrangler',
        type: 'lesson',
        path:
          '/lessons/cloudflare-install-and-configure-the-cloudflare-workers-cli-wrangler',
        title: 'Install and Configure the Cloudflare Workers CLI Wrangler',
      },
      {
        slug:
          'cloudflare-generate-new-cloudflare-workers-projects-with-wrangler-s-generate-command',
        type: 'lesson',
        path:
          '/lessons/cloudflare-generate-new-cloudflare-workers-projects-with-wrangler-s-generate-command',
        title:
          "Generate New Cloudflare Workers Projects with Wrangler's generate Command",
      },
      {
        slug:
          'cloudflare-write-your-first-cloudflare-workers-serverless-function',
        type: 'lesson',
        path:
          '/lessons/cloudflare-write-your-first-cloudflare-workers-serverless-function',
        title: 'Write Your First Cloudflare Workers Serverless Function',
      },
      {
        slug: 'cloudflare-preview-and-publish-your-cloudflare-workers-project',
        type: 'lesson',
        path:
          '/lessons/cloudflare-preview-and-publish-your-cloudflare-workers-project',
        title: 'Preview and Publish Your Cloudflare Workers Project',
      },
      {
        slug: 'cloudflare-render-html-pages-with-cloudflare-workers',
        type: 'lesson',
        path: '/lessons/cloudflare-render-html-pages-with-cloudflare-workers',
        title: 'Render HTML Pages with Cloudflare Workers',
      },
      {
        slug:
          'cloudflare-render-cloudflare-region-data-for-a-request-using-request-cf',
        type: 'lesson',
        path:
          '/lessons/cloudflare-render-cloudflare-region-data-for-a-request-using-request-cf',
        title: 'Render Cloudflare Region Data for a Request Using request.cf',
      },
      {
        slug:
          'cloudflare-deploy-to-a-custom-domain-with-cloudflare-wrangler-environments',
        type: 'lesson',
        path:
          '/lessons/cloudflare-deploy-to-a-custom-domain-with-cloudflare-wrangler-environments',
        title:
          'Deploy to a Custom Domain with Cloudflare Wrangler Environments',
      },
    ],
  },
  course: null,
  tags: [
    {
      name: 'cloudflare',
      label: 'Cloudflare',
      http_url: 'http://egghead.af:5000/browse/libraries/cloudflare',
      image_url:
        'https://d2eip9sf3oo6c2.cloudfront.net/tags/images/000/001/293/thumb/cloudflare-2000.png',
    },
  ],
  instructor: {
    full_name: 'Kristian Freeman',
    avatar_64_url:
      'https://d2eip9sf3oo6c2.cloudfront.net/instructors/avatars/000/000/469/square_64/kristian.jpeg',
    slug: 'kristian-freeman',
    twitter: 'signalnerve',
  },
  repo_url: null,
  code_url: null,
}
