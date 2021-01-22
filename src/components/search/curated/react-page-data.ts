const reactPageData = [
  {
    id: 'beginner',
    title: 'Beginner',
    name: 'Just starting out with React',
    resources: [
      {
        title: "The Beginner's Guide to React",
        path: '/courses/the-beginner-s-guide-to-react',
        image:
          'https://d2eip9sf3oo6c2.cloudfront.net/series/square_covers/000/000/160/full/EGH_BeginnersReact2.png',
        byline: 'Kent C. Dodds',
      },
      {
        title: 'Develop Accessible Web Apps with React',
        path: '/courses/develop-accessible-web-apps-with-react',
        image:
          'https://d2eip9sf3oo6c2.cloudfront.net/series/square_covers/000/000/412/full/AccessibleReact_1000.png',
        byline: 'Erin Doyle',
      },

      {
        title: 'Build Maps with React Leaflet',
        path: '/courses/build-maps-with-react-leaflet',
        image:
          'https://d2eip9sf3oo6c2.cloudfront.net/series/square_covers/000/000/490/full/React_Leaflet_Final.png',
        byline: 'Colby Fayock',
      },
    ],
  },
  {
    id: 'intermediate',
    title: 'Intermediate',
    name: 'Hitting Your Stride',
    resources: [
      {
        title: 'VR Applications using React 360',
        path: '/courses/vr-applications-using-react-360',
        image:
          'https://d2eip9sf3oo6c2.cloudfront.net/series/square_covers/000/000/272/full/React360-final.png',
        byline: 'Tomasz łakomy',
      },
      {
        title: 'Shareable Custom Hooks in React',
        path: '/courses/shareable-custom-hooks-in-react',
        image:
          'https://d2eip9sf3oo6c2.cloudfront.net/series/square_covers/000/000/313/full/EGH_CustomReactHooks_Final.png',
        byline: 'Joe Previte',
      },
      {
        title: 'Simplify React Apps with React Hooks',
        path: '/courses/simplify-react-apps-with-react-hooks',
        image:
          'https://d2eip9sf3oo6c2.cloudfront.net/series/square_covers/000/000/263/full/EGH_SimplifyHooks_Final.png',
        byline: 'Kent C. Dodds',
      },
    ],
  },
  {
    id: 'advanced',
    title: 'Advanced',
    name: 'Above and Beyond',
    resources: [
      {
        title: 'Redux with React Hooks',
        path: '/playlists/redux-with-react-hooks-8a37',
        image:
          'https://d2eip9sf3oo6c2.cloudfront.net/tags/images/000/000/026/full/react.png',
        byline: 'Jamund Ferguson',
      },
      {
        title: 'Build an App with React Suspense',
        path: '/courses/build-an-app-with-react-suspense',
        image:
          'https://d2eip9sf3oo6c2.cloudfront.net/series/square_covers/000/000/399/full/React_Suspense_Final.png',
        byline: 'Michael Chan',
      },
      {
        title: 'Up and running with Recoil',
        path:
          '/playlists/up-and-running-with-recoil-a-new-state-management-library-for-react-78b8',
        image:
          'https://d2eip9sf3oo6c2.cloudfront.net/tags/images/000/000/026/thumb/react.png',
        byline: 'Tomasz łakomy',
      },
    ],
  },
  {
    id: 'video',
    name: 'State Management',
    title: 'XState for State Management in React Apps',
    description:
      'Joel and David chat about the big ideas of State Management, the difference between a State Machine and Statecharts, and how they overlap with music. David also gives a walkthrough of XState, XState Visualizer, and the upcoming dev tools for XState.',
    instructor: 'David Khourshid & Joel Hooks',
    path:
      '/talks/react-xstate-for-state-management-in-react-apps-with-david-khourshid?pl=react-state-management-2020-6bec',
    poster:
      'https://dcv19h61vib2d.cloudfront.net/thumbs/react-xstate-for-state-management-in-react-apps-with-david-khourshid-R0Tbe57sa/react-xstate-for-state-management-in-react-apps-with-david-khourshid-R0Tbe57sa.jpg',
    hls_url:
      'https://d2c5owlt6rorc3.cloudfront.net/react-xstate-for-state-management-in-react-apps-with-david-khourshid-R0Tbe57sa/hls/react-xstate-for-state-management-in-react-apps-with-david-khourshid-R0Tbe57sa.m3u8',

    dash_url:
      'https://d2c5owlt6rorc3.cloudfront.net/react-xstate-for-state-management-in-react-apps-with-david-khourshid-R0Tbe57sa/dash/react-xstate-for-state-management-in-react-apps-with-david-khourshid-R0Tbe57sa.mpd',

    subtitlesUrl:
      'https://app.egghead.io/api/v1/lessons/react-xstate-for-state-management-in-react-apps-with-david-khourshid/subtitles',
  },
  {
    id: 'featured',
    title: 'Featured',
    resources: [
      {
        name: 'Get Started',
        title: 'Introduction to State Machines Using XState',
        byline: 'Kyle Shevlin・52m・Course',
        image:
          'https://d2eip9sf3oo6c2.cloudfront.net/series/square_covers/000/000/403/full/IntroxState_1000.png',
        path: '/courses/introduction-to-state-machines-using-xstate',
      },
      {
        name: 'Level up your UI',
        title: 'Construct Sturdy UIs with XState',
        byline: 'Isaac Mann・34m・Course',
        image:
          'https://d2eip9sf3oo6c2.cloudfront.net/series/square_covers/000/000/402/full/State_Machine.png',
        path: '/courses/construct-sturdy-uis-with-xstate',
      },
      {
        name: 'Pure React',
        title: 'React Context for State Management',
        byline: 'Dave Ceddia・35m・Course',
        image:
          'https://d2eip9sf3oo6c2.cloudfront.net/series/square_covers/000/000/262/full/EGH_ReactContext_Final.png',
        path: '/courses/react-context-for-state-management',
      },
    ],
  },
  {
    id: 'reactArticles',
    name: 'Written Resources',
    title: 'Mental Models for React',
    path: '/learn/react',
    description:
      "Never written a line of React? We've got a curated guide designed to teach you all the fundamentals skills and mental models you'll need to build in React.",
    resources: [
      {
        title: 'Is React.js a framework or a toolkit?',
        byline: 'Joel Hooks',
        path: '/learn/react/toolkit-or-framework',
      },
      {
        title: 'WTF is React?',
        byline: 'Hiro Nishimura',
        path: '/learn/react/beginners/wtf-is-react',
      },
      {
        title: 'How to React ⚛️',
        byline: 'Kent C. Dodds',
        path: 'https://kentcdodds.com/blog/how-to-react',
      },
      {
        title: 'WTF is JSX?',
        byline: 'Hiro Nishimura',
        path: '/learn/react/beginners/wtf-is-jsx',
      },
      {
        title: 'Migrating to MDX',
        byline: 'Monica Powell',
        path: '/talks/mdx-migrating-to-mdx',
      },
      {
        title: 'Super Simple Start to React',
        byline: 'Kent C. Dodds',
        path: 'https://kentcdodds.com/blog/super-simple-start-to-react',
      },
      {
        title: 'JavaScript Prerequisites before React',
        byline: 'Hiro Nishimura',
        path: '/learn/react/beginners/js-before-react',
      },
    ],
  },
]

export default reactPageData
