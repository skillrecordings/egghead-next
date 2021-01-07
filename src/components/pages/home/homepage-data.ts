const homepageData = [
  {
    id: 'video',
    name: 'Human-Centered Skills',
    title:
      'What If The Real 10X Developer Is The Friends We Made Along The Way?\n',
    description:
      'We will break down the very real risks of idolizing individual contributors, dig into the nugget of truth that keeps this stereotype alive, and dive into what a real “10× developer” might look like.',
    instructor: 'Jason Lengstorf',
    instructor_path: '/q/resources-by-jason-lengstorf',
    path:
      '/talks/egghead-what-if-the-real-10x-developer-is-the-friends-we-made-along-the-way',
    poster:
      'https://res.cloudinary.com/dg3gyk0gu/image/upload/v1610057506/egghead%20talks/jason-lengstorf-10x-friends-along-the-way.png',
    hls_url:
      'https://d2c5owlt6rorc3.cloudfront.net/egghead-what-if-the-real-10x-developer-is-the-friends-we-made-along-the-way-8m06JP4oB/hls/egghead-what-if-the-real-10x-developer-is-the-friends-we-made-along-the-way-8m06JP4oB.m3u8',

    dash_url:
      'https://d2c5owlt6rorc3.cloudfront.net/egghead-what-if-the-real-10x-developer-is-the-friends-we-made-along-the-way-8m06JP4oB/dash/egghead-what-if-the-real-10x-developer-is-the-friends-we-made-along-the-way-8m06JP4oB.mpd',

    subtitlesUrl:
      'https://egghead.io/api/v1/lessons/egghead-what-if-the-real-10x-developer-is-the-friends-we-made-along-the-way/subtitles',
  },
  {
    id: 'featured',
    title: 'Featured',
    resources: [
      {
        name: 'Hot',
        title:
          'Build a site from scratch with Next.js, TypeScript, Emotion and Netlify',
        byline: 'Tomasz Łakomy',
        image:
          'https://d2eip9sf3oo6c2.cloudfront.net/playlists/square_covers/000/387/163/square_480/netlify-ts.png',
        path:
          'playlists/build-a-blog-with-next-js-typescript-emotion-and-netlify-adcc',
      },
      {
        name: 'In-Depth Article',
        title: 'Codemods with Babel Plugins',
        byline: 'Laurie Barth',
        image:
          'https://res.cloudinary.com/dg3gyk0gu/image/upload/w_1000,ar_1:1,c_fill,g_auto,e_art:hokusai/v1607528141/egghead-next-ebombs/article-illustrations/codemods.png',
        path: '/learn/javascript/codemods-with-babel-plugins',
      },
      {
        name: 'Featured Course',
        title: 'Scale React Development with NX',
        byline: 'Juri Strumpflohner',
        image:
          'https://d2eip9sf3oo6c2.cloudfront.net/playlists/square_covers/000/405/344/full/EGH_ScalingReactNx.png',
        path: '/playlists/scale-react-development-with-nx-4038',
      },
      {
        name: 'Cutting Edge',
        title: 'Introduction to Cloudflare Workers',
        byline: 'Free course by Kristian Freeman',
        image:
          'https://d2eip9sf3oo6c2.cloudfront.net/playlists/square_covers/000/418/892/square_480/EGH_IntroCloudFlareWorkers_Final.png',
        path: '/playlists/introduction-to-cloudflare-workers-5aa3',
      },
    ],
  },
  {
    id: 'freeCourses',
    name: 'Free Courses',
    title: 'Learn Something New',
    description: '',
    resources: [
      {
        title: 'Introduction to State Machines Using XState',
        byline: 'Kyle Shevlin・53m・Course',
        image:
          'https://d2eip9sf3oo6c2.cloudfront.net/series/square_covers/000/000/403/thumb/IntroxState_1000.png',
        path: '/courses/introduction-to-state-machines-using-xstate',
      },
      {
        title: 'Immutable JavaScript Data Structures with Immer',
        byline: 'Michel Weststrate・59m・Course',
        image:
          'https://d2eip9sf3oo6c2.cloudfront.net/series/square_covers/000/000/312/thumb/ImmuateableImmer_Final.png',
        path: '/courses/immutable-javascript-data-structures-with-immer',
      },
      {
        title: 'Write Your First Program with the Rust Language',
        byline: 'Pascal Precht・20m・Course',
        image:
          'https://d2eip9sf3oo6c2.cloudfront.net/series/square_covers/000/000/448/thumb/EGH_BuildaRustApp_Final.png',

        path: '/courses/write-your-first-program-with-the-rust-language',
      },
      {
        title: 'Develop Accessible Web Apps with React',
        byline: 'Erin Doyle・88m・Course',
        image:
          'https://d2eip9sf3oo6c2.cloudfront.net/series/square_covers/000/000/412/thumb/AccessibleReact_1000.png',

        path: '/courses/develop-accessible-web-apps-with-react',
      },
      {
        title:
          'Scalable Offline-Ready GraphQL Applications with AWS AppSync & React',
        byline: 'nader dabit・64m・Course',
        image:
          'https://d2eip9sf3oo6c2.cloudfront.net/series/square_covers/000/000/211/thumb/EGH_GraphQL-AWs_Final.png',

        path:
          '/courses/scalable-offline-ready-graphql-applications-with-aws-appsync-react',
      },
      {
        title: 'GraphQL Data in React with Apollo Client',
        byline: 'Nik Graf・23m・Course',
        image:
          'https://d2eip9sf3oo6c2.cloudfront.net/series/square_covers/000/000/231/thumb/EGH_Apollo-GraphQL-React_Final.png',

        path: '/courses/graphql-data-in-react-with-apollo-client',
      },
    ],
  },
  {
    id: 'devEssentials',
    name: 'Practice Makes Perfect',
    title: 'Web Development Essentials',
    description: '',
    resources: [
      {
        title: 'Web Security Essentials: MITM, CSRF, and XSS',
        byline: 'Mike Sherov・50m・Course',
        image:
          'https://d2eip9sf3oo6c2.cloudfront.net/series/square_covers/000/000/413/square_280/EGH_WebSecurity.png',
        path: '/courses/web-security-essentials-mitm-csrf-and-xss',
      },
      {
        title: "The Beginner's Guide to React",
        byline: 'Kent C. Dodds・2h 27m・Course',
        image:
          'https://d2eip9sf3oo6c2.cloudfront.net/series/square_covers/000/000/160/full/EGH_BeginnersReact2.png',
        path: '/courses/the-beginner-s-guide-to-react',
      },
      {
        title: 'Fix Common Git Mistakes',
        byline: 'Chris Achard・44m・Course',
        image:
          'https://d2eip9sf3oo6c2.cloudfront.net/series/square_covers/000/000/401/full/GitMistakes_1000.png',
        path: '/courses/fix-common-git-mistakes',
      },
      {
        title: 'GraphQL Query Language',
        byline: 'Eve Porcello・30m・Course',
        image:
          'https://d2eip9sf3oo6c2.cloudfront.net/series/square_covers/000/000/236/full/EGH_GraphQLQuery_Final.png',
        path: '/courses/graphql-query-language',
      },
      {
        title: 'Build an App with the AWS Cloud Development Kit',
        byline: 'Tomasz Łakomy・1h 4m・Course',
        image:
          'https://d2eip9sf3oo6c2.cloudfront.net/series/square_covers/000/000/450/thumb/EGH_AWS-TS.png',

        path: '/courses/build-an-app-with-the-aws-cloud-development-kit',
      },
      {
        title: 'Debug the DOM in Chrome with the Devtools Elements panel',
        byline: 'Mykola Bilokonsky・25m・Course',
        image:
          'https://d2eip9sf3oo6c2.cloudfront.net/series/square_covers/000/000/060/full/EGH_Chrome_Elements.png',
        path: '/courses/using-chrome-developer-tools-elements',
      },
    ],
  },
  {
    id: 'stateManagement',
    name: 'Research Panel',
    title: 'React State Management in 2021',
    path: '/playlists/react-state-management-in-2021-6732',
    description: '',
    resources: [
      {
        title: 'Using Redux in Modern React Apps with Mark Erikson',
        byline: 'Mark Erikson & Joel Hooks・90m・Chat',
        image:
          'https://d2eip9sf3oo6c2.cloudfront.net/tags/images/000/000/386/thumb/redux.png',
        path:
          '/lessons/react-using-redux-in-modern-react-apps-with-mark-erikson?pl=react-state-management-2020-6bec',
      },
      {
        title: 'XState for State Management in React Apps with David Khourshid',
        byline: 'David Khourshid & Joel Hooks・55m・Chat',
        image:
          'https://d2eip9sf3oo6c2.cloudfront.net/tags/images/000/001/282/thumb/xstate.png',
        path:
          '/lessons/react-xstate-for-state-management-in-react-apps-with-david-khourshid?pl=react-state-management-2020-6bec',
      },
      {
        title: 'State Management in React with Chance Strickland',
        byline: 'Chance Strickland & Joel Hooks・46m・Chat',
        image:
          'https://d2eip9sf3oo6c2.cloudfront.net/tags/images/000/000/026/thumb/react.png',
        path:
          '/lessons/react-state-management-in-react-with-chance-strickland?pl=react-state-management-2020-6bec',
      },
      {
        title:
          'Using Recoil to Manage Orthogonal State in React Apps with David McCabe',
        byline: 'David McCabe & Joel Hooks・34m・Chat',
        image:
          'https://d2eip9sf3oo6c2.cloudfront.net/tags/images/000/000/026/thumb/react.png',
        path:
          '/lessons/react-using-recoil-to-manage-orthogonal-state-in-react-apps-with-david-mccabe?pl=react-state-management-2020-6bec',
      },
      {
        title: 'Managing Complex State in React with Jared Palmer',
        byline: 'Jared Palmer & Joel Hooks・1h 28m・Chat',
        image:
          'https://d2eip9sf3oo6c2.cloudfront.net/tags/images/000/000/026/thumb/react.png',
        path:
          '/lessons/react-managing-complex-state-in-react-with-jared-palmer?pl=react-state-management-2020-6bec',
      },
    ],
  },
  {
    id: 'sideProject',
    name: 'Weekend Side Project',
    title: 'Build a Video Chat App with Twilio and Gatsby',
    path: '/courses/build-a-video-chat-app-with-twilio-and-gatsby',
    image:
      'https://d2eip9sf3oo6c2.cloudfront.net/series/square_covers/000/000/395/full/TwilioGatsby_Final.png',
    byline: 'Jason Lengstorf',
    description:
      'In this workshop, Jason Lengstorf will take you from an empty project folder all the way through deployment of a Twilio-powered video chat app built on Gatsby.',
  },
  {
    id: 'portfolioProject',
    name: 'Portfolio Project',
    title: 'Create an eCommerce Store with Next.js and Stripe Checkout',
    path:
      '/projects/create-an-ecommerce-store-with-next-js-and-stripe-checkout',
    image:
      'https://d2eip9sf3oo6c2.cloudfront.net/playlists/square_covers/000/412/781/square_480/ecommerce-stripe-next.png',
    byline: 'Colby Fayok',
    description:
      'Build a modern eCommerce store with the best-in-class tools available to web developers to add to your portfolio.',
  },
  {
    id: 'mdxConf',
    name: 'Future of Markdown',
    title: 'MDX Conf 2020',
    path: '/playlists/mdx-conf-3fc2',
    byline: 'Chris Biscardi',
    image:
      'https://d2eip9sf3oo6c2.cloudfront.net/tags/images/000/001/289/full/mdx.png',
    description:
      'MDX has grown rapidly since the first commit two and a half years ago. Learn how MDX increases developer productivity, improves educational content authoring, and even peek behind the curtains to see how MDX works.',
    resources: [
      {
        title: 'Demystifying MDX',
        byline: 'Cole Bremis',
        path: '/talks/mdx-demystifying-mdx',
      },
      {
        title: 'MDX v2 Syntax',
        byline: 'Laurie Barth',
        path: '/talks/egghead-mdx-v2-syntax',
      },
      {
        title: 'MDX and VueJS/NuxtJS',
        byline: 'Cole Bremis',
        path: '/talks/mdx-mdx-and-vuejs-nuxtjs',
      },
      {
        title: 'Migrating to MDX',
        byline: 'Monica Powell',
        path: '/talks/mdx-migrating-to-mdx',
      },
      {
        title: 'Personal Site Playground with MDX',
        byline: 'Prince Wilson',
        path: '/talks/mdx-personal-site-playgrounds-with-mdx',
      },
      {
        title: 'The X in MDX',
        byline: 'Rodrigo Pombo',
        path: '/talks/mdx-the-x-in-mdx',
      },
      {
        title: 'Digital Gardening with MDX Magic',
        byline: 'Kathleen McMahon',
        path: '/talks/mdx-digital-gardening-with-mdx-magic',
      },
    ],
  },
  {
    id: 'topics',
    name: 'Popular Topics',
    resources: [
      {
        title: 'React',
        path: '/q/react',
        image:
          'https://d2eip9sf3oo6c2.cloudfront.net/tags/images/000/000/026/thumb/react.png',
      },
      {
        title: 'JavaScript',
        path: '/q/javascript',
        image:
          'https://d2eip9sf3oo6c2.cloudfront.net/tags/images/000/000/205/thumb/javascriptlang.png',
      },
      {
        title: 'Angular',
        path: '/q/angular',
        image:
          'https://d2eip9sf3oo6c2.cloudfront.net/tags/images/000/000/300/thumb/angular2.png',
      },
      {
        title: 'Node',
        path: '/q/node',
        image:
          'https://d2eip9sf3oo6c2.cloudfront.net/tags/images/000/000/256/thumb/nodejslogo.png',
      },
      {
        title: 'Gatsby',
        path: '/q/gatsby',
        image:
          'https://d2eip9sf3oo6c2.cloudfront.net/tags/images/000/001/211/thumb/gatsby.png',
      },
      {
        title: 'GraphQL',
        path: '/q/graphql',
        image:
          'https://d2eip9sf3oo6c2.cloudfront.net/tags/images/000/001/034/thumb/graphqllogo.png',
      },
      {
        title: 'AWS',
        path: '/q/aws',
        image:
          'https://d2eip9sf3oo6c2.cloudfront.net/tags/images/000/001/090/thumb/aws.png',
      },
      {
        title: 'RxJS',
        path: '/q/rxjs',
        image:
          'https://d2eip9sf3oo6c2.cloudfront.net/tags/images/000/000/375/thumb/rxlogo.png',
      },
      {
        title: 'Redux',
        path: '/q/redux',
        image:
          'https://d2eip9sf3oo6c2.cloudfront.net/tags/images/000/000/386/thumb/redux.png',
      },
    ],
  },
  {
    id: 'swag',
    name: 'swag',
    title: '',
    path: 'https://store.egghead.io',
    resources: [
      {
        title: 'GraphQL Query Language Poster',
        path: 'https://store.egghead.io/product/poster-graphql-query-language',
        image:
          'https://res.cloudinary.com/dg3gyk0gu/image/upload/v1606472163/next.egghead.io/store/poster-graphql-query-language.png',
      },
      {
        title: 'egghead Crewneck',
        path: 'https://store.egghead.io/product/egghead-crewneck',
        image:
          'https://res.cloudinary.com/dg3gyk0gu/image/upload/v1606474619/next.egghead.io/store/egghead-crewneck.png',
      },
      // {
      //   title: 'Shirt',
      //   path: 'https://store.egghead.io/product/egghead-shirt',
      //   image:
      //     'https://res.cloudinary.com/dg3gyk0gu/image/upload/v1606473230/next.egghead.io/store/egghead-shirt.jpg',
      // },
      // {
      //   title: 'Beanie',
      //   path: 'https://store.egghead.io/product/knit-beanie',
      //   image:
      //     'https://res.cloudinary.com/dg3gyk0gu/image/upload/v1606472232/next.egghead.io/store/knit-beanie.jpg',
      // },
    ],
  },
]

export default homepageData
