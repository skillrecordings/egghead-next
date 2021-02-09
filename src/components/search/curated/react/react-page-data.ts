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
      {
        title: 'Reusable State and Effects with React Hooks',
        path: '/courses/reusable-state-and-effects-with-react-hooks',
        image:
          'https://d2eip9sf3oo6c2.cloudfront.net/series/square_covers/000/000/264/square_480/EGH_ReactHooks_Final_%281%29.png',
        byline: 'Elijah Manor',
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
    id: 'state-management-video',
    name: 'Interview with creator of XState',
    title: 'XState for State Management in React Apps',
    description:
      'Joel and David chat about the big ideas of State Management, the difference between a State Machine and Statecharts, and how they overlap with music. David also gives a walkthrough of XState, XState Visualizer, and the upcoming dev tools for XState.',
    byline: 'David Khourshid & Joel Hooks',
    path:
      '/talks/react-xstate-for-state-management-in-react-apps-with-david-khourshid?pl=react-state-management-2020-6bec',
    poster:
      'https://res.cloudinary.com/dg3gyk0gu/image/upload/v1611317992/next.egghead.io/react/react-xstate-for-state-management-in-react-apps-with-david-khourshid.png',
    hls_url:
      'https://d2c5owlt6rorc3.cloudfront.net/react-xstate-for-state-management-in-react-apps-with-david-khourshid-R0Tbe57sa/hls/react-xstate-for-state-management-in-react-apps-with-david-khourshid-R0Tbe57sa.m3u8',

    dash_url:
      'https://d2c5owlt6rorc3.cloudfront.net/react-xstate-for-state-management-in-react-apps-with-david-khourshid-R0Tbe57sa/dash/react-xstate-for-state-management-in-react-apps-with-david-khourshid-R0Tbe57sa.mpd',

    subtitlesUrl:
      'https://app.egghead.io/api/v1/lessons/react-xstate-for-state-management-in-react-apps-with-david-khourshid/subtitles',
  },
  {
    id: 'state-management-featured',
    title: 'Featured',
    resources: [
      {
        name: 'Learn XState',
        title: 'Introduction to State Machines Using XState',
        byline: 'Kyle Shevlin・52m',
        image:
          'https://d2eip9sf3oo6c2.cloudfront.net/series/square_covers/000/000/403/full/IntroxState_1000.png',
        path: '/courses/introduction-to-state-machines-using-xstate',
      },
      {
        name: 'Level up your UI',
        title: 'Construct Sturdy UIs with XState',
        byline: 'Isaac Mann・34m',
        image:
          'https://d2eip9sf3oo6c2.cloudfront.net/series/square_covers/000/000/402/full/State_Machine.png',
        path: '/courses/construct-sturdy-uis-with-xstate',
      },
      {
        name: 'Pure React',
        title: 'React Context for State Management',
        byline: 'Dave Ceddia・35m',
        image:
          'https://d2eip9sf3oo6c2.cloudfront.net/series/square_covers/000/000/262/full/EGH_ReactContext_Final.png',
        path: '/courses/react-context-for-state-management',
      },
    ],
  },
  {
    id: 'state-management-collection',
    name: 'Research Project',
    title: 'React State Management in 2021',
    description:
      'Series of interviews with experts, open-source maintainers, and UI developers that have combined decades of experience building stateful UI applications for millions of users.',
    path: '/playlists/react-state-management-in-2021-6732',
    resources: [
      {
        title: 'Using Redux in Modern React Apps with Mark Erikson',
        byline: 'Mark Erikson',
        path:
          '/lessons/react-using-redux-in-modern-react-apps-with-mark-erikson',
        image:
          'https://d2eip9sf3oo6c2.cloudfront.net/tags/images/000/000/386/thumb/redux.png',
      },
      {
        title:
          'Using Recoil to Manage Orthogonal State in React Apps with David McCabe',
        byline: 'David McCabe',
        path:
          '/lessons/react-using-recoil-to-manage-orthogonal-state-in-react-apps-with-david-mccabe',
        image:
          'https://d2eip9sf3oo6c2.cloudfront.net/tags/images/000/000/026/full/react.png',
      },
      {
        title: 'Managing Complex State in React with Jared Palmer [explicit]',
        byline: 'Jared Palmer',
        path:
          '/lessons/react-managing-complex-state-in-react-with-jared-palmer-explicit',
        image:
          'https://d2eip9sf3oo6c2.cloudfront.net/tags/images/000/000/026/full/react.png',
      },
      {
        title: 'State Management in React with Chance Strickland',
        byline: 'Chance Strickland',
        path: '/lessons/react-state-management-in-react-with-chance-strickland',
        image:
          'https://d2eip9sf3oo6c2.cloudfront.net/tags/images/000/000/026/full/react.png',
      },
      {
        title: 'State Management in React with Christopher Chedeau',
        byline: 'Christopher Chedeau',
        path:
          '/lessons/react-state-management-in-react-with-christopher-chedeau',
        image:
          'https://d2eip9sf3oo6c2.cloudfront.net/tags/images/000/000/026/full/react.png',
      },
      {
        title: 'State Management in React with Paul Henschel',
        byline: 'Paul Henschel',
        path: '/lessons/react-state-management-in-react-with-paul-henschel',
        image:
          'https://d2eip9sf3oo6c2.cloudfront.net/tags/images/000/000/026/full/react.png',
      },
    ],
  },
  {
    id: 'state-management-quickly',
    title: 'Favorites',
    resources: [
      {
        title: `Intro to React, Hooks & Context API`,
        path:
          '/playlists/build-a-name-picker-app-intro-to-react-hooks-context-api-1ded',
        byline: 'Simon Vrachliotis',
      },
      {
        title: 'Lifting and colocating React State',
        path: '/lessons/react-lifting-and-colocating-react-state',
        byline: 'Kent C. Dodds',
      },
      {
        title: 'Create forms in React applications with React Final Form',
        path:
          '/playlists/create-forms-in-react-applications-with-react-final-form-2bcd34cb',
        byline: 'Tomasz łakomy',
      },
    ],
  },
  {
    id: 'articles',
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
  {
    id: 'talks',
    name: 'egghead talks',
    title: 'Presentations from React Experts',
    resources: [
      {
        title:
          'Drawing the Invisible: React Explained in Five Visual Metaphors',
        byline: 'Maggie Appleton',
        image:
          'https://res.cloudinary.com/dg3gyk0gu/image/upload/v1611320253/next.egghead.io/react/react-potato-metaphor.png',
        path:
          '/talks/javascript-drawing-the-invisible-react-explained-in-five-visual-metaphors',
      },
      {
        title: 'Concurrent React from Scratch',
        byline: 'Shawn Wang',
        path: '/talks/react-egghead-talks-concurrent-react-from-scratch',
      },
      {
        title: 'Setting Up Feature Flags with React',
        byline: 'Talia Nassi',
        path: '/talks/react-egghead-talks-setting-up-feature-flags-with-react',
      },
      {
        title:
          'Accessibility-flavored React Components make your Design System Delicious',
        byline: 'Kathleen McMahon',
        path:
          '/talks/react-accessibility-flavored-react-components-make-your-design-system-delicious',
      },
      {
        title: 'Lessons Learned From Building React Native Apps',
        byline: 'Adhithi Ravichandran',
        path:
          '/talks/react-native-egghead-talks-lessons-learned-from-building-react-native-apps',
      },
    ],
  },
  {
    id: 'podcasts',
    name: 'egghead podcasts',
    title: 'Conversations with React Experts',
    resources: [
      {
        title: 'Brian Vaughn, React Core Team',
        byline: 'Brian Vaughn',
        image:
          'https://image.simplecastcdn.com/images/2ac34c/2ac34cab-4949-40aa-bac7-d7e3a70f0a39/4c24a78b-f2fd-41f2-87e9-265ead1acb93/1534346357artwork.jpg',
        path: '/podcasts/brian-vaughn-react-core-team',
      },
      {
        title:
          'Ryan Florence Talks About Bringing Web 1.0 Philosophies Back With Remix',
        byline: 'Ryan Florence',
        image:
          'https://image.simplecastcdn.com/images/e21d35da-a28e-4f59-97cc-3c82e6b81011/1dec447a-fc65-4929-b8cf-001889a456c5/podcast-logo-700x700-recovered.jpg',
        path:
          '/podcasts/ryan-florence-talks-about-bringing-web-1-0-philosophies-back-with-remix',
      },
      {
        title: 'Jason Lengstorf on GatsbyJS',
        image:
          'https://image.simplecastcdn.com/images/2ac34c/2ac34cab-4949-40aa-bac7-d7e3a70f0a39/b36aa0cc-3fde-44b8-a751-6cc71cad4cc3/1537381627artwork.jpg',
        byline: 'Jason Lengstorf',
        path: '/podcasts/jason-lengstorf-on-gatsbyjs',
      },
      {
        title:
          'Kent C. Dodds Chats About How Epic React was Designed for Learner Success',
        byline: 'Kent C. Dodds',
        image:
          'https://image.simplecastcdn.com/images/e21d35da-a28e-4f59-97cc-3c82e6b81011/83951ec7-07a5-40d2-9cb3-82985c7bb2b4/kent-logo.jpg',
        path:
          '/podcasts/kent-c-dodds-chats-about-how-epic-react-was-designed-for-learner-success',
      },
      {
        title:
          'Segun Adebayo is the UX Engineer that built the Chakra UI design system',
        byline: 'Segun Adeyabo',
        image:
          'https://image.simplecastcdn.com/images/e21d35da-a28e-4f59-97cc-3c82e6b81011/e7a23942-2e20-4a08-bf95-84a9869ee042/art.jpg',
        path:
          '/podcasts/why-segun-adebayo-calls-himself-a-ux-engineer-instead-of-a-designer',
      },
    ],
  },
]

export default reactPageData
