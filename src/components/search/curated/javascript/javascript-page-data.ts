const javascriptPageData = [
  {
    id: 'beginner',
    title: 'Beginner',
    name: 'Just starting out with JavaScript',
    resources: [
      {
        title: 'Learn ES6',
        path: '/courses/learn-es6-ecmascript-2015',
        image:
          'https://d2eip9sf3oo6c2.cloudfront.net/series/square_covers/000/000/049/full/EGH_LearnES6_Final.png',
        byline: 'John Lindquist',
      },
      {
        title: 'Understand JavaScript Arrays',
        path: '/courses/understand-javascript-arrays',
        image:
          'https://d2eip9sf3oo6c2.cloudfront.net/series/square_covers/000/000/021/full/EGH_JSarrays.png',
        byline: 'Shane Osbourne',
      },

      {
        title: 'Advanced JavaScript Foundations',
        path: '/courses/advanced-javascript-foundations',
        image:
          'https://d2eip9sf3oo6c2.cloudfront.net/series/square_covers/000/000/353/full/foundation.png',
        byline: 'Tyler Clark',
      },
    ],
  },
  {
    id: 'intermediate',
    title: 'Intermediate',
    name: 'Hitting Your Stride',
    resources: [
      {
        title: 'JavaScript Promises in Depth',
        path: '/courses/javascript-promises-in-depth',
        image:
          'https://d2eip9sf3oo6c2.cloudfront.net/series/square_covers/000/000/185/full/JSPromises_Final.png',
        byline: 'Marius Schulz',
      },
      {
        title: "Understand JavaScript's this Keyword in Depth",
        path: '/courses/understand-javascript-s-this-keyword-in-depth',
        image:
          'https://d2eip9sf3oo6c2.cloudfront.net/series/square_covers/000/000/167/full/EGH_JSthis_1000.png',
        byline: 'Marius Schulz',
      },
      {
        title: 'Reduce Data with Javascript Array#reduce',
        path: '/courses/reduce-data-with-javascript-array-reduce',
        image:
          'https://d2eip9sf3oo6c2.cloudfront.net/series/square_covers/000/000/028/full/EGH_ReduceDataJS.png',
        byline: 'Mykola Bilokonsky',
      },
    ],
  },
  {
    id: 'advanced',
    title: 'Advanced',
    name: 'Above and Beyond',
    resources: [
      {
        title: 'Write simple asynchronous code with JavaScript generators',
        path:
          '/courses/write-simple-asynchronous-code-with-javascript-generators',
        image:
          'https://d2eip9sf3oo6c2.cloudfront.net/series/square_covers/000/000/110/full/EGH_JSAsync_1000.png',
        byline: 'Max Stoiber',
      },
      {
        title: 'Asynchronous JavaScript with async/await',
        path: '/courses/asynchronous-javascript-with-async-await',
        image:
          'https://d2eip9sf3oo6c2.cloudfront.net/series/square_covers/000/000/118/full/EGH_AsyncJSAwait_Final-01.png',
        byline: 'Marius Schulz',
      },
      {
        title: "Understanding JavaScript's Prototypal Inheritance",
        path: '/courses/understanding-javascript-s-prototypal-inheritance',
        image:
          'https://d2eip9sf3oo6c2.cloudfront.net/series/square_covers/000/000/205/full/EGH_JSProtoInheritance.png',
        byline: 'Tyler Clark',
      },
    ],
  },
  {
    id: 'composing-callbacks',
    name: 'Mind Expanding',
    title: 'Deep Dive into Function Composition',
    description:
      'This a multi-tier master course for aspiring lead developers. John Lindquist guides you from a blank JavaScript file all the way through creating a library of reusable functions, solving Callback Hell with composition, and implementing debouncing.',
    path: '/playlists/composing-closures-and-callbacks-in-javascript-1223',
    resources: [
      {
        path: '/playlists/composing-closures-and-callbacks-in-javascript-1223',
        title: 'Composing Callbacks and Closures in JavaScript',
        byline: 'John Lindquist',
        image:
          'https://d2eip9sf3oo6c2.cloudfront.net/playlists/square_covers/000/402/036/full/EGH_ComposingCallbacks_Final.png',
      },
    ],
  },
  {
    id: 'interview-prep',
    title: 'Confidently Solve Interview Problems ',
    name: 'Interview Prep',
    resources: [
      {
        title: 'Functional programming for Solving Coding Challenges',
        path:
          '/playlists/javascript-interview-learn-functional-programming-with-solving-coding-challenges-8c0c',
        byline: 'Dimitri Ivashchuk',
        image:
          'https://d2eip9sf3oo6c2.cloudfront.net/tags/images/000/000/205/full/javascriptlang.png',
      },
      {
        title: "Understanding JavaScript's Prototypal Inheritance",
        path: '/courses/understanding-javascript-s-prototypal-inheritance',
        image:
          'https://d2eip9sf3oo6c2.cloudfront.net/series/square_covers/000/000/205/full/EGH_JSProtoInheritance.png',
        byline: 'Tyler Clark',
      },
      {
        title: "Understand JavaScript's this Keyword in Depth",
        path: '/courses/understand-javascript-s-this-keyword-in-depth',
        image:
          'https://d2eip9sf3oo6c2.cloudfront.net/series/square_covers/000/000/167/full/EGH_JSthis_1000.png',
        byline: 'Marius Schulz',
      },
    ],
  },
  {
    id: 'debugging',
    title: 'Debugging',
    name: 'devtools',
    description:
      "You likely know the pain and joy that is debugging. The pain is part of the process, and the joy is winning the battle and fixing the issue. You're probably familiar with the basics of using Devtools. These courses will give you new tools that will help make the journey from debugging pain to joy more quickly!",
    resources: [
      {
        title: 'Advanced Logging with the JavaScript Console',
        path: '/courses/js-console-for-power-users',
        image:
          'https://d2eip9sf3oo6c2.cloudfront.net/series/square_covers/000/000/038/full/EGH_JSPowerConsole_sq.png',
        byline: 'Mykola Bilokonsky',
      },
      {
        title: 'Debug the DOM in Chrome with the Devtools Elements Panel',
        path: '/courses/using-chrome-developer-tools-elements',
        image:
          'https://d2eip9sf3oo6c2.cloudfront.net/series/square_covers/000/000/060/full/EGH_Chrome_Elements.png',
        byline: 'Mykola Bilokonsky',
      },
      {
        title: 'Debug JavaScript in Chrome with DevTool Sources',
        path: '/courses/chrome-devtools-sources-panel',
        image:
          'https://d2eip9sf3oo6c2.cloudfront.net/series/square_covers/000/000/067/full/EGH_Chrome_Sources_Final.png',
        byline: 'Mykola Bilokonsky',
      },
      {
        title: 'Debug HTTP with Chrome DevTools Network Panel',
        path: '/courses/debug-http-with-chrome-devtools-network-panel',
        image:
          'https://d2eip9sf3oo6c2.cloudfront.net/series/square_covers/000/000/069/full/EGH_Chrome_Network_Final.png',
        byline: 'Mykola Bilokonsky',
      },
      {
        title: 'Critical Rendering Path',
        path: '/playlists/critical-rendering-path-c2ec',
        image:
          'https://d2eip9sf3oo6c2.cloudfront.net/tags/images/000/001/028/full/chrome.png',
        byline: 'Mykola Bilokonsky',
      },
      {
        title: 'Chrome DevTools tips & tricks',
        path:
          '/playlists/4-things-you-might-not-know-about-chrome-devtools-98f99710',
        image:
          'https://d2eip9sf3oo6c2.cloudfront.net/tags/images/000/001/028/full/chrome.png',
        byline: 'Tomasz Łakomy',
      },
    ],
  },
  {
    id: 'addtional-interview-prep',
    title: 'Additional Interview Prep',
    resources: [
      {
        title: 'Just Enough Functional Programming in JavaScript',
        path: '/courses/just-enough-functional-programming-in-javascript',
        byline: 'Kyle Shevlin',
        image:
          'https://d2eip9sf3oo6c2.cloudfront.net/series/square_covers/000/000/241/full/Functional_Programming.png',
      },
      {
        title: 'Data Structures and Algorithms in JavaScript',
        path: '/courses/data-structures-and-algorithms-in-javascript',
        image:
          'https://d2eip9sf3oo6c2.cloudfront.net/series/square_covers/000/000/261/full/EGH_JSAlgorithms_Final.png',
        byline: 'Kyle Shevlin',
      },
      {
        title: 'Algorithms in JavaScript',
        path: '/courses/algorithms-in-javascript',
        image:
          'https://d2eip9sf3oo6c2.cloudfront.net/series/square_covers/000/000/259/full/EGH_JSBasic-Algorithms_Final.png',
        byline: 'Tyler Clark',
      },
    ],
  },
  {
    id: 'articles',
    name: 'Written Resources',
    title: 'Start Learning JavaScript',
    path: '/learn/javascript',
    resources: [
      {
        title: 'What is the DOM?',
        byline: 'Hiro Nishimura and Maggie Appleton',
        path: '/learn/javascript/the-dom',
      },
      {
        title: 'Codemods with Babel Plugins',
        byline: 'Laurie Barth',
        path: '/learn/javascript/codemods-with-babel-plugins',
      },
      {
        title:
          'Improve Performance with the Object Pool Design Pattern in JavaScript',
        byline: 'Yonatan Kra',
        path:
          '/learn/javascript/improve-performance-with-the-object-pool-design-pattern-in-javascript',
      },
      {
        title: 'The Real Introduction to JavaScript',
        byline: 'Hiro Nishimura and Maggie Appleton',
        path: '/learn/javascript/javascript-introduction',
      },
      {
        title: 'JavaScript Prerequisites before React',
        byline: 'Hiro Nishimura',
        path: '/learn/react/beginners/js-before-react',
      },
    ],
  },
  {
    id: 'async',
    title: 'Async',
    name: 'Data Fetching',
    description: `Under the hood of your modern applications, there is a lot of work communication back and forth with servers, reacting to user interaction, and managing the state of a complex asynchronous application. Your application grows, the complexity multiplies, until you've got a jumbled mess that makes you sad to get up and get to work every morning.`,
    resources: [
      {
        title: 'JavaScript Promises in Depth',
        byline: 'Marius Shulz',
        image:
          'https://d2eip9sf3oo6c2.cloudfront.net/series/square_covers/000/000/185/full/JSPromises_Final.png',
        path: '/courses/javascript-promises-in-depth',
      },
      {
        title: 'Asynchronous Programming: The End of The Loop',
        byline: 'Jafar Husain',
        image:
          'https://d2eip9sf3oo6c2.cloudfront.net/series/square_covers/000/000/011/full/EGH_Asyncintro_Final.png',
        path: '/courses/asynchronous-programming-the-end-of-the-loop',
      },
      {
        title: 'Asynchronous JavaScript with async/await',
        byline: 'Marius Shulz',
        image:
          'https://d2eip9sf3oo6c2.cloudfront.net/series/square_covers/000/000/118/full/EGH_AsyncJSAwait_Final-01.png',
        path: '/courses/asynchronous-javascript-with-async-await',
      },
      {
        title: 'Write simple asynchronous code with JavaScript generators',
        byline: 'Max Stoiber',
        image:
          'https://d2eip9sf3oo6c2.cloudfront.net/series/square_covers/000/000/110/full/EGH_JSAsync_1000.png',
        path:
          '/courses/write-simple-asynchronous-code-with-javascript-generators',
      },
    ],
  },
  {
    id: 'podcasts',
    name: 'egghead podcasts',
    title: 'Conversations with JavaScript Experts',
    resources: [
      {
        title: "Math and Functional Programming Aren't Exclusive to Wizards",
        byline: 'Brian Lonsdorf',
        image:
          'https://image.simplecastcdn.com/images/2ac34c/2ac34cab-4949-40aa-bac7-d7e3a70f0a39/ce5d6c4f-3f8c-47d7-b6eb-8f952038e5c9/1541152460artwork.jpg',
        path:
          '/podcasts/math-and-functional-programming-aren-t-exclusive-to-wizards-with-brian-lonsdorf',
      },
      {
        title: 'Henry Zhu, Maintainer of Babel',
        byline: 'Henry Zhu',
        image:
          'https://image.simplecastcdn.com/images/2ac34c/2ac34cab-4949-40aa-bac7-d7e3a70f0a39/0470de61-8896-4f53-9ad0-56eb8c7a6ea2/1534346287artwork.jpg',
        path: '/podcasts/henry-zhu-maintainer-of-babel',
      },
      {
        title: 'Functional JavaScript',
        image:
          'https://image.simplecastcdn.com/images/2ac34c/2ac34cab-4949-40aa-bac7-d7e3a70f0a39/e1d13435-f5fe-401c-934c-27c445aa1e57/1534346592artwork.jpg',
        byline: 'Brian Lonsdorf and Paul Frend',
        path: '/podcasts/jason-lengstorf-on-gatsbyjs',
      },
      {
        title: '12-factor Javascript Applications using Docker',
        byline: 'Mark Shust',
        image:
          'https://image.simplecastcdn.com/images/2ac34c/2ac34cab-4949-40aa-bac7-d7e3a70f0a39/826f1b9f-3c99-4712-919a-03cbad5356ac/1534346494artwork.jpg',
        path:
          '/podcasts/12-factor-javascript-applications-using-docker-with-mark-shust',
      },
      {
        title: 'Learning and Experimenting with Physical and Digital Mediums',
        byline: 'Keith Peters',
        image:
          'https://image.simplecastcdn.com/images/2ac34c/2ac34cab-4949-40aa-bac7-d7e3a70f0a39/4d753431-9b5e-4ede-8675-f28cb9306ae0/1538717402artwork.jpg',
        path:
          '/podcasts/learning-and-experimenting-with-physical-and-digital-mediums-with-keith-peters',
      },
    ],
  },
  {
    id: 'talks',
    name: 'egghead talks',
    title: 'Conversations with JavaScript Experts',
    resources: [
      {
        title:
          'Put Down the Javascript - Level Up with the Fundamentals of Web Development',
        byline: 'Colby Fayock',
        image:
          'https://image.simplecastcdn.com/images/2ac34c/2ac34cab-4949-40aa-bac7-d7e3a70f0a39/ce5d6c4f-3f8c-47d7-b6eb-8f952038e5c9/1541152460artwork.jpg',
        path:
          '/talks/egghead-put-down-the-javascript-level-up-with-the-fundamentals-of-web-development',
      },
      {
        title: 'Henry Zhu, Maintainer of Babel',
        byline: 'Henry Zhu',
        image:
          'https://image.simplecastcdn.com/images/2ac34c/2ac34cab-4949-40aa-bac7-d7e3a70f0a39/0470de61-8896-4f53-9ad0-56eb8c7a6ea2/1534346287artwork.jpg',
        path: '/podcasts/henry-zhu-maintainer-of-babel',
      },
      {
        title: 'Functional JavaScript',
        image:
          'https://image.simplecastcdn.com/images/2ac34c/2ac34cab-4949-40aa-bac7-d7e3a70f0a39/e1d13435-f5fe-401c-934c-27c445aa1e57/1534346592artwork.jpg',
        byline: 'Brian Lonsdorf and Paul Frend',
        path: '/podcasts/jason-lengstorf-on-gatsbyjs',
      },
      {
        title: '12-factor Javascript Applications using Docker',
        byline: 'Mark Shust',
        image:
          'https://image.simplecastcdn.com/images/2ac34c/2ac34cab-4949-40aa-bac7-d7e3a70f0a39/826f1b9f-3c99-4712-919a-03cbad5356ac/1534346494artwork.jpg',
        path:
          '/podcasts/12-factor-javascript-applications-using-docker-with-mark-shust',
      },
      {
        title: 'Learning and Experimenting with Physical and Digital Mediums',
        byline: 'Keith Peters',
        image:
          'https://image.simplecastcdn.com/images/2ac34c/2ac34cab-4949-40aa-bac7-d7e3a70f0a39/4d753431-9b5e-4ede-8675-f28cb9306ae0/1538717402artwork.jpg',
        path:
          '/podcasts/learning-and-experimenting-with-physical-and-digital-mediums-with-keith-peters',
      },
    ],
  },
]

export default javascriptPageData
