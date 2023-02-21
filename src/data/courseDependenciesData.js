import {find} from 'lodash'

const courseDependencyData = (courseSlug) =>
  find(
    [
      {
        id: 425791,
        type: 'playlist',
        guid: '93bd',
        slug: 'declarative-uis-without-css-with-elm-ui-93bd',
        dependencies: {
          elm: '>=0.19.1',
        },
        freshness: {
          status: `fresh`,
          title: `This is a Fresh Course`,
          text: `This course is new and up-to-date. It will provide you with a different paradigm to view design, layout, and CSS.`,
          asOf: `2021-03-09`,
        },
        topics: [
          'Use a declarative mindset for building UIs',
          'Positioning elements, including centering',
          'Creating a layout with rows and columns',
          'Building a form',
        ],
        quickFacts: [
          'elm-ui allows you to define styling with a minimal knowledge of CSS',
          'elm-ui is not only useful as a layout system but also on the component/element level',
          'elm-ui is more logic based than CSS based',
          'There is no cascade when declaring elm-ui ',
          `elm doesn't have statements, it has expressions`,
        ],
        essentialQuestions: [
          `What's the best approach to building UIs?`,
          `How should I balance the tradeoffs between functionality and accessibility?`,
        ],
        pairWithResources: [
          {
            title: 'Start Using Elm to Build Web Applications',
            byline: 'Murphy Randle・30m・Course',
            path: '/courses/start-using-elm-to-build-web-applications',
            slug: 'start-using-elm-to-build-web-applications',
            description:
              'In this course you will learn the basic fundamentals of Elm so that you can start building applications today. Elm is a beginner friendly functional reactive programming language for building web applications.',
            image:
              'https://d2eip9sf3oo6c2.cloudfront.net/playlists/square_covers/000/432/737/full/EGH_Elm_Final.png',
          },
          {
            title:
              'Sprinkle declarative, reactive behaviour on your HTML with Alpine JS',
            byline: 'Simon Vrachliotis・17m・Course',
            path: '/courses/sprinkle-declarative-reactive-behaviour-on-your-html-with-alpine-js-5f8b',
            slug: 'sprinkle-declarative-reactive-behaviour-on-your-html-with-alpine-js-5f8b',
            image:
              'https://d2eip9sf3oo6c2.cloudfront.net/tags/images/000/001/286/full/alpinejs.png',
            description:
              'Alpine JS is a rugged, minimal framework for composing JavaScript behaviour in your markup. It brings declarative, reactive, data-driven nature of libraries like React or Vue to your HTML templates.',
          },
          {
            title: 'Functional Programming in JavaScript with Ramda.js',
            byline: 'Andy Van Slaars・1h 38m・Course',
            path: '/courses/functional-programming-in-javascript-with-ramda-js',
            slug: 'functional-programming-in-javascript-with-ramda-js',
            description:
              'Learn how you can use ramda.js to bring functional programming concepts into your JavaScript code. Ramda offers composability and immutability right out of the box, so you can leave your imperative code behind and build cleaner, more maintainable code.',
            image:
              'https://d2eip9sf3oo6c2.cloudfront.net/tags/images/000/000/943/full/ramda.png',
          },
        ],
      },
      {
        id: 425621,
        type: 'playlist',
        guid: 'bd96',
        slug: 'build-a-developer-blog-with-gatsby-bd96',
        illustrator: {
          name: 'Maxime Bourgeois',
        },
        dependencies: {
          gatsby: '>=2.27.1',
        },
        courseProject: {
          label: 'Portfolio Project Challenge',
          url: '/projects/build-a-developer-blog-with-gatsby',
          text: `After this course, you'll be ready to start building with Gatsby. Need an idea? Start with this challenge!`,
        },
        freshness: {
          status: `fresh`,
          title: `The most up-to-date Gatsby course out there`,
          text: `The tools introduced in this course improve developer experience and teach you the best practices for building a Gatsby site.`,
          asOf: `2021-03-01`,
        },
        topics: [
          'Install Gatsby and the Gatsby CLI',
          'Programmatically create pages from your GraphQL data',
          'Use GraphiQL to make queries based on source plugins',
          'Create a blog post listing page with links to every post',
          'Source and transform images',
          'Make the site SEO-friendly',
        ],
        essentialQuestions: [
          'How can I reduce the friction of publishing content?',
          'What are the best practices for optimizing your website?',
          'Why is it important to have a blog as a developer?',
        ],
        pairWithResources: [
          {
            title: 'Build a Video Chat App with Twilio and Gatsby',
            byline: 'Jason Lengstorf・52m・Course',
            path: '/courses/build-a-video-chat-app-with-twilio-and-gatsby',
            slug: 'build-a-video-chat-app-with-twilio-and-gatsby',
            description: `In this workshop, Jason Lengstorf will take you from an empty project folder all the way through deployment of a Twilio-powered video chat app built on Gatsby.`,
            image:
              'https://d2eip9sf3oo6c2.cloudfront.net/playlists/square_covers/000/432/507/full/TwilioGatsby_Final.png',
          },
          {
            title:
              'Eject create-react-app and Use Gatsby for Advanced React App Development',
            byline: 'Khaled Garbaya・43m・Course',
            path: '/courses/eject-create-react-app-and-use-gatsby-for-advanced-react-app-development',
            slug: 'eject-create-react-app-and-use-gatsby-for-advanced-react-app-development',
            description:
              'Create-React-App is a great tool for getting started with React, but at some point you may find yourself needing something more.',
            image:
              'https://d2eip9sf3oo6c2.cloudfront.net/playlists/square_covers/000/432/491/full/preview-full-EGH_cra-to-gatsby_424_2x.png',
          },
          {
            title:
              'Building a Serverless JAMStack Todo app with Netlify, Gatsby, GraphQL, and FaunaDB',
            byline: 'Chris Biscardi・51m・Course',
            path: '/courses/building-a-serverless-jamstack-todo-app-with-netlify-gatsby-graphql-and-faunadb-53bb',
            slug: 'building-a-serverless-jamstack-todo-app-with-netlify-gatsby-graphql-and-faunadb-53bb',
            description: `This application serves as an introduction to building products with a JAMStack and Serverless approach.`,
            image:
              'https://d2eip9sf3oo6c2.cloudfront.net/tags/images/000/001/211/full/gatsby.png',
          },
        ],
      },
      {
        id: 432685,
        type: 'course',
        slug: 'build-a-blog-with-react-and-markdown-using-gatsby',
        dependencies: {
          gatsby: '^2.0.0',
        },
        freshness: {
          status: `awesome`,
          title: `Still Awesome`,
          text: `This course is on ^2.0.0 and is slightly outdated but it is still awesome. To follow along please take a look at the [course notes](https://github.com/eggheadio-projects/build-a-blog-with-react-and-markdown-using-gatsby-notes#%EF%B8%8F-deprecations).`,
          asOf: `2021-02-04`,
        },
        pairWithResources: [
          {
            title: 'Build a Developer Blog with Gatsby',
            byline: 'Laurie Barth・35m・Course',
            path: '/courses/build-a-developer-blog-with-gatsby-bd96',
            slug: 'build-a-developer-blog-with-gatsby-bd96',
            description:
              "By the end of the course, you'll have a fully functioning developer blog that will serve as a base for larger production-grade applications.",
            image:
              'https://d2eip9sf3oo6c2.cloudfront.net/playlists/square_covers/000/425/621/full/developer_blog_1000_2x.png',
          },
          {
            title: 'Build a Video Chat App with Twilio and Gatsby',
            byline: 'Jason Lengstorf・52m・Course',
            path: '/courses/build-a-video-chat-app-with-twilio-and-gatsby',
            slug: 'build-a-video-chat-app-with-twilio-and-gatsby',
            description: `In this workshop, Jason Lengstorf will take you from an empty project folder all the way through deployment of a Twilio-powered video chat app built on Gatsby.`,
            image:
              'https://d2eip9sf3oo6c2.cloudfront.net/playlists/square_covers/000/432/507/full/TwilioGatsby_Final.png',
          },
          {
            title:
              'Eject create-react-app and Use Gatsby for Advanced React App Development',
            byline: 'Khaled Garbaya・43m・Course',
            path: '/courses/eject-create-react-app-and-use-gatsby-for-advanced-react-app-development',
            slug: 'eject-create-react-app-and-use-gatsby-for-advanced-react-app-development',
            description:
              'Create-React-App is a great tool for getting started with React, but at some point you may find yourself needing something more.',
            image:
              'https://d2eip9sf3oo6c2.cloudfront.net/playlists/square_covers/000/432/491/full/preview-full-EGH_cra-to-gatsby_424_2x.png',
          },
        ],
      },
      {
        id: 408538,
        type: 'playlist',
        guid: '6732',
        slug: 'react-state-management-in-2021-6732',
        illustrator: {
          name: 'Maxime Bourgeois',
        },
        freshness: {
          status: `fresh`,
          title: `This is a Fresh Resource`,
          text: `This series digs into the deeper patterns of development with leading experts in the field. It's worth your time.`,
          asOf: `2021-02-19`,
        },
        essentialQuestions: [
          'How do you know when you need to use a state management library?',
          'Why is state management challenging?',
          'Why does state need to be managed?',
        ],
        pairWithResources: [
          {
            id: 432472,
            title: 'Introduction to State Machines Using XState',
            byline: 'Kyle Shevlin・58m・Course',
            image:
              'https://d2eip9sf3oo6c2.cloudfront.net/playlists/square_covers/000/432/472/full/IntroxState_1000.png',
            path: '/playlists/introduction-to-state-machines-using-xstate',
            slug: 'introduction-to-state-machines-using-xstate',
            description: `We will explore the problems state machines purport to solve, like boolean explosion. We'll try to solve it our own way first, get so far, and then demonstrate how state machines get us all the way. After that, we'll dive into the XState library, JavaScript's premiere state machine library, to learn its API and how to use it to solve our problems.`,
          },
          {
            id: 432528,
            title: 'Reusable State and Effects with React Hooks',
            byline: 'Elijah Manor・57m・Course',
            image:
              'https://d2eip9sf3oo6c2.cloudfront.net/playlists/square_covers/000/432/528/full/EGH_ReactHooks_Final_%281%29.png',
            path: '/playlists/reusable-state-and-effects-with-react-hooks',
            slug: 'reusable-state-and-effects-with-react-hooks',
            description:
              "By the end of this course, you'll learn how to: Run (and Skip) side-effects with the useEffect hook, Write a custom hook to share logic in your app, Simplify the Context API with the useContext hook, Update state with dispatch actions using the useReducer hook, Optimize Components with useMemo",
          },
          {
            id: 423944,
            title: 'Redux with React Hooks',
            byline: 'Jamund Ferguson・42m・Course',
            image:
              'https://d2eip9sf3oo6c2.cloudfront.net/tags/images/000/000/026/full/react.png',
            path: '/playlists/redux-with-react-hooks-8a37',
            slug: 'redux-with-react-hooks-8a37',
            description: `Recent updates to redux exposing a hooks-based API address some of its most serious drawbacks and make it even more appealing. This course will show you how to apply redux to a modern react hooks application. I hope you leave this course with a continued appreciation for React Hooks and renewed enthusiasm for Redux.`,
          },
        ],
      },
      {
        id: 425628,
        type: 'playlist',
        guid: '7297',
        slug: 'accessible-cross-browser-css-form-styling-7297',
        topics: [
          'Structural layout of form elements',
          'Group fields into a fieldset',
          'Adjust behavior based on viewport size',
          'Style radio and checkbox elements',
        ],
        illustrator: {
          name: 'Kamil Khadeyev',
        },
        prerequisites: [
          {
            id: 392298,
            title: 'Build An Eleventy (11ty) Site From Scratch',
            path: '/playlists/build-an-eleventy-11ty-site-from-scratch-bfd3',
            image:
              'https://d2eip9sf3oo6c2.cloudfront.net/tags/images/000/001/284/full/11ty.png',
          },
          {
            id: 87,
            title: 'Learn the Best and Most Useful SCSS',
            path: '/courses/learn-the-best-and-most-useful-scss',
            image:
              'https://d2eip9sf3oo6c2.cloudfront.net/series/square_covers/000/000/087/full/EGH_SCSS_Final.png',
          },
          {
            id: 55,
            title: 'Start Building Accessible Web Applications Today',
            path: '/courses/start-building-accessible-web-applications-today',
            image:
              'https://d2eip9sf3oo6c2.cloudfront.net/series/square_covers/000/000/055/full/EGH_AccessibleWeb.png',
          },
        ],
        freshness: {
          status: `fresh`,
          title: `This is a Fresh Course`,
          text: `This course is new and up to date — if you are looking to build a form for your website, you should start here.`,
          asOf: `2021-02-11`,
        },
        nextSteps: [
          'Adapt the mini-design system used for the forms into your existing application.',
          'Build a mock survey form using the same Eleventy starter',
        ],
        essentialQuestions: [
          'What do native controls offer? Am I using the best choice?',
          'Is my form accessible?',
          'How should I balance the tradeoffs between functionality and accessibility?',
        ],
        pairWithResources: [
          {
            id: 235,
            title: 'CSS Selectors in Depth',
            byline: 'Garth Braithwaite・34m・Course',
            image:
              'https://d2eip9sf3oo6c2.cloudfront.net/series/square_covers/000/000/235/full/EGH_CSSSelectors_Final.png',
            path: '/courses/css-selectors-in-depth',
            slug: 'css-selectors-in-depth',
            description: `Cascading style sheet (CSS) selectors are the glue that connects styling to HTML content. Understanding how they work enables a developer to write more semantic markup and keeps styling modular for better project maintenance.`,
          },
          {
            id: 227,
            title: 'CSS Fundamentals',
            byline: 'Tyler Clark・33m・Course',
            image:
              'https://d2eip9sf3oo6c2.cloudfront.net/series/square_covers/000/000/227/full/EGH_CSSFundamentals_Final.png',
            path: '/courses/css-fundamentals',
            slug: 'css-fundamentals',
            description:
              'Even the most experienced developer can learn something new when it comes to using and understanding how the browser interprets CSS. In this course, we will slowly style a website according to a mocked image.',
          },
          {
            id: 107,
            title: 'Build Complex Layouts with CSS Grid Layout',
            byline: 'Rory Smith・30m・Course',
            image:
              'https://d2eip9sf3oo6c2.cloudfront.net/series/square_covers/000/000/107/full/EGH_CSS_Grids.png',
            path: '/courses/build-complex-layouts-with-css-grid-layout',
            slug: 'build-complex-layouts-with-css-grid-layout',
            description: `CSS Grid layout is a two-dimensional layout method that gives you control over items in rows as well as columns. In this course we will look at multiple ways to divide the page into major regions with control of the size, position, and layer.`,
          },
        ],
      },
      {
        id: 422773,
        type: 'playlist',
        guid: '4efb',
        slug: 'create-contextual-video-analysis-app-with-nextjs-and-symbl-ai-4efb',
        topics: [
          'Use Symbl.ai to get transcripts for the video',
          'The basics of Symbl AI Conversation API',
          'Process video using to Symbl Async Video API',
          'Implement login functionality by using Symbl oauth2 endpoint',
          'Store a token globally with React Context',
          `Utilize Symbl's Job Status API`,
        ],
        freshness: {
          status: `fresh`,
          title: `This is a Fresh Course`,
          text: `This course is new and up to date — add an excellent project to your developer portfolio using Next.js and intelligent cloud solutions.`,
          asOf: `2021-02-09`,
        },
        pairWithResources: [
          {
            title: 'Create an eCommerce Store with Next.js and Stripe Checkout',
            byline: 'Colby Fayock・1h 4m・Course',
            image:
              'https://d2eip9sf3oo6c2.cloudfront.net/playlists/square_covers/000/412/781/thumb/ecommerce-stripe-next.png',
            path: '/playlists/,create-an-ecommerce-store-with-next-js-and-stripe-checkout-562c',
            slug: 'create-an-ecommerce-store-with-next-js-and-stripe-checkout-562c',
            description: `Build a modern eCommerce store with the best-in-class tools available to web developers to add to your portfolio.`,
          },
          {
            title: 'React Context for State Management',
            byline: 'Dave Ceddia・35m・Course',
            image:
              'https://d2eip9sf3oo6c2.cloudfront.net/series/square_covers/000/000/262/thumb/EGH_ReactContext_Final.png',
            path: '/courses/react-context-for-state-management',
            slug: 'react-context-for-state-management',
            description:
              'In this course, we’ll build a simple email client using the React Context API to pass data throughout the app. You’ll learn how to create a context, how to pass data deeply through an app without manually passing props all over the place, and how to group related data and logic using simple wrapper components.',
          },
          {
            title: 'Using DynamoDB with Next.js',
            byline: 'Lee Robinson・30m・Course',
            image:
              'https://d2eip9sf3oo6c2.cloudfront.net/playlists/square_covers/000/411/838/thumb/EGH_DynamoDB.png',
            path: '/playlists/using-dynamodb-with-next-js-b40c',
            slug: 'using-dynamodb-with-next-js-b40c',
            description: `Learn how to use the AWS Cloud Development Kit (CDK)to create and deploy a DynamoDB table with Next.js.`,
          },
        ],
      },
      {
        id: 419933,
        type: 'playlist',
        guid: '8e1f3603',
        slug: 'get-started-with-the-amplify-admin-ui-9e79',
        topics: [
          'Create a database schema',
          'Test your data locally',
          'Deploy an AWS Amplify Backend',
          'Add Authentication',
          'Add Amazon S3 static file hosting',
          'Deploy your frontend to the Amplify Console',
        ],
        freshness: {
          status: `fresh`,
          title: `This is a Fresh Course`,
          text: `This course is new and up to date—it is a must-watch for any developer that wants to quickly develop and deploy cloud-connected applications.`,
          asOf: `2021-02-09`,
        },
        pairWithResources: [
          {
            title: 'Using DynamoDB with Next.js',
            byline: 'Lee Robinson・30m・Course',
            image:
              'https://d2eip9sf3oo6c2.cloudfront.net/playlists/square_covers/000/411/838/thumb/EGH_DynamoDB.png',
            path: '/playlists/using-dynamodb-with-next-js-b40c',
            slug: 'using-dynamodb-with-next-js-b40c',
            description: `Learn how to use the AWS Cloud Development Kit (CDK)to create and deploy a DynamoDB table with Next.js.`,
          },
          {
            title:
              'Building Serverless Web Applications with React & AWS Amplify',
            byline: 'Nader Dabit・33m・Course',
            image:
              'https://d2eip9sf3oo6c2.cloudfront.net/series/square_covers/000/000/217/thumb/EGH_AmplifyAWS_React_Final.png',
            path: '/courses/building-serverless-web-applications-with-react-aws-amplify',
            slug: 'building-serverless-web-applications-with-react-aws-amplify',
            description: `React makes it intuitive to build real-world web application. But in reality, you need to use a host of other services to get the app in front of real users. This course walks you through setup and implementation to get your cloud-based application up and running.`,
          },
          {
            title: 'Up and Running with Amplify Static Site Hosting',
            byline: 'Nader Dabit・24m・Course',
            path: '/playlists/up-and-running-with-amplify-console-hosting-ci-cd-c680',
            slug: 'up-and-running-with-amplify-console-hosting-ci-cd-c680',
            description:
              'This playlist will get you going with the Amplify Console, including showing you how to host your website, integrate continuous integration and continuous delivery, set up a custom domain, and enable pull request previews.',
            image:
              'https://d2eip9sf3oo6c2.cloudfront.net/tags/images/000/001/090/full/aws.png',
          },
        ],
      },
      {
        id: 418653,
        type: 'playlist',
        guid: '30a8',
        slug: 'build-modern-layouts-with-css-grid-d3f5',
        topics: [
          'Grid is a set of intersecting horizontal and vertical lines defining columns and rows.',
          'Elements can be placed onto the grid within these column and row lines',
          'fr unit represents a fraction of the available space in the grid container',
          'The implicit vs. explicit grid',
          'Flexbox is one dimensional vs. CSS Grid is two dimensional.',
        ],
        pairWithResources: [
          {
            id: 227,
            type: 'course',
            title: 'CSS Fundamentals',
            byline: 'Tyler Clark・33m・Course',
            image:
              'https://d2eip9sf3oo6c2.cloudfront.net/series/square_covers/000/000/227/thumb/EGH_CSSFundamentals_Final.png',
            path: '/courses/css-fundamentals',
            slug: 'css-fundamentals',
            description:
              'Even the most experienced developer can learn something new when it comes to using and understanding how the browser interprets CSS. In this course, we will slowly style a website according to a mocked image',
          },
          {
            id: 36,
            type: 'course',
            title: 'Flexbox Fundamentals',
            byline: 'Garth Braithwaite・18m・Course',
            image:
              'https://d2eip9sf3oo6c2.cloudfront.net/series/square_covers/000/000/036/thumb/EGH_Flexbox.png',
            path: '/courses/flexbox-fundamentals',
            slug: 'flexbox-fundamentals',
            description: `Flexbox is a wonderful tool built into the CSS specification. Using flexbox doesn't require any special framework or library, just a browser with CSS3 support. It is so awesome, and makes the arranging elements on a page almost fun!`,
          },
          {
            id: 107,
            type: 'course',
            title: 'Build Complex Layouts with CSS Grid Layout',
            byline: 'Rory Smith・42m・Course',
            image:
              'https://d2eip9sf3oo6c2.cloudfront.net/series/square_covers/000/000/107/thumb/EGH_CSS_Grids.png',
            path: '/courses/build-complex-layouts-with-css-grid-layout',
            slug: 'build-complex-layouts-with-css-grid-layout',
            description:
              'CSS Grid layout is a two-dimensional layout method that gives you control over items in rows as well as columns. In this course we will look at multiple ways to divide the page into major regions with control of the size, position, and layer.',
          },
        ],
      },
      {
        id: 348912,
        type: 'playlist',
        slug: 'design-with-tailwind-css-masterclass-f0db',
        dependencies: {
          tailwind: '^1.0.4',
        },
        multiModuleCourse: true,
        multiModuleLineheight: '45rem',
        totalCourseModules: 4,
        freshness: {
          status: `awesome`,
          title: `Still Awesome`,
          text: `This course is direct from the library author and is still awesome even though it’s built on the previous version and there are [minor API changes](https://tailwindcss.com/docs/upgrading-to-v2).`,
          asOf: `2021-02-04`,
        },
        topics: [
          'Get Tailwind CSS up and running in your project',
          'Build complex application layouts with flexbox',
          `Build accessible user interfaces following industry best practices`,
          'Remove unused CSS from production builds to maximum performance',
          'Use responsive utility variants to build adaptive user interfaces',
          'Use utilities to style elements on hover, focus, and other states',
          'Extend Tailwind with custom utility classes',
          'Work with Tailwind CSS plugins',
          'Customize Tailwind CSS to meet the needs of your design',
          'Augment Tailwind CSS with JavaScript to make your designs interactive',
        ],
        quickFacts: [
          'Utility classes create an API on top of what is already a declarative API (CSS itself)',
          'Every utility class is reusable so you rarely need to write new CSS',
          `Tailwind CSS makes easier to maintain a large CSS codebase `,
          'Tailwind CSS uses a mobile first breakpoint system',
          'Tailwind CSS is component-driven',
          'Tailwind CSS is single source of truth for your CSS architecture',
        ],
        essentialQuestions: [
          'How do you build visually consistent UIs?',
          'What are the best practices for implementing design systems? ',
          'What makes a project maintainable?',
          'How much design CSS do I need to know?',
        ],
        pairWithResources: [
          {
            id: 227,
            type: 'course',
            title: 'CSS Fundamentals',
            byline: 'Tyler Clark・33m・Course',
            image:
              'https://d2eip9sf3oo6c2.cloudfront.net/series/square_covers/000/000/227/thumb/EGH_CSSFundamentals_Final.png',
            path: '/courses/css-fundamentals',
            slug: 'css-fundamentals',
            description:
              'Even the most experienced developer can learn something new when it comes to using and understanding how the browser interprets CSS. In this course, we will slowly style a website according to a mocked image',
          },
          {
            id: 107,
            type: 'course',
            title: 'Build Complex Layouts with CSS Grid Layout',
            byline: 'Rory Smith・42m・Course',
            image:
              'https://d2eip9sf3oo6c2.cloudfront.net/series/square_covers/000/000/107/thumb/EGH_CSS_Grids.png',
            path: '/courses/build-complex-layouts-with-css-grid-layout',
            slug: 'build-complex-layouts-with-css-grid-layout',
            description:
              'CSS Grid layout is a two-dimensional layout method that gives you control over items in rows as well as columns. In this course we will look at multiple ways to divide the page into major regions with control of the size, position, and layer.',
          },
          {
            id: 36,
            type: 'course',
            title: 'Flexbox Fundamentals',
            byline: 'Garth Braithwaite・18m・Course',
            image:
              'https://d2eip9sf3oo6c2.cloudfront.net/series/square_covers/000/000/036/thumb/EGH_Flexbox.png',
            path: '/courses/flexbox-fundamentals',
            slug: 'flexbox-fundamentals',
            description: `Flexbox is a wonderful tool built into the CSS specification. Using flexbox doesn't require any special framework or library, just a browser with CSS3 support. It is so awesome, and makes the arranging elements on a page almost fun!`,
          },
        ],
      },
      {
        id: 340481,
        type: 'playlist',
        slug: 'introduction-to-tailwind-and-the-utility-first-workflow-ac67',
        dependencies: {
          tailwind: '^1.0.4',
        },
        moduleResource: true,
        moduleLabel: 1,
        totalCourseModules: 4,
        freshness: {
          status: `awesome`,
          title: `Still Awesome`,
          text: `This course is direct from the library author and is still awesome even though it’s built on the previous version and there are [minor API changes](https://tailwindcss.com/docs/upgrading-to-v2). 
          
This course is part of the [Design with Tailwind CSS Masterclass](/playlists/design-with-tailwind-css-masterclass-f0db).
      `,
          asOf: `2021-02-04`,
        },
        multiModuleSlug: 'design-with-tailwind-css-masterclass-f0db',
        multiModuletitle: 'Design with Tailwind CSS Masterclass',
        topics: [
          'Install Tailwind CSS in your project',
          'Design with the utility first workflow',
          'Use Tailwind CSS for responsive design',
          'Extract Tailwind CSS component classes',
        ],
        pairWithResources: [
          {
            id: 227,
            type: 'course',
            title: 'CSS Fundamentals',
            byline: 'Tyler Clark・33m・Course',
            image:
              'https://d2eip9sf3oo6c2.cloudfront.net/series/square_covers/000/000/227/thumb/EGH_CSSFundamentals_Final.png',
            path: '/courses/css-fundamentals',
            slug: 'css-fundamentals',
            description:
              'Even the most experienced developer can learn something new when it comes to using and understanding how the browser interprets CSS. In this course, we will slowly style a website according to a mocked image',
          },
          {
            id: 107,
            type: 'course',
            title: 'Build Complex Layouts with CSS Grid Layout',
            byline: 'Rory Smith・42m・Course',
            image:
              'https://d2eip9sf3oo6c2.cloudfront.net/series/square_covers/000/000/107/thumb/EGH_CSS_Grids.png',
            path: '/courses/build-complex-layouts-with-css-grid-layout',
            slug: 'build-complex-layouts-with-css-grid-layout',
            description:
              'CSS Grid layout is a two-dimensional layout method that gives you control over items in rows as well as columns. In this course we will look at multiple ways to divide the page into major regions with control of the size, position, and layer.',
          },
          {
            id: 36,
            type: 'course',
            title: 'Flexbox Fundamentals',
            byline: 'Garth Braithwaite・18m・Course',
            image:
              'https://d2eip9sf3oo6c2.cloudfront.net/series/square_covers/000/000/036/thumb/EGH_Flexbox.png',
            path: '/courses/flexbox-fundamentals',
            slug: 'flexbox-fundamentals',
            description: `Flexbox is a wonderful tool built into the CSS specification. Using flexbox doesn't require any special framework or library, just a browser with CSS3 support. It is so awesome, and makes the arranging elements on a page almost fun!`,
          },
        ],
      },
      {
        id: 340482,
        type: 'playlist',
        slug: 'design-and-implement-common-tailwind-components-8fbb9b19',
        dependencies: {
          tailwind: '^1.0.4',
        },
        moduleResource: true,
        moduleLabel: 2,
        totalCourseModules: 4,
        freshness: {
          status: `awesome`,
          title: `Still Awesome`,
          text: `This course is direct from the library author and is still awesome even though it’s built on the previous version and there are [minor API changes](https://tailwindcss.com/docs/upgrading-to-v2). 
          
This course is part of the [Design with Tailwind CSS Masterclass](/playlists/design-with-tailwind-css-masterclass-f0db).
      `,
          asOf: `2021-02-04`,
        },
        multiModuleSlug: 'design-with-tailwind-css-masterclass-f0db',
        multiModuletitle: 'Design with Tailwind CSS Masterclass',
        topics: [
          'Style a Card Components',
          'Style badges',
          'Style SVG Icons',
          'Style Images',
        ],
        pairWithResources: [
          {
            id: 227,
            type: 'course',
            title: 'CSS Fundamentals',
            byline: 'Tyler Clark・33m・Course',
            image:
              'https://d2eip9sf3oo6c2.cloudfront.net/series/square_covers/000/000/227/thumb/EGH_CSSFundamentals_Final.png',
            path: '/courses/css-fundamentals',
            slug: 'css-fundamentals',
            description:
              'Even the most experienced developer can learn something new when it comes to using and understanding how the browser interprets CSS. In this course, we will slowly style a website according to a mocked image',
          },
          {
            id: 107,
            type: 'course',
            title: 'Build Complex Layouts with CSS Grid Layout',
            byline: 'Rory Smith・42m・Course',
            image:
              'https://d2eip9sf3oo6c2.cloudfront.net/series/square_covers/000/000/107/thumb/EGH_CSS_Grids.png',
            path: '/courses/build-complex-layouts-with-css-grid-layout',
            slug: 'build-complex-layouts-with-css-grid-layout',
            description:
              'CSS Grid layout is a two-dimensional layout method that gives you control over items in rows as well as columns. In this course we will look at multiple ways to divide the page into major regions with control of the size, position, and layer.',
          },
          {
            id: 36,
            type: 'course',
            title: 'Flexbox Fundamentals',
            byline: 'Garth Braithwaite・18m・Course',
            image:
              'https://d2eip9sf3oo6c2.cloudfront.net/series/square_covers/000/000/036/thumb/EGH_Flexbox.png',
            path: '/courses/flexbox-fundamentals',
            slug: 'flexbox-fundamentals',
            description: `Flexbox is a wonderful tool built into the CSS specification. Using flexbox doesn't require any special framework or library, just a browser with CSS3 support. It is so awesome, and makes the arranging elements on a page almost fun!`,
          },
        ],
      },
      {
        id: 340483,
        type: 'playlist',
        slug: 'build-a-responsive-navbar-with-tailwind-4d328a35',
        dependencies: {
          tailwind: '^1.0.4',
        },
        moduleResource: true,
        moduleLabel: 3,
        totalCourseModules: 4,
        freshness: {
          status: `awesome`,
          title: `Still Awesome`,
          text: `This course is direct from the library author and is still awesome even though it’s built on the previous version and there are [minor API changes](https://tailwindcss.com/docs/upgrading-to-v2). 
          
This course is part of the [Design with Tailwind CSS Masterclass](/playlists/design-with-tailwind-css-masterclass-f0db).
      `,
          asOf: `2021-02-04`,
        },
        multiModuleSlug: 'design-with-tailwind-css-masterclass-f0db',
        multiModuletitle: 'Design with Tailwind CSS Masterclass',
        topics: [
          'Best practices for mobile-first UI development',
          'Use the mobile first breakpoint system',
          'Use responsive utility variant',
        ],
        pairWithResources: [
          {
            id: 227,
            type: 'course',
            title: 'CSS Fundamentals',
            byline: 'Tyler Clark・33m・Course',
            image:
              'https://d2eip9sf3oo6c2.cloudfront.net/series/square_covers/000/000/227/thumb/EGH_CSSFundamentals_Final.png',
            path: '/courses/css-fundamentals',
            slug: 'css-fundamentals',
            description:
              'Even the most experienced developer can learn something new when it comes to using and understanding how the browser interprets CSS. In this course, we will slowly style a website according to a mocked image',
          },
          {
            id: 107,
            type: 'course',
            title: 'Build Complex Layouts with CSS Grid Layout',
            byline: 'Rory Smith・42m・Course',
            image:
              'https://d2eip9sf3oo6c2.cloudfront.net/series/square_covers/000/000/107/thumb/EGH_CSS_Grids.png',
            path: '/courses/build-complex-layouts-with-css-grid-layout',
            slug: 'build-complex-layouts-with-css-grid-layout',
            description:
              'CSS Grid layout is a two-dimensional layout method that gives you control over items in rows as well as columns. In this course we will look at multiple ways to divide the page into major regions with control of the size, position, and layer.',
          },
          {
            id: 36,
            type: 'course',
            title: 'Flexbox Fundamentals',
            byline: 'Garth Braithwaite・18m・Course',
            image:
              'https://d2eip9sf3oo6c2.cloudfront.net/series/square_covers/000/000/036/thumb/EGH_Flexbox.png',
            path: '/courses/flexbox-fundamentals',
            slug: 'flexbox-fundamentals',
            description: `Flexbox is a wonderful tool built into the CSS specification. Using flexbox doesn't require any special framework or library, just a browser with CSS3 support. It is so awesome, and makes the arranging elements on a page almost fun!`,
          },
        ],
      },
      {
        id: 340484,
        type: 'playlist',
        slug: 'build-and-style-a-dropdown-in-tailwind-7f34fead',
        dependencies: {
          tailwind: '^1.0.4',
        },
        moduleResource: true,
        moduleLabel: 4,
        totalCourseModules: 4,
        freshness: {
          status: `awesome`,
          title: `Still Awesome`,
          text: `This course is direct from the library author and is still awesome even though it’s built on the previous version and there are [minor API changes](https://tailwindcss.com/docs/upgrading-to-v2).
          
This course is part of the [Design with Tailwind CSS Masterclass](/playlists/design-with-tailwind-css-masterclass-f0db).
      `,
          asOf: `2021-02-04`,
        },
        multiModuleSlug: 'design-with-tailwind-css-masterclass-f0db',
        multiModuletitle: 'Design with Tailwind CSS Masterclass',
        topics: [
          'Build and style a static dropdown menu',
          'Creating keyboard accessible components',
          'Best practices for mobile-first UI development',
        ],
        pairWithResources: [
          {
            id: 227,
            type: 'course',
            title: 'CSS Fundamentals',
            byline: 'Tyler Clark・33m・Course',
            image:
              'https://d2eip9sf3oo6c2.cloudfront.net/series/square_covers/000/000/227/thumb/EGH_CSSFundamentals_Final.png',
            path: '/courses/css-fundamentals',
            slug: 'css-fundamentals',
            description:
              'Even the most experienced developer can learn something new when it comes to using and understanding how the browser interprets CSS. In this course, we will slowly style a website according to a mocked image',
          },
          {
            id: 107,
            type: 'course',
            title: 'Build Complex Layouts with CSS Grid Layout',
            byline: 'Rory Smith・42m・Course',
            image:
              'https://d2eip9sf3oo6c2.cloudfront.net/series/square_covers/000/000/107/thumb/EGH_CSS_Grids.png',
            path: '/courses/build-complex-layouts-with-css-grid-layout',
            slug: 'build-complex-layouts-with-css-grid-layout',
            description:
              'CSS Grid layout is a two-dimensional layout method that gives you control over items in rows as well as columns. In this course we will look at multiple ways to divide the page into major regions with control of the size, position, and layer.',
          },
          {
            id: 36,
            type: 'course',
            title: 'Flexbox Fundamentals',
            byline: 'Garth Braithwaite・18m・Course',
            image:
              'https://d2eip9sf3oo6c2.cloudfront.net/series/square_covers/000/000/036/thumb/EGH_Flexbox.png',
            path: '/courses/flexbox-fundamentals',
            slug: 'flexbox-fundamentals',
            description: `Flexbox is a wonderful tool built into the CSS specification. Using flexbox doesn't require any special framework or library, just a browser with CSS3 support. It is so awesome, and makes the arranging elements on a page almost fun!`,
          },
        ],
      },
      {
        id: 418892,
        type: 'playlist',
        slug: 'introduction-to-cloudflare-workers-5aa3',
        freshness: {
          status: `fresh`,
          title: `This is a Fresh Course`,
          text: `This course will give you a solid foundation to start developing serverless applications. Serverless is a great trend to explore and CloudFlare is at the forefront of the technology.
      `,
          asOf: `2021-02-01`,
        },

        courseProject: {
          label: 'Cloudflare Worker Project',
          url: '/projects/introduction-to-cloudflare-workers',
          text: `After this course, you'll be ready to start experimenting with your own Cloudflare Workers projects. Need an idea? Start with this Project!
      `,
        },
        topics: [
          'Configure the Wrangler CLI for local development',
          'Write & deploy Cloudflare Workers projects',
          'Integrate third party libraries in a Worker',
          'Conditionally render based on request information',
        ],
        quickFacts: [
          'The Wrangler CLI allows you to manage Workers projects from scratch or from a template',
          'Requests to Workers are populated with an object that includes information about region and timezone',
          'Requests can be filtered based on HTTP method, url, headers, and other data',
        ],
        essentialQuestions: [
          'What is serverless?',
          'How does using a serverless solution enable me to focus more on my business?',
          'What level of control do you need to build successful solutions?',
        ],
        pairWithResources: [
          {
            id: 414202,
            type: 'playlist',
            guid: '553c',
            title:
              'Build a Corgi Up-boop Web App with Netlify Serverless Functions and Hasura',
            byline: 'Jason Lengstorf・1h 27m・Course',
            image:
              'https://d2eip9sf3oo6c2.cloudfront.net/playlists/square_covers/000/414/202/full/EGH_NetlifyServerlessFunction_Final.png',
            path: '/playlists/build-a-corgi-up-boop-web-app-with-netlify-serverless-functions-and-hasura-553c',
            slug: 'build-a-corgi-up-boop-web-app-with-netlify-serverless-functions-and-hasura-553c',
            description: `Starting from a prebuilt frontend, Jason Lengstorf guides you through the creation of a static "Corgi Up-boop App" and integrates Netlify Functions with Hasura.`,
          },
          {
            id: 185,
            type: 'course',
            title: 'JavaScript Promises in Depth',
            byline: 'Marius Schulz・1h 07m・Course',
            image:
              'https://d2eip9sf3oo6c2.cloudfront.net/series/square_covers/000/000/185/full/JSPromises_Final.png',
            path: '/courses/javascript-promises-in-depth',
            slug: 'javascript-promises-in-depth',
            description:
              'ES2015 brought a native Promise to the JavaScript standard library. In this course, we’re going to take an in-depth look at how to use promises to model various kinds of asynchronous operations.',
          },
          {
            id: 212,
            type: 'course',
            title: 'Develop a Serverless Backend using Node.js on AWS Lambda',
            byline: 'Nik Graf・15m・Course',
            image:
              'https://d2eip9sf3oo6c2.cloudfront.net/series/square_covers/000/000/212/full/Egh_NodeAWSServerless_Final.png',
            path: '/courses/develop-a-serverless-backend-using-node-js-on-aws-lambda',
            slug: 'develop-a-serverless-backend-using-node-js-on-aws-lambda',
            description:
              "You'll learn the basics on how to create a serverless API. We start off creating a simple HTTP endpoint. Then we build the first two endpoints of a REST API for a simple Todo Application backend storing the data in DynamoDB. After watching this course you will be ready to get started building you first serverless backend.",
          },
        ],
      },
      {
        id: 292804,
        type: 'playlist',
        guid: '2960',
        slug: 'create-and-deploy-a-basic-static-html-website-2960',
        topics: [
          'Getting Started with HTML',
          'Global Structure of an HTML Document',
          'Structuring Your Content',
          'CSS Media queries',
          'SVG Basics',
          'Making Changes to the DOM',
          'Deploying on Netlify ',
        ],
        pairWithResources: [
          {
            id: 392298,
            type: 'course',
            title: 'Build An Eleventy (11ty) Site From Scratch',
            byline: 'Stephanie Eckles・19m・Course',
            image:
              'https://d2eip9sf3oo6c2.cloudfront.net/tags/images/000/001/284/full/11ty.png',
            path: '/playlists/build-an-eleventy-11ty-site-from-scratch-bfd3',
            slug: 'build-an-eleventy-11ty-site-from-scratch-bfd3',
            description:
              "Start from a blank project and build up to an Eleventy site that includes a blog collection and is prepared to source content from a headless CMS. You'll also learn how to add Sass as the styling solution, complete with triggering 11ty to re-compile when the Sass changes.",
          },
          {
            id: 227,
            type: 'course',
            title: 'CSS Fundamentals',
            byline: 'Tyler Clark・33m・Course',
            image:
              'https://d2eip9sf3oo6c2.cloudfront.net/series/square_covers/000/000/227/full/EGH_CSSFundamentals_Final.png',
            path: '/courses/css-fundamentals',
            slug: 'css-fundamentals',
            description:
              'Even the most experienced developer can learn something new when it comes to using and understanding how the browser interprets CSS. In this course, we will slowly style a website according to a mocked image.',
          },
        ],
      },
      {
        id: 402036,
        type: 'playlist',
        guid: '1223',
        slug: 'composing-closures-and-callbacks-in-javascript-1223',
        multiModuleCourse: true,
        totalCourseModules: 8,
        freshness: {
          status: 'classic',
          title: 'Core Skills',
          text: 'This is an epic [JavaScript](/q/javascript) resource that goes well beyond the \n        basics and delivers expert knowledge on core patterns in the language. **Designed for the \n        advanced beginner and beyond**\n        ',
          asOf: '2021-01-24',
        },
        topics: [
          'Closures, Callbacks, and Composition',
          'Currying, Caching, and Creating operators',
          'Creating custom React Hooks',
        ],
        notes: [
          {
            url: 'https://github.com/eggheadio/eggheadio-course-notes/tree/master/composing-closures-and-callbacks-in-javascript',
          },
        ],
        pairWithResources: [
          {
            id: 241,
            type: 'course',
            title: 'Just Enough Functional Programming in JavaScript',
            byline: 'Kyle Shevlin・30m・Course',
            image:
              'https://d2eip9sf3oo6c2.cloudfront.net/series/square_covers/000/000/241/thumb/Functional_Programming.png',
            path: '/courses/just-enough-functional-programming-in-javascript',
            slug: 'just-enough-functional-programming-in-javascript',
            description:
              'Functional programming is a useful evergreen skill that will travel with you for your entire career. This course dives into the fundamentals of functional programming\n            in [JavaScript](/q/javascript) to give you a working vocabulary and patterns you can apply on the job today.',
          },
          {
            id: 353,
            type: 'course',
            title: 'Advanced JavaScript Foundations',
            byline: 'Tyler Clark・41m・Course',
            image:
              'https://d2eip9sf3oo6c2.cloudfront.net/series/square_covers/000/000/353/thumb/foundation.png',
            path: '/courses/advanced-javascript-foundations',
            slug: 'advanced-javascript-foundations',
            description:
              'This course is perfect for the **advanced beginner** that is fluent in core JavaScript and is ready to take it to the next level of expertise.',
          },
          {
            id: 185,
            type: 'course',
            title: 'JavaScript Promises in Depth',
            byline: 'Marius Schulz・1h 7m・Course',
            image:
              'https://d2eip9sf3oo6c2.cloudfront.net/series/square_covers/000/000/185/thumb/JSPromises_Final.png',
            path: '/courses/javascript-promises-in-depth',
            slug: 'javascript-promises-in-depth',
            description:
              'Promises are one of the core building blocks of modern JavaScript applications. We rely heavily on asynchronous operations\n            and have a lot of our tools at our disposal to make those operations more efficient and simpler to think about.',
          },
        ],
      },
      {
        id: 401802,
        title: 'Introduction to Callbacks, Broadcasters, and Listeners',
        multiModuletitle: 'Composing Closures and Callbacks in JavaScript',
        slug: 'introduction-to-callbacks-broadcasters-and-listeners-5bd7',
        multiModuleSlug: 'composing-closures-and-callbacks-in-javascript-1223',
        type: 'course',
        moduleResource: true,
        moduleLabel: 1,
        totalCourseModules: 8,
      },
      {
        id: 401810,
        title:
          'Establish Callback and Closure patterns Around Async Browser Behaviors',
        slug: 'establish-callback-and-closure-patterns-around-async-browser-behaviors-c813',
        type: 'course',
        multiModuletitle: 'Composing Closures and Callbacks in JavaScript',
        multiModuleSlug: 'composing-closures-and-callbacks-in-javascript-1223',
        moduleResource: true,
        moduleLabel: 2,
        totalCourseModules: 8,
      },
      {
        id: 401811,
        title:
          'Use the Callback and Closure Pattern to Build Advanced Async Behaviors',
        slug: 'use-the-callback-and-closure-pattern-to-build-advanced-async-behaviors-db15',
        type: 'course',
        multiModuletitle: 'Composing Closures and Callbacks in JavaScript',
        multiModuleSlug: 'composing-closures-and-callbacks-in-javascript-1223',
        moduleResource: true,
        moduleLabel: 3,
        totalCourseModules: 8,
      },
      {
        id: 401809,
        title: 'Implement the Pattern in Common Async Scenarios',
        slug: 'implement-the-pattern-in-common-async-scenarios-c059',
        type: 'course',
        multiModuletitle: 'Composing Closures and Callbacks in JavaScript',
        multiModuleSlug: 'composing-closures-and-callbacks-in-javascript-1223',
        moduleResource: true,
        moduleLabel: 4,
        totalCourseModules: 8,
      },
      {
        id: 401812,
        title: 'Use a Completion Pattern to enable Repetition and Sequencing',
        slug: 'use-a-completion-pattern-to-enable-repetition-and-sequencing-f0ba',
        type: 'course',
        multiModuletitle: 'Composing Closures and Callbacks in JavaScript',
        multiModuleSlug: 'composing-closures-and-callbacks-in-javascript-1223',
        moduleResource: true,
        moduleLabel: 5,
        totalCourseModules: 8,
      },
      {
        id: 401813,
        title: 'Bringing the Pattern into React',
        slug: 'bringing-the-pattern-into-react-decf',
        type: 'course',
        multiModuletitle: 'Composing Closures and Callbacks in JavaScript',
        multiModuleSlug: 'composing-closures-and-callbacks-in-javascript-1223',
        moduleResource: true,
        moduleLabel: 6,
        totalCourseModules: 8,
      },
      {
        id: 401814,
        title: 'Building Live Search Box',
        slug: 'building-light-search-box-bb64',
        type: 'course',
        multiModuletitle: 'Composing Closures and Callbacks in JavaScript',
        multiModuleSlug: 'composing-closures-and-callbacks-in-javascript-1223',
        moduleResource: true,
        moduleLabel: 7,
        totalCourseModules: 8,
      },
      {
        id: 401818,
        title: 'Implementing a Word Game with Patterns and React',
        slug: 'implementing-a-word-game-with-patterns-and-react-dcb0',
        type: 'course',
        multiModuletitle: 'Composing Closures and Callbacks in JavaScript',
        multiModuleSlug: 'composing-closures-and-callbacks-in-javascript-1223',
        moduleResource: true,
        moduleLabel: 8,
        totalCourseModules: 8,
      },
      {
        id: 405344,
        type: 'playlist',
        guid: '4038',
        slug: 'scale-react-development-with-nx-4038',
        dependencies: {
          react: '>=16.13.1',
        },
        topics: [
          'Generating projects from scratch with Nx',
          'Add Storybook to a React app',
          'Creating & sharing libraries between apps',
          'Generating a backend API with a proxy for local development',
          "Exploring an app's relationships via the Dependency Graph visualizer",
          'Preparing for unit testing with Jest and e2e testing with Cypress',
        ],
        prerequisites: [
          {
            type: 'text',
            title: 'Command line familiarity',
          },
          {
            type: 'text',
            title: 'Node.js & npm installed',
          },
          {
            type: 'text',
            title: 'Familiarity with React & Express will be helpful',
          },
        ],
        notes: [
          {
            url: 'https://github.com/eggheadio/eggheadio-course-notes/tree/master/scale-react-development-with-nx',
          },
        ],
      },
      {
        id: 409013,
        type: 'playlist',
        guid: 'be5a',
        slug: 'react-real-time-messaging-with-graphql-using-urql-and-onegraph-be5a',
        dependencies: {
          react: '>=16.13.1',
          urql: '>=1.9.7',
          graphql: '>=15.0.0',
        },
        topics: [
          'GraphQL endpoint configuration in OneGraph',
          'Using urql for GraphQL queries, mutations, and subscriptions',
          'Debugging network requests',
          'Managing authentication with React Context',
        ],
        prerequisites: [
          {
            id: 236,
            title: 'Graphql Query Language',
            path: '/courses/graphql-query-language',
            type: 'egghead_course',
            slug: 'graphql-query-language',
          },
          {
            id: 309823,
            path: '/playlists/introduction-to-urql-a-react-graphql-client-faaa2bf5',
            type: 'egghead_playlist',
            title: 'Introduction to urql',
            slug: 'introduction-to-urql-a-react-graphql-client-faaa2bf5',
          },
          {
            id: 262,
            title: 'React Context For State Management',
            path: '/courses/react-context-for-state-management',
            type: 'egghead_course',
            slug: 'react-context-for-state-management',
          },
        ],
        projects: [
          {
            label: 'Build a conversation list with GraphQL Subscriptions',
            url: 'https://github.com/eggheadio/eggheadio-course-notes/tree/master/react-real-time-messaging-with-graph-ql-using-urql-and-one-graph/exercises',
          },
        ],
        notes: [
          {
            url: 'https://github.com/eggheadio/eggheadio-course-notes/tree/master/react-real-time-messaging-with-graph-ql-using-urql-and-one-graph',
          },
        ],
      },
      {
        id: 410100,
        type: 'playlist',
        guid: '4a14',
        slug: 'headless-wordpress-4a14',
        dependencies: {
          wordpress: '>=5.5.3',
          graphql: '>=15.0.0',
        },
        topics: [
          'Configure a WordPress instance using Local',
          'Install & customize WP Plugins',
          'Create custom post types',
          'Customize and interact with data via the REST API',
          'Expose a GraphQL API, and query for exactly what you want',
          'Generate fake WordPress data',
          'Add Comment functionality',
        ],
        illustrator: {
          name: 'Kamil Khadeyev',
        },
        prerequisites: [
          {
            type: 'text',
            title: 'PHP familiarity helpful',
          },
        ],
      },
      {
        id: 410102,
        type: 'playlist',
        guid: '30a8',
        slug: 'containerize-full-stack-javascript-applications-with-docker-30a8',
        dependencies: {
          docker: '>=20.10.2',
          nginx: '>=1.19.5',
        },
        topics: [
          'Running existing Docker containers',
          'Creating Docker containers for an existing application',
          'Passing environment variables',
          'Executing bash scripts as part of container building',
          'Configure networking between containers',
          'Setting up volumes for persisting data',
          'Publishing containers to a public registry',
        ],
        illustrator: {
          name: 'Kamil Khadeyev',
        },
        pairWithResources: [
          {
            type: 'course',
            title: 'WTF is Kubernetes (K8s)',
            byline: 'Chris Biscardi・12m・Video',
            image:
              'https://d2eip9sf3oo6c2.cloudfront.net/tags/images/000/000/947/thumb/docker%282%29.png',
            path: '/lessons/docker-wtf-is-kubernetes-k8s',
            slug: 'docker-wtf-is-kubernetes-k8s',
            description:
              "Kubernetes is an API to a computer. Multiple computers actually. Here we'll talk about what K8s is, how you can choose between the plethora of K8s related hosting options, and what the process looks like for getting some containers running.",
          },
          {
            id: 120,
            type: 'course',
            title: 'Build a Twelve-Factor Node.js App with Docker',
            byline: 'Mark Shust・30m・Course',
            image:
              'https://d2eip9sf3oo6c2.cloudfront.net/series/square_covers/000/000/120/thumb/EGH_NodeDocker_1000.png',
            path: '/courses/build-a-twelve-factor-node-js-app-with-docker',
            slug: 'build-a-twelve-factor-node-js-app-with-docker',
            description:
              'Take a simple Node.js app that connects to a MongoDB database and uses an Express web server, and learn how to setup a full software development deployment process as well as how to properly “Dockerize” the app.',
          },
          {
            type: 'course',
            title:
              'Set up Hasura GraphQL engine with YugabyteDB distributed SQL',
            byline: 'Vladimir Novick・2m・Video',
            image:
              'https://d2eip9sf3oo6c2.cloudfront.net/tags/images/000/000/947/thumb/docker%282%29.png',
            path: '/lessons/postgresql-set-up-hasura-graphql-engine-with-yugabytedb-distributed-sql',
            slug: 'postgresql-set-up-hasura-graphql-engine-with-yugabytedb-distributed-sql',
            description:
              'In this lesson we will see how you can run Hasura GraphQL engine on top of YugabyteDB Distributed SQL\n\nYugabyteDB is an open source, high-performance distributed SQL database for powering global, internet-scale applications.YugabyteDB is also a cloud-native database, so it can be deployed across both public and private clouds, including Kubernetes environments. In regards to serving as a backend for microservices, YugabyteDB brings together three must-haves: a PostgreSQL-compatible SQL API, low-latency read performance, and globally distributed write scalability. YugabyteDB with its global data distribution brings data close to users for multi-region and multi-cloud deployments.',
          },
        ],
      },
      {
        id: 412781,
        type: 'playlist',
        guid: '562c',
        slug: 'create-an-ecommerce-store-with-next-js-and-stripe-checkout-562c',
        dependencies: {
          react: '>= 17.0.1',
          next: '^10.0.6',
        },
        freshness: {
          status: `fresh`,
          title: `This is a Fresh Course`,
          text: `This course is new and up to date—it is a must-watch for any developer that wants to add an e-commerce solution to their portfolio.`,
          asOf: `2021-02-15`,
        },
        topics: [
          'Starting a project with Create-Next-App',
          'Working with static and dynamic routes',
          'Managing product data in Stripe',
          'Securely managing secret keys',
          'Using the useReducer Hook and writing custom React Hooks for Cart functionality',
          'Add global state management with React Context',
          'Storing and retrieving data from localStorage',
          'Deploying with Vercel and GitHub',
        ],
        illustrator: {
          name: 'Kamil Khadeyev',
        },
        quickFacts: [
          'eCommerce is dynamic even if its on the JamStack',
          'Taking advantage of service providers can speed up the development process',
          `The faster your website is, the more likely you are to convert purchases`,
        ],
        essentialQuestions: [
          'How do I optimize the buying experience?',
          'How do I manage product inventory?',
          'What parts of the shopping experience need to be dynamic vs static?',
        ],
        pairWithResources: [
          {
            title: 'Getting Personal with Ecommerce, React, & the Static Web',
            byline: 'Colby Fayock・Talk',
            path: '/talks/react-getting-personal-with-ecommerce-react-the-static-web',
            slug: 'react-getting-personal-with-ecommerce-react-the-static-web',
            description: `In this talk, we’ll explore the challenges of ecommerce in a static world. We’ll talk about what tools are available to us and how we can take advantage of them to build dynamic web apps with a practical example of a Next.js app.`,
          },
          {
            title:
              "Product Images That Don't Byte with the Next.js Image Component",
            byline: 'Colby Fayock・Article',
            path: '/blog/product-images-that-dont-byte-with-the-nextjs-image-component',
            slug: 'product-images-that-dont-byte-with-the-nextjs-image-component',
            description: `By using the Next.js Image Component, you can add images to your project just like you would the standard img tag and be confident that you’ll be serving optimized images to your website visitors.`,
          },
          {
            title:
              'Build a Content Management System for an E-commerce Store with Next.js and Sanity',
            byline: 'Colby Fayock・Article',
            path: '/blog/build-cms-for-ecommerce-store-with-nextjs-and-sanity',
            slug: 'build-a-content-management-system-for-an-e-commerce-store-with-nextjs-and-sanity',
            description: `In this article, you will learn how to build a CMS for an ecommerce store with Next.js and Sanity.`,
          },
        ],
      },
      {
        id: 414202,
        type: 'playlist',
        guid: '553c',
        slug: 'build-a-corgi-up-boop-web-app-with-netlify-serverless-functions-and-hasura-553c',
        dependencies: {
          preact: '>=10.5.9',
          'node-fetch': '>=2.6.1',
        },
        topics: [
          'Installing & configuring the Netlify CLI for local development',
          'Managing private keys in development and production',
          'Writing Serverless functions for interacting with APIs',
          'Configuring a PostgreSQL-backed GraphQL API with Hasura',
          'Writing custom React Hooks for triggering Serverless functions',
          'Deploying a complete app with Netlify',
        ],
        prerequisites: [
          {
            type: 'text',
            title: 'Command line familiarity',
          },
          {
            type: 'text',
            title: 'Accounts for Netlify, Hasura, and Heroku',
          },
        ],
      },
      {
        id: 490,
        type: 'course',
        slug: 'build-maps-with-react-leaflet',
        dependencies: {
          react: '>=16.13.1',
          leaflet: '>=1.6.0',
        },
        topics: [
          "Using Mapbox to style the map's appearance",
          'Store location data in GeoJSON documents',
          'Customize map markers & tooltips to display metadata',
          'useEffect and useRef React Hooks',
          'Dynamic location-based data',
          'Event handling',
        ],
        prerequisites: [
          {
            id: 160,
            title: "The Beginner's Guide To React",
            path: '/courses/the-beginner-s-guide-to-react',
            type: 'egghead_course',
            slug: 'the-beginner-s-guide-to-react',
          },
        ],
        projects: [
          {
            label: 'Build a Map with React Leaflet workshop repo',
            url: 'https://github.com/colbyfayock/launchtime-workshop',
          },
        ],
        notes: [
          {
            url: 'https://github.com/eggheadio/eggheadio-course-notes/tree/master/building-maps-with-react-leaflet',
          },
        ],
      },
      {
        id: 451,
        type: 'course',
        slug: 'eject-create-react-app-and-use-gatsby-for-advanced-react-app-development',
        dependencies: {
          gatsby: '^2.22.8',
        },
        topics: [
          'Starting a Gatsby Project from scratch',
          'Programmatic page creation',
          'Static and Dynamic routing',
          'Building with page templates',
          'Passing data via pageContext',
          'Handling protected routes with mock authentication',
          'Adding & configuring Gatsby plugins',
          "React's useState and useEffect hooks",
        ],
        illustrator: {
          name: 'Kamil Khadeyev',
        },
        prerequisites: [
          {
            id: 160,
            title: "The Beginner's Guide To React",
            path: '/courses/the-beginner-s-guide-to-react',
            type: 'egghead_course',
            slug: 'the-beginner-s-guide-to-react',
          },
        ],
        projects: [
          {
            label: 'Extract pages from CRA to Gatsby',
            url: 'https://github.com/eggheadio/eggheadio-course-notes/tree/master/eject-create-react-app-and-use-gatsby-for-advanced-react-app-development/excercises/',
          },
        ],
        notes: [
          {
            url: 'https://github.com/eggheadio/eggheadio-course-notes/tree/master/eject-create-react-app-and-use-gatsby-for-advanced-react-app-development',
          },
        ],
      },
      {
        id: 450,
        type: 'course',
        slug: 'build-an-app-with-the-aws-cloud-development-kit',
        dependencies: {
          'aws-cdk': '>=1.32.2',
        },
        topics: [
          'Execute AWS Lambda functions locally',
          'Create Amazon S3 buckets with AWS CDK',
          'Attach an API Gateway to a Lambda function',
          'Add & Remove DynamoDB data with Lambda functions',
          'Manage permissions in the cloud',
          'Connect a frontend React app to AWS CDK infrastructure',
          'Deploy a finished app to S3',
          'Destroy a CDK stack',
        ],
        illustrator: {
          name: 'Kamil Khadeyev',
        },
        prerequisites: [
          {
            type: 'egghead_lesson',
            title: 'Create an AWS IAM User with Programmatic Access',
            path: '/lessons/egghead-create-an-admin-user-with-iam-and-configure-aws-cli-to-enable-programmatic-access-to-aws',
          },
          {
            type: 'egghead_playlist',
            title: 'AWS Billing and Cost Management',
            path: '/lessons/use-aws-billing-cost-management-dashboard-to-keep-your-aws-bill-to-minimum-ff0f',
          },
          {
            id: 346642,
            path: '/playlists/learn-aws-lambda-from-scratch-d29d',
            type: 'egghead_playlist',
            title: 'Learn AWS Lambda from Scratch',
            slug: 'learn-aws-lambda-from-scratch-d29d',
          },
          {
            id: 347750,
            path: '/playlists/learn-aws-serverless-application-model-aws-sam-framework-from-scratch-baf9',
            type: 'egghead_playlist',
            title: 'Learn AWS Serverless Application Model (SAM)',
            slug: 'learn-aws-serverless-application-model-aws-sam-framework-from-scratch-baf9',
          },
          {
            id: 352509,
            path: '/playlists/intro-to-dynamodb-f35a',
            type: 'egghead_playlist',
            title: 'Intro to DynamoDB',
            slug: 'intro-to-dynamodb-f35a',
          },
        ],
        projects: [
          {
            label: 'Store user input on AWS using DynamoDB',
            url: 'https://github.com/eggheadio/eggheadio-course-notes/tree/master/build-an-app-with-the-AWS-cloud-development-kit/exercises',
          },
        ],
        notes: [
          {
            url: 'https://github.com/eggheadio/eggheadio-course-notes/tree/master/build-an-app-with-the-AWS-cloud-development-kit',
          },
        ],
      },
      {
        id: 449,
        type: 'course',
        slug: 'advanced-sql-for-professional-developers',
        topics: [
          'CSV import & export',
          'Creating custom types',
          'Query Performance',
          'Transactions',
          'Pattern matching & regex',
        ],
        illustrator: {
          name: 'Kamil Khadeyev',
        },
        prerequisites: [
          {
            id: 273,
            title: 'Sql Fundamentals',
            path: '/courses/sql-fundamentals',
            type: 'egghead_course',
            slug: 'sql-fundamentals',
          },
          {
            type: 'text',
            title: 'Familiarity with the CRUD actions in SQL',
          },
        ],
        projects: [
          {
            url: 'https://github.com/eggheadio-projects/advanced-sql-for-professional-developers/tree/master/exercises',
          },
        ],
        notes: [
          {
            url: 'https://github.com/eggheadio-projects/advanced-sql-for-professional-developers',
          },
        ],
      },
      {
        id: 448,
        type: 'course',
        slug: 'write-your-first-program-with-the-rust-language',
        dependencies: {
          rust: '>=1.40.0',
        },
        topics: [
          'Types',
          'Functions & Loops',
          'User Input',
          'Package management with `cargo`',
          'Pattern Matching',
          'Error Handling',
        ],
      },
      {
        id: 447,
        type: 'course',
        slug: 'thinking-reactively-with-rxjs',
        dependencies: {
          react: '>=16.9.0',
          rxjs: '>=6.5.3',
        },
        topics: [
          'RxJS Operators: flatMap, mapTo, merge, scan, and more',
          'Creating observables',
          'Building operators',
          'Converting written requirements to code',
          'Reactive problem solving',
        ],
        illustrator: {
          name: 'Kamil Khadeyev',
        },
        prerequisites: [
          {
            id: 20,
            title: 'Introduction To Reactive Programming',
            path: '/courses/introduction-to-reactive-programming',
            type: 'egghead_course',
            slug: 'introduction-to-reactive-programming',
          },
          {
            id: 34,
            title: 'Rxjs Beyond The Basics Operators In Depth',
            path: '/playlists/rxjs-beyond-the-basics-operators-in-depth',
            type: 'egghead_course',
            slug: 'rxjs-beyond-the-basics-operators-in-depth',
          },
        ],
      },
      {
        id: 413,
        type: 'course',
        slug: 'web-security-essentials-mitm-csrf-and-xss',
        dependencies: {
          express: '>=4.17.1',
          node: '>8.9.3',
        },
        topics: [
          'Session hijacking (and how to prevent it)',
          'Using Charles proxy to simulate various attacks',
          'Securely configuring cookies and protecting the data inside them',
          "Security rules of thumb such as 'defense in depth' and 'principle of least power'",
        ],
        prerequisites: [
          {
            id: 78,
            title: 'Understand The Basics Of HTTP',
            path: '/courses/understand-the-basics-of-http',
            type: 'egghead_course',
            slug: 'understand-the-basics-of-http',
          },
          {
            id: 18,
            title: 'Getting Started With Express.js',
            path: '/courses/getting-started-with-express-js',
            type: 'egghead_course',
            slug: 'getting-started-with-express-js',
          },
        ],
      },
      {
        id: 412,
        type: 'course',
        slug: 'develop-accessible-web-apps-with-react',
        dependencies: {
          react: '>=16.10.2',
        },
        topics: [
          'The impact of in-accessible web apps different disability groups',
          'How to access web sites in the same way impaired users do',
          'Inspecting & testing tools for accessibility',
          'Write accessible and extensible UI elements & widgets',
          'Iteratively refactor & test accessibility issues',
        ],
        illustrator: {
          name: 'Aleksander Ageev',
        },
        prerequisites: [
          {
            id: 160,
            title: "The Beginner's Guide To React",
            path: '/courses/the-beginner-s-guide-to-react',
            type: 'egghead_course',
            slug: 'the-beginner-s-guide-to-react',
          },
          {
            id: 163,
            title: 'Simplify React Apps With React Hooks',
            path: '/courses/simplify-react-apps-with-react-hooks',
            type: 'egghead_course',
            slug: 'simplify-react-apps-with-react-hooks',
          },
          {
            id: 55,
            title: 'Start Building Accessible Web Applications Today',
            path: '/courses/start-building-accessible-web-applications-today',
            type: 'egghead_course',
            slug: 'start-building-accessible-web-applications-today',
          },
        ],
      },
      {
        id: 405,
        type: 'course',
        slug: 'designing-graphql-schemas-99db',
        dependencies: {
          'apollo-server': '>=2.9.7',
        },
        topics: [
          'Naming conventions for fields, queries, mutations',
          'GraphQL Aliases',
          'Benefits of nullable fields',
          'Connection Specification',
          'Mutation Payload Design',
          'Nullable vs Non-nullable fields',
          'Evolving GraphQL Schemas',
        ],
        illustrator: {
          name: 'Maxime Bourgeois',
        },
        prerequisites: [
          {
            id: 236,
            title: 'Graphql Query Language',
            type: 'egghead_course',
            path: '/courses/graphql-query-language',
          },
          {
            id: 231,
            title: 'Graphql Data In React With Apollo Client',
            type: 'egghead_course',
            path: '/courses/graphql-data-in-react-with-apollo-client',
          },
        ],
      },
      {
        id: 403,
        type: 'course',
        slug: 'introduction-to-state-machines-using-xstate',
        dependencies: {
          xstate: '>=4.6.7',
        },
        topics: [
          'Build a simple machine for a piece of UI',
          'Build Hierarchical, Parallel, and, History state machines',
          'Identify the conditions & implement transition guards',
          'Trigger Actions on transition',
          'Handle infinite states when working with inputs',
          'Understand Activities',
        ],
        illustrator: {
          name: 'Maxime Bourgeois',
        },
        prerequisites: [
          {
            id: 402,
            title: 'Construct Sturdy Uis With Xstate',
            type: 'egghead_course',
            path: '/courses/construct-sturdy-uis-with-xstate',
          },
        ],
      },
      {
        id: 402,
        type: 'course',
        slug: 'construct-sturdy-uis-with-xstate',
        dependencies: {
          xstate: '>=4.6.7',
          react: '>=16.9.0',
        },
        topics: [
          'Handling HTTP request state',
          'Blocking state transitions with guards',
          'Parallel state transitions',
          'Communicating between state machines in different components with the Actor Model',
          'Saving previous state history',
        ],
        illustrator: {
          name: 'Maxime Bourgeois',
        },
        prerequisites: [
          {
            id: 403,
            title: 'Introduction To State Machines Using Xstate',
            type: 'egghead_course',
            path: '/courses/introduction-to-state-machines-using-xstate',
          },
        ],
      },
      {
        id: 401,
        type: 'course',
        slug: 'fix-common-git-mistakes',
        topics: [
          'Change commit messages',
          'Add or remove files from a commit',
          'How and when to stash changes',
          'What a "detached HEAD" is, and how to fix it',
          'Remove secrets from a codebase',
          'How to rewrite history',
        ],
        illustrator: {
          name: 'Aleksander Ageev',
        },
        prerequisites: [
          {
            id: 50,
            title: 'Practical Git For Everyday Professional Use',
            type: 'egghead_course',
            path: '/courses/practical-git-for-everyday-professional-use',
          },
          {
            id: 247,
            title: 'Productive Git For Developers',
            type: 'egghead_course',
            path: '/courses/productive-git-for-developers',
          },
        ],
      },
      {
        id: 400,
        type: 'course',
        slug: 'use-suspense-to-simplify-your-async-ui',
        dependencies: {
          react: '0.0.0-experimental-b53ea6ca0',
        },
        topics: ['React Suspense', 'Async State'],
        goals: [
          'Simple data-fetching with Suspense',
          'Render as you fetch data',
          'useTransition for improved loading states',
          'Load images with Suspense Image',
          'Cache resources loaded through React Suspense',
          'Suspense with custom hooks',
          'Coordinate suspending components with SuspenseList',
        ],
        prerequisites: [
          {
            id: 263,
            title: 'Simplify React Apps With React Hooks',
            type: 'egghead_course',
            path: '/courses/simplify-react-apps-with-react-hooks',
          },
          {
            id: 185,
            title: 'Javascript Promises In Depth',
            type: 'egghead_course',
            path: '/courses/javascript-promises-in-depth',
          },
        ],
      },
      {
        id: 399,
        type: 'course',
        slug: 'build-an-app-with-react-suspense',
        dependencies: {
          react: 'experimental',
        },
        topics: [
          'Understand the Suspense component',
          'Set up ErrorBoundary where conditions aren’t met',
          'Devise strategies to resolve different children',
          'Import & use CreateResource to prepare for Suspense',
          'Understand concurrent mode',
          'Extract components into modules',
        ],
        prerequisites: [
          {
            id: 160,
            title: "The Beginner's Guide To React",
            path: '/courses/the-beginner-s-guide-to-react',
            type: 'egghead_course',
            slug: 'the-beginner-s-guide-to-react',
          },
          {
            id: 263,
            title: 'Simplify React Apps With React Hooks',
            type: 'egghead_course',
            path: '/courses/simplify-react-apps-with-react-hooks',
          },
          {
            id: 166,
            title: 'React Class Component Patterns',
            type: 'egghead_course',
            path: '/courses/react-class-component-patterns',
          },
          {
            id: 264,
            title: 'Reusable State And Effects With React Hooks',
            type: 'egghead_course',
            path: '/courses/reusable-state-and-effects-with-react-hooks',
          },
        ],
      },
      {
        id: 395,
        type: 'course',
        slug: 'build-a-video-chat-app-with-twilio-and-gatsby',
        dependencies: {
          gatsby: '>=2.15.7',
          react: '>=16.9.0',
          twilio: '>=3.34.0',
        },
        topics: [
          'Create dynamic web apps using Gatsby',
          'Create and configure a Twilio account for enabling video calling',
          'Initialize and manage realtime interactions in a web app',
          'Handle complex application state using React Context and Hooks',
          'Write custom React Hooks to encapsulate application logic',
        ],
        illustrator: {
          name: 'Aleksander Ageev',
        },
        prerequisites: [
          {
            id: 160,
            title: "The Beginner's Guide To React",
            path: '/courses/the-beginner-s-guide-to-react',
            type: 'egghead_course',
            slug: 'the-beginner-s-guide-to-react',
          },
          {
            id: 263,
            title: 'Simplify React Apps With React Hooks',
            type: 'egghead_course',
            path: '/courses/simplify-react-apps-with-react-hooks',
          },
          {
            id: 157,
            title: 'Build A Blog With React And Markdown Using Gatsby',
            type: 'egghead_course',
            path: '/courses/build-a-blog-with-react-and-markdown-using-gatsby',
          },
          {
            id: 311,
            title: 'Gatsby Theme Authoring',
            type: 'egghead_course',
            path: '/courses/gatsby-theme-authoring',
          },
        ],
      },
      {
        id: 355,
        type: 'course',
        slug: 'composable-gatsby-themes',
        dependencies: {
          gatsby: '>=2.16.5',
        },
        topics: [
          'Using yarn workspaces',
          'Creating theme starters',
          'Dealing with theme conflicts',
          'Styling & React Contexts',
          'Optimizing gatsby-config',
          'Advanced component shadowing techniques',
          'Lots more!',
        ],
        prerequisites: [
          {
            id: 311,
            title: 'Gatsby Theme Authoring',
            type: 'egghead_course',
            path: '/courses/gatsby-theme-authoring',
          },
        ],
      },
      {
        id: 354,
        type: 'course',
        slug: 'a-journey-with-vue-router',
        dependencies: {
          vue: '>=2.5.22',
          'vue-router': '>=3.1.3',
        },
        topics: [
          'Router installation and set up',
          'Route creation',
          'Router link creation',
          'Work with subroutes',
          'Creating a default route',
          'Access route metadata',
          'Create navigation guards',
        ],
        prerequisites: [
          {
            id: 83,
            title: 'Develop Basic Web Apps With Vue Js',
            type: 'egghead_course',
            path: '/courses/develop-basic-web-apps-with-vue-js',
          },
        ],
      },
      {
        id: 353,
        type: 'course',
        slug: 'advanced-javascript-foundations',
        topics: [
          'Primitive Types: the What, How, and Why',
          'Reference Execution with the `this` Keyword',
          'Understanding Implicit vs Explicit Coercion',
          'How Prototypal Inheritance Works in JS',
          'Use the ES6 Class Keyword',
          'Understand Lexical vs. Dynamic Scope',
          'Create New Objects with the New Keyword',
        ],
        illustrator: {
          name: 'Maxime Bourgeois',
        },
        prerequisites: [
          {
            id: 49,
            title: 'Learn ES6 Ecmascript 2015',
            type: 'egghead_course',
            slug: 'learn-es6-ecmascript-2015',
          },
        ],
      },
      {
        id: 313,
        type: 'course',
        slug: 'shareable-custom-hooks-in-react',
        dependencies: {
          react: '^16.8.6',
        },
        topics: ['Custom React Hooks', 'Test React Hooks', 'npm'],
        goals: [
          'Understanding `useState` and `useEffect`',
          'Writing a Custom Hook',
          'Extracting Hooks into their own modules',
          'Packaging a Hook',
          'Publishing a Hook to npm',
        ],
        prerequisites: [
          {
            id: 160,
            title: "The Beginner's Guide To React",
            path: '/courses/the-beginner-s-guide-to-react',
            type: 'egghead_course',
            slug: 'the-beginner-s-guide-to-react',
          },
          {
            id: 264,
            title: 'Reusable State And Effects With React Hooks',
            type: 'egghead_course',
            path: '/courses/reusable-state-and-effects-with-react-hooks',
          },
        ],
      },
      {
        id: 312,
        type: 'course',
        slug: 'immutable-javascript-data-structures-with-immer',
        dependencies: {
          immer: '^4.0.0',
          react: '^16.8.6',
        },
        topics: [
          'Immutable State',
          'Structural sharing',
          'Currying',
          'Detect and distribute changes in data',
        ],
        goals: [
          'Deep state updating',
          'Rendering immutable data',
          'Leveraging structural sharing',
          "Update immutable state with React's `useReducer` hook",
          'Create & use patches',
        ],
        prerequisites: [
          {
            type: 'text',
            title: 'Basic knowledge of immutable principles',
          },
          {
            id: 49,
            title: 'Learn ES6 Ecmascript 2015',
            type: 'egghead_course',
            path: '/courses/learn-es6-ecmascript-2015',
          },
          {
            id: 263,
            title: 'Simplify React Apps With React Hooks',
            type: 'egghead_course',
            path: '/courses/simplify-react-apps-with-react-hooks',
          },
        ],
      },
      {
        id: 311,
        type: 'course',
        slug: 'gatsby-theme-authoring',
        dependencies: {
          gatsby: '>=2.13.1',
        },
      },
      {
        id: 310,
        type: 'course',
        slug: 'javascript-es2019-in-practice',
        topics: [
          'Flatten arrays',
          'Data/string manipulation',
          'Data structure management',
          'Use flat to map and filter at the same time',
          'Choose the most performant structure',
          'Clone objects',
          'What, when, and how to polyfill',
        ],
        prerequisites: [
          {
            type: 'text',
            title: 'Usage of common command line tools',
          },
          {
            id: 49,
            title: 'Learn ES6 Ecmascript 2015',
            type: 'egghead_course',
            path: '/courses/learn-es6-ecmascript-2015',
          },
          {
            id: 15,
            title: 'Introduction To Node The Fundamentals',
            type: 'egghead_course',
            path: '/courses/introduction-to-node-the-fundamentals',
          },
        ],
        goals: [
          'use every new feature approved for ES2019',
          'understand when to use optional catch binding',
          'update legacy projects for ES2019',
        ],
      },
      {
        id: 308,
        type: 'course',
        slug: 'build-content-rich-progressive-web-apps-with-gatsby-and-contentful',
        dependencies: {
          gatsby: '^2.5.7',
        },
        topics: [
          'Data Modeling with Contentful',
          'Starting a Gatsby project',
          'Using GraphQL to query data in Gatsby',
          'Deploying a static site with Netlify',
          'Set up automatic redeployment',
        ],
        illustrator: {
          name: 'Aleksander Ageev',
        },
        prerequisites: [
          {
            id: 157,
            title: 'Build A Blog With React And Markdown Using Gatsby',
            type: 'egghead_course',
            path: '/courses/build-a-blog-with-react-and-markdown-using-gatsby',
          },
          {
            type: 'text',
            title: 'Know React and GraphQL basics',
          },
        ],
        goals: [
          'plan your data types and their connections in Contentful',
          'build a Gatsby site',
          'use GraphQL to query data from Contentful',
          'deploy your site to Netlify',
          'redeploy your site when data changes',
        ],
      },
      {
        id: 307,
        type: 'course',
        slug: 'vue-and-socket-io-for-real-time-communication',
        dependencies: {
          vue: '^2.5.21',
          'socket.io': '^2.2.0',
        },
        topics: [
          'Configuring a client for realtime communication',
          'Broadcasting messages to one or many clients',
          'Filtering messaging while targeting specific clients',
          'Identifying and grouping clients',
          'Triggering side effects',
          'Client-client, client-server, and server-server communication',
        ],
        prerequisites: [
          {
            type: 'text',
            title: 'Some basic understanding of JavaScript, HTML, and CSS',
          },
          {
            type: 'text',
            title:
              'Familiarity with Vue, npm and node, and express servers is recommended',
          },
          {
            type: 'text',
            title:
              'No previous experience with realtime communication libraries needed!',
          },
        ],
        goals: [
          'Add basic real-time functionality to any application',
          'Broadcast a message to one or many connected clients',
          'Configure socket.io with node.js',
          'Connect to a socket in vue components',
        ],
      },
      {
        id: 306,
        type: 'course',
        slug: 'test-production-ready-apps-with-cypress',
        dependencies: {
          cypress: '^3.1.5',
        },
        topics: [
          'Writing integration tests',
          'Selector best practices',
          'Seeding data into a database',
          'Mocking network requests',
          'Creating a mock backend',
        ],
        illustrator: {
          name: 'Maxime Bourgeois',
        },
        prerequisites: [
          {
            type: 'text',
            title: 'Basic knowledge of JavaScript, HTML, and CSS.',
          },
          {
            type: 'text',
            title: 'Basic understanding of client/server data transfer',
          },
          {
            type: 'text',
            title: 'Familiarity with DOM element selectors',
          },
        ],
        goals: [
          'Use Cypress to test all layers of your stack simultaneously',
          'Test the front and back ends of your application',
          'Ship apps that work like they’re supposed to, with no secret bugs for your users to discover',
        ],
      },
      {
        id: 273,
        type: 'course',
        slug: 'sql-fundamentals',
        topics: [
          'Tables and table relationships',
          'Conditional selection',
          'Data integrity and data types',
          'Aggregate functions',
          'Subqueries',
          'And more...!',
        ],
        illustrator: {
          name: 'Maxime Bourgeois',
        },
        prerequisites: [
          {
            type: 'text',
            title: 'SQL beginners welcome!',
          },
          {
            type: 'text',
            title: 'Some command line and terminal experience will be helpful',
          },
        ],
      },
      {
        id: 272,
        type: 'course',
        slug: 'vr-applications-using-react-360',
        dependencies: {
          react: '^16.3.2',
          'react-360': '^1.1.0',
        },
        topics: [
          'React concepts: components, props, state',
          'Surfaces',
          'Image distortion',
          'Runtime',
          'Models & Entities',
          'Events & handlers',
          'Native modules',
          'Animations',
        ],
        illustrator: {
          name: 'Maxime Bourgeois',
        },
        prerequisites: [
          {
            id: 160,
            title: "The Beginner's Guide To React",
            path: '/courses/the-beginner-s-guide-to-react',
            type: 'egghead_course',
            slug: 'the-beginner-s-guide-to-react',
          },
          {
            type: 'text',
            title: 'Know the basics of React and how to use npm',
          },
          {
            type: 'text',
            title: 'Have some knowledge of JavaScript and CSS',
          },
          {
            type: 'text',
            title: 'No math or WebGL required!',
          },
        ],
        goals: [
          'Start and develop a React 360 app from scratch',
          'Add text and images using `<Text/>` and `<Image/>` components',
          'Use Surfaces to add 2D interfaces in a 3D space',
          'Add external 3D objects (e.g. from Google Poly) to React 360 apps',
          'Capture user interaction with events',
          'Add animation to elements',
        ],
      },
      {
        id: 270,
        type: 'course',
        slug: 'reactive-state-management-in-angular-with-ngrx',
        dependencies: {
          angular: '^7.0.3',
          'ngrx/store': '6.1.2',
          '@nrwl/nx': '7.1.1',
          'core-js': '^2.5.4',
          hammerjs: '^2.0.8',
          jsonwebtoken: '^8.3.0',
          moment: '^2.22.2',
          rxjs: '^6.0.0',
        },
      },
      {
        id: 267,
        type: 'course',
        slug: 'redux-and-the-state-adt',
        dependencies: {
          crocks: '^0.11.0',
          esm: '^3.0.84',
          eyes: '^0.1.8',
          nodemon: '^1.18.5',
          redux: '^4.0.1',
        },
      },
      {
        id: 266,
        type: 'course',
        slug: 'progressive-web-apps-in-react-with-create-react-app',
        dependencies: {
          react: '16.6.3-16.8.6',
          'react-router-dom': '5.0.1',
          'react-scripts': '3.0.1',
          workbox: '5.0.0-alpha.0',
        },
        illustrator: {
          name: 'Alexander Yaremchuk',
        },
        reviews: [
          {
            performedOn: '2019-07-15',
            performedBy: 370397,
            scopeOfReview: 'full',
            notes: [
              {
                type: 'minor issue',
                title: 'Workbox Syntax Update',
                details:
                  "Changed `workbox.skipWaiting()` to `workbox.core.skipWaiting()` in lessons 4 -> 20 in '/src/sw.js' because of workbox update 4.0.0.\n\nChanged `workbox.clientsClaim()` to `workbox.core.clientsClaim()` in lessons 4 -> 20 in '/src/sw.js' because of workbox update 4.0.0.",
                lessons: [
                  'react-use-a-custom-service-worker-in-a-create-react-app-pwa-without-ejecting',
                  'react-pre-cache-static-resources-with-workbox-and-view-a-react-pwa-offline',
                  'react-listen-for-install-and-activate-pwa-events-in-a-service-worker',
                  'react-cache-third-party-resources-from-a-cdn-in-a-react-pwa',
                  'react-cache-json-data-in-a-react-pwa-with-workbox-and-display-it-while-offline',
                  'react-add-an-offline-status-indicator-to-a-pwa-with-react',
                  'react-show-an-error-when-a-post-or-delete-fails-in-an-offline-pwa',
                  'react-add-a-custom-app-icon-to-a-pwa-built-with-create-react-app',
                  'react-change-the-name-and-short-name-of-a-pwa-built-with-create-react-app',
                  'react-add-a-pwa-to-the-home-screen-of-an-ios-or-android-device-and-the-chrome-app-home-screen',
                  'react-add-navigation-elements-in-react-to-a-pwa-in-standalone-mode',
                  'react-access-the-camera-in-a-pwa-built-with-react',
                  'react-add-push-notifications-to-a-pwa-with-react-in-chrome-and-on-android',
                  'react-disable-text-selection-and-touch-callouts-in-a-pwa-on-ios',
                  'react-change-the-status-bar-color-on-ios-and-android-in-a-pwa',
                  'react-customize-the-splash-screen-of-a-pwa-built-with-create-react-app',
                  'react-do-a-pwa-audit-with-lighthouse-using-chrome-dev-tools',
                ],
                dependency: 'workbox',
              },
              {
                type: 'major issue',
                title: 'Chrome 68 Update Problems',
                details:
                  "Changed behavior in Chrome's application tab due to Chrome 68 update adds exceptions to the 'Add to homescreen' button which breaks lessons 12 and 13.",
                lessons: [
                  'react-change-the-name-and-short-name-of-a-pwa-built-with-create-react-app',
                  'react-add-a-pwa-to-the-home-screen-of-an-ios-or-android-device-and-the-chrome-app-home-screen',
                ],
                dependency: 'workbox',
              },
            ],
          },
        ],
      },
      {
        id: 263,
        type: 'course',
        slug: 'simplify-react-apps-with-react-hooks',
        dependencies: {
          react: '^16.7.0-alpha',
        },
        illustrator: {
          name: 'Maxime Bourgeois',
        },
      },
      {
        id: 262,
        type: 'course',
        slug: 'react-context-for-state-management',
        dependencies: {
          react: '^16.6.0',
        },
      },
      {
        id: 260,
        type: 'course',
        slug: 'build-a-neo4j-graphql-api',
        dependencies: {
          axios: '^0.18.0',
          'apollo-server': '^2.2.2',
          'graphql-request': '^1.8.2',
          'neo4j-driver': '^1.7.1',
          'neo4j-graphql-js': '^1.0.5',
        },
        illustrator: {
          name: 'Maxime Bourgeois',
        },
      },
      {
        id: 257,
        type: 'course',
        slug: 'modern-javascript-tooling-with-react',
        dependencies: {
          'prop-types': '^15.6.2',
          react: '^16.6.1',
        },
        illustrator: {
          name: 'Alexander Yaremchuk',
        },
      },
      {
        id: 246,
        type: 'course',
        slug: 'use-dom-testing-library-to-test-any-js-framework',
        dependencies: {
          dojo: '^3.0.0',
          polymer: '3.0.5',
          angular: '1.7.4',
          aurelia: '1.3.0',
          backbone: '1.3.3',
          hyperapp: '1.2.9',
          jquery: '3.3.1',
          Knockout: '3.4.2',
          mithril: '1.1.6',
          preact: '8.3.1',
          react: '16.5.1',
          stimulus: '1.1.0',
          svelte: '2.13.4',
          vue: '2.5.17',
          wigly: '0.1.9',
        },
        reviews: [
          {
            performedOn: '2018-10-02',
            performedBy: '186087',
            scopeOfReview: 'full course review',
            notes:
              'There was a different dependency used for every lesson so I included every dependency for each lesson.',
          },
        ],
      },
      {
        id: 236,
        type: 'course',
        slug: 'graphql-query-language',
        topics: [
          'Query, mutation, & subscription',
          'GraphiQL playground',
          'Schema',
          'Fragments',
          'Variables',
          'Input types, unions, interfaces, & return payloads',
          'Introspective Queries',
        ],
        goals: [
          'write any operation, top to bottom, with the GraphQL query language',
          'get data from an endpoint with a query',
          'change data with mutations',
          'subscribe to data changes',
          'reuse fields with fragments',
          'look at schema documentation in the GraphQL playground',
        ],
        freshness: {
          status: 'fresh',
          title: 'This is a Fresh Course',
          text: "This course is a must watch for anyone considering GraphQL.\n       You'll be introduced to all of the GraphQL specific jargon and be able to take this knowledge to \n          any application that is powered by GraphQL.",
          asOf: '2021-02-04',
        },
      },
      {
        id: 231,
        type: 'course',
        slug: 'graphql-data-in-react-with-apollo-client',
        freshness: {
          status: 'stale',
          title: 'Still good, but there are issues with this course',
          text: 'While much of the information in this course is useful it is showing its\n          age in the specific details. Some of the libraries demonstrated have **changed\n          versions**, and there are some **missing configuration specifics** with the server that\n          require additional investigation to follow along.\n          ',
          asOf: '2021-01-25',
        },
        dependencies: {
          'apollo-boost': '^0.1.22',
          graphql: '^14.0.2',
          react: '^16.4.2',
        },
        illustrator: {
          name: 'Aleksander Ageev',
        },
      },
      {
        id: 230,
        type: 'course',
        slug: 'build-your-own-rxjs-pipeable-operators',
        dependencies: {
          rxjs: '^6.0.0',
        },
      },
      {
        id: 228,
        type: 'course',
        slug: 'design-systems-with-react-and-typescript-in-storybook',
        dependencies: {
          react: '^16.0.0',
          'react-storybook': '^3.0.0',
        },
      },
      {
        id: 226,
        type: 'course',
        slug: 'fully-connected-neural-networks-with-keras',
        dependencies: {
          python: '^3.0.0',
        },
      },
      {
        id: 221,
        type: 'course',
        slug: 'execute-npm-package-binaries-with-the-npx-package-runner',
        dependencies: {
          npm: '>=5.2.0',
        },
        illustrator: {
          name: 'Aleksander Ageev',
        },
      },
      {
        id: 219,
        type: 'course',
        slug: 'getting-started-with-angular-elements',
        dependencies: {
          angular: '^7.0.0',
        },
        illustrator: {
          name: 'Maxime Bourgeois',
        },
        reviews: [
          {
            performedOn: '2019-02-13',
            performedBy: 186087,
            scopeOfReview: 'pre publish lesson review',
          },
        ],
      },
      {
        id: 216,
        type: 'course',
        slug: 'practical-advanced-typescript',
        dependencies: {
          typescript: '^3.0.0',
        },
      },
      {
        id: 215,
        type: 'course',
        slug: 'advanced-angular-component-patterns',
        dependencies: {
          angular: '5 - 6',
        },
      },
      {
        id: 213,
        type: 'course',
        slug: 'create-smooth-performant-transitions-with-react-transition-group-v2',
        dependencies: {
          react: '^16.0.0',
        },
      },
      {
        id: 211,
        type: 'course',
        slug: 'scalable-offline-ready-graphql-applications-with-aws-appsync-react',
        dependencies: {
          graphql: '^14.0.0',
        },
        freshness: {
          status: `stale`,
          title: `This is a Stale Course`,
          text: `There are portions of this course that have changed a bit since it was recorded, but it is still useful for developers interested in using AWS AppSync. The module versions have changed, but the API is largely the same. The React parts of this course make use of class components. If you'd like to convert the code to use Hooks, check out [Shareable Custom Hooks by Joe Previte](https://egghead.io/courses/shareable-custom-hooks-in-react).`,
          asOf: `2021-02-10`,
        },
        pairWithResources: [
          {
            title: 'Shareable Custom Hooks in React',
            byline: 'Joe Previte・30m・Course',
            image:
              'https://d2eip9sf3oo6c2.cloudfront.net/series/square_covers/000/000/313/thumb/EGH_CustomReactHooks_Final.png',
            path: '/courses/shareable-custom-hooks-in-react',
            slug: 'shareable-custom-hooks-in-react',
            description:
              "In this course, you'll work through refactoring a component to use a custom hook, and learn to apply the patterns used by the React team to your own code.",
          },
          {
            title: 'Simplify React Apps with React Hooks',
            byline: 'Kent C. Dodds・38m・Course',
            image:
              'https://d2eip9sf3oo6c2.cloudfront.net/series/square_covers/000/000/263/square_480/EGH_SimplifyHooks_Final.png',
            path: '/courses/simplify-react-apps-with-react-hooks',
            slug: 'simplify-react-apps-with-react-hooks',
            description:
              "Kent will take a React codebase that uses classes and refactor the entire thing to use function components as much as possible. You'll also look at state, side effects, async code, caching, and more.",
          },
          {
            title: 'Reusable State and Effects with React Hooks',
            byline: 'Elijah Manor・57m・Course',
            image:
              'https://d2eip9sf3oo6c2.cloudfront.net/series/square_covers/000/000/264/square_480/EGH_ReactHooks_Final_%281%29.png',
            path: '/courses/reusable-state-and-effects-with-react-hooks',
            slug: 'reusable-state-and-effects-with-react-hooks',
            description:
              "In this course, you'll see examples of converting Class Components to Function Components and how they relate to one another.",
          },
        ],
      },
      {
        id: 209,
        type: 'course',
        slug: 'beautiful-and-accessible-drag-and-drop-with-react-beautiful-dnd',
        dependencies: {
          react: '^16.0.0',
        },
      },
      {
        id: 207,
        type: 'course',
        slug: 'json-web-token-jwt-authentication-with-node-js-and-auth0',
        dependencies: {
          express: '^4.0.0',
        },
        reviews: [
          {
            performedOn: '2018-08-20',
            performedBy: 186087,
            scopeOfReview: 'full course lesson review',
            notes: [
              {
                type: 'major issue',
                dependency: 'httpster',
                lessons: [
                  'express-connect-a-front-end-to-a-secure-api-using-jwts',
                  'express-authenticate-users-in-a-single-page-application-with-auth0',
                ],
                title: 'Running a third server to get lesson 8 and 9 working.',
                details:
                  'To run lesson 8 and 9, run `httpster index.html -p 5000` in the terminal to get the third server running.',
              },
            ],
          },
        ],
      },
      {
        id: 202,
        type: 'course',
        slug: 'build-async-vue-js-apps-with-rxjs',
        dependencies: {
          rxjs: '5.5.12 - 6.4.0',
          'vue-rx': '5.0.0 - 6.1.0',
          buefy: '0.6.7 - 0.7.3',
          'sass-loader': '6.0.7 - 7.1.0',
          vue: '^2.5.13',
          'node-sass': '^4.7.2',
          'vue-template-compiler': '^2.5.13',
          '@vue/cli-plugin-babel': '^3.0.0-beta.6',
          '@vue/cli-service': '^3.0.0-beta.6',
        },
        illustrator: {
          name: 'Maxime Bourgeois',
        },
        reviews: [
          {
            performedOn: '2019-03-05',
            performedBy: 21147,
            scopeOfReview: 'full',
            notes: [
              {
                type: 'minor issue',
                title: '`.catch` replaced with `catchError`',
                details:
                  "The `.catch` method has been replaced with the `catchError` operator imported from `'rxjs/operators'`",
                lessons: [],
                dependency: 'rxjs',
              },
              {
                type: 'major issue',
                title: 'Observable methods imported separately',
                details:
                  'Methods that were once called off of `Observable` are now imported from `rxjs` directly. ',
                lessons: [],
                dependency: 'rxjs',
              },
              {
                type: 'minor issue',
                title: '`Rx` no longer has to be passed into `Vue.use`',
                details:
                  'vue-rx no longer requires `Rx` from RxJS to  be passed into `Vue.use` to simplify setup. ',
                lessons: [],
                dependency: 'vue-rx',
              },
              {
                type: 'minor issue',
                title: 'buefy.css path changed',
                details:
                  "The path to `buefy.css` is now `import 'buefy/dist/buefy.css'`",
                lessons: [],
                dependency: 'buefy',
              },
              {
                type: 'major issue',
                title: 'interval$.map replaced with interval$.pipe(map(...))',
                details:
                  "You can no longer use the `.` operator methods, instead, you must `import { ... } from 'rxjs/operators'` and then `.pipe` into the function. ",
                lessons: [],
                dependency: 'rxjs',
              },
            ],
          },
        ],
      },
      {
        id: 200,
        type: 'course',
        slug: 'integrate-ibm-domino-with-node-js',
        dependencies: {
          express: '^4.16.3',
        },
      },
      {
        id: 198,
        type: 'course',
        slug: 'test-react-components-with-enzyme-and-jest',
        dependencies: {
          react: '^16.0.0',
          enzyme: '^3.0.0',
          redux: '^3.0.0',
        },
      },
      {
        id: 197,
        type: 'course',
        slug: 'manage-react-form-state-with-redux-form',
        dependencies: {
          react: '^16.0.0',
          redux: '^3.0.0',
        },
        illustrator: {
          name: 'Maxime Bourgeois',
        },
      },
      {
        id: 194,
        type: 'course',
        slug: 'react-navigation-for-native-mobile-applications',
        dependencies: {
          react: '2.0.0 - ^6.0.0',
          'react-native': '^0.55.0',
          'react-navigation': '1.5 - 2',
        },
        reviews: [
          {
            performedOn: '2018-06-26',
            performedBy: 186087,
            scopeOfReview: 'full course lesson review',
            notes: [
              {
                type: 'major issue',
                dependency: 'react-navigation',
                title:
                  '`addNavigationHelpers` was removed, just pass an object to `navigation` prop',
                details:
                  'External API updated for React Navigation, principle behind lessons remains valid',
              },
              {
                type: 'major issue',
                dependency: 'react-navigation',
                title:
                  '`TabNavigator` was renamed to `createBottomTabNavigator`',
                details:
                  'External API updated for React Navigation, principle behind lessons remains valid',
              },
              {
                type: 'major issue',
                dependency: 'react-navigation',
                title: '`StackNavigator` was renamed to `createStackNavigator`',
                details:
                  'External API updated for React Navigation, principle behind lessons remains valid',
              },
            ],
          },
        ],
      },
      {
        id: 193,
        type: 'course',
        slug: 'optimistic-ui-updates-in-react',
        dependencies: {
          react: '^16.0.0',
        },
      },
      {
        id: 192,
        type: 'course',
        slug: 'end-to-end-testing-with-cypress',
        dependencies: {
          cypress: '^1.4.1',
          react: '^16.0.0',
        },
      },
      {
        id: 189,
        type: 'course',
        slug: 'angular-service-injection-with-the-dependency-injector-di',
        dependencies: {
          angular: '5 - 7',
          rxjs: '5 - 6',
        },
        reviews: [
          {
            performedOn: '2018-05-15',
            performedBy: 186087,
            scopeOfReview: 'full course review',
            notes: [
              {
                type: 'major issue',
                dependency: 'rxjs',
                title:
                  'rxjs-compat needs to be used if you upgraded from v5 -> v6',
                details:
                  'rxjs-compat is now necessary to run rxjs applications with angular if the application is updated from v5 -> v6 [ReactiveX/rxjs#3764](https://github.com/ReactiveX/rxjs/issues/3764)',
              },
            ],
          },
          {
            performedOn: '2018-11-23',
            performedBy: 352387,
            scopeOfReview: 'full course lesson review',
            notes: [
              {
                type: 'minor issue',
                dependency: '@angular/core',
                title: '6.0.0 -> set preserveWhitespaces to false by default',
                details:
                  "On lesson 12 This caused “Home Employees” to become “HomeEmployees”. In main.ts .bootstrapModule(AppModule, {preserveWhitespaces: true} was added to replicate the example's original configuration settings",
                documentation:
                  'https://github.com/angular/angular/blob/master/CHANGELOG.md#600-2018-05-03',
              },
            ],
          },
        ],
      },
      {
        id: 186,
        type: 'course',
        slug: 'end-to-end-testing-with-google-s-puppeteer-and-jest',
        dependencies: {
          react: '^16.2.0',
          puppeteer: '^0.13.0',
          jest: '^22.0.4',
        },
      },
      {
        id: 185,
        type: 'course',
        slug: 'javascript-promises-in-depth',
        dependencies: {
          angular: '5.0.0 - ^7.0.2',
          rxjs: '5.5.2 - ^6.3.3',
        },
        illustrator: {
          name: 'Aleksander Ageev',
        },
        reviews: [
          {
            performedOn: '2018-12-02',
            performedBy: '186087',
            scopeOfReview: 'full course review',
          },
        ],
      },
      {
        id: 183,
        type: 'course',
        slug: 'build-user-interfaces-by-composing-css-utility-classes-with-tailwind',
        dependencies: {
          gulp: '4.0.2',
          tailwindcss: '^0.1.3-1.0.5',
        },
        reviews: [
          {
            performedOn: '2019-07-26',
            performedBy: 370397,
            scopeOfReview: 'full',
            notes: [
              {
                type: 'major issue',
                title: 'Lesson 09 - Revamp',
                details:
                  'Fixed lesson 9 code to work as intended, as it was matching a previous lesson (lesson 3, I believe).',
                lessons: [],
                dependency: 'tailwindcss',
              },
              {
                type: 'minor issue',
                title: 'index.html update - lesson 05',
                details:
                  'Fixed the `index.html` on lesson 05 to match the lesson name, as it was previously matching lesson 04.',
                lessons: [],
                dependency: 'tailwindcss',
              },
              {
                type: 'major issue',
                title: 'Tailwind 1.0.0 Update - syntax',
                details:
                  'Changed `@tailwind preflight;` to `@tailwind base;` in `/src/styles.css` on all lessons.',
                lessons: [],
                dependency: 'tailwindcss',
              },
              {
                type: 'major issue',
                title: 'Tailwind 1.0.0 Update - tailwind.js',
                details:
                  'Reformatted `tailwind.js` file for every lesson due to tailwindcss 1.0.0 update. Changes referenced on the official changelog following the update guide.',
                lessons: [],
                dependency: 'tailwindcss',
              },
            ],
          },
        ],
      },
      {
        id: 180,
        type: 'course',
        slug: 'advanced-fine-grained-control-of-vue-js-components',
        dependencies: {
          vue: '^2.5.9',
        },
      },
      {
        id: 173,
        type: 'course',
        slug: 'seo-friendly-progressive-web-applications-with-angular-universal',
        dependencies: {
          angular: '^6.0.0',
          rxjs: '^6.0.0',
        },
        illustrator: {
          name: 'Maxime Bourgeois',
        },
      },
      {
        id: 171,
        type: 'course',
        slug: 'create-dynamic-components-in-angular',
        dependencies: {
          angular: '5 - 6',
          rxjs: '5 - 6',
        },
        illustrator: {
          name: 'Kamil Khadeyev',
        },
        reviews: [
          {
            performedOn: '2018-05-17',
            performedBy: 186087,
            scopeOfReview: 'full course review',
            notes: [
              {
                type: 'major issue',
                dependency: 'rxjs',
                title:
                  'rxjs-compat needs to be used if you upgraded from v5 -> v6',
                details:
                  'rxjs-compat is now necessary to run rxjs applications with angular if the application is updated from v5 -> v6 [ReactiveX/rxjs#3764](https://github.com/ReactiveX/rxjs/issues/3764)',
              },
            ],
          },
          {
            performedOn: '2018-11-23',
            performedBy: 352387,
            scopeOfReview: 'full course lesson review',
            notes: [
              {
                type: 'minor issue',
                dependency: '@angular/core',
                title: '6.0.0 -> set preserveWhitespaces to false by default',
                details:
                  "On lesson 12 This caused “Home Employees” to become “HomeEmployees”. In main.ts .bootstrapModule(AppModule, {preserveWhitespaces: true} was added to replicate the example's original configuration settings",
                documentation:
                  'https://github.com/angular/angular/blob/master/CHANGELOG.md#600-2018-05-03',
              },
            ],
          },
        ],
      },
      {
        id: 170,
        type: 'course',
        slug: 'async-await-using-typescript',
        dependencies: {
          '@types/node': '8.0.53',
        },
      },
      {
        id: 169,
        type: 'course',
        slug: 'manage-application-state-with-mobx-state-tree',
        dependencies: {
          react: '^16.0.0',
          mobx: '^3.0.0',
        },
      },
      {
        id: 166,
        type: 'course',
        slug: 'react-class-component-patterns',
        dependencies: {
          react: '^16.3.2',
          redux: '^3.7.2',
        },
      },
      {
        id: 165,
        type: 'course',
        slug: 'async-react-with-redux-saga',
        dependencies: {
          react: '^16.0.0',
          redux: '3 - 4',
          'redux-saga': '0.16.0',
        },
        reviews: [
          {
            performedOn: '2018-08-21',
            performedBy: 264612,
            scopeOfReview: 'full course lesson review',
            notes: [
              {
                type: 'major issue',
                dependency: 'redux-saga',
                title: '`import { takeLastest } from redux-saga` is deprecated',
                details:
                  'If you want to import `takeLatest`, you much use `import {takeLatest } from redux-saga/effects`',
              },
            ],
          },
        ],
      },
      {
        id: 164,
        type: 'course',
        slug: 'build-a-server-rendered-code-split-app-in-react-with-react-universal-component',
        dependencies: {
          express: '^4.0.0',
          react: '^16.0.0',
        },
      },
      {
        id: 162,
        type: 'course',
        slug: 'use-typescript-to-develop-react-applications',
        dependencies: {
          React: '16.0.0',
          TypeScript: '2.5',
          'ts-jest': '22.4.6',
          Enzyme: '3.3.0',
          webpack: '3.8.1',
        },
        reviews: [
          {
            performedOn: '2019-01-19',
            performedBy: 'Parker Landon',
            scopeOfReview: 'full course lesson review',
            notes: [
              {
                type: 'minor issue',
                title: 'Cannot find module',
                details:
                  "When running npm start, returned the following:\nTS2307: Cannot find module 'enzyme'.\nTS2307: Cannot find module 'enzyme-adapter-react-16'.\nTS2307: Cannot find module 'enzyme'.\nTS2304: Cannot find name 'test'.\nTS2304: Cannot find name 'expect'.\nTS2304: Cannot find name 'expect'.\nwebpack: Failed to compile.\nDespite these errors, I was still able to access localhost and the code worked.",
                lessons: ['react-test-react-components-and-dom-using-enzyme'],
                dependency: 'Enzyme',
              },
              {
                type: 'major issue',
                title: 'Error',
                details:
                  "User reported error:\n\nAlso for webpack.config.js I had to add 'exclude: /node_modules/' in the rules because it was giving me a weird error - this is what my module.exports looks like:\n\n   module: {\n       rules: [\n           {\n               test: /\\.tsx$/,\n               loader: 'ts-loader',\n               exclude: '/node_modules/'\n           },\n           {\n               test: /\\.ts$/,\n               loader: 'ts-loader',\n               exclude: '/node_modules/'\n           }\n       ]\n   }",
                lessons: ['react-test-react-components-and-dom-using-enzyme'],
                dependency: 'webpack',
              },
              {
                type: 'major issue',
                title: 'TypeError: EnzymeAdapter is not a constructor',
                details:
                  "This issue and solution came from a viewer:\n\n\"     2 | import * as EnzymeAdapter from 'enzyme-adapter-react-16';\n     3 |\n   > 4 | configure({ adapter: new EnzymeAdapter() });\n       |                      ^\n\n     at Object.<anonymous> (src/setupEnzyme.ts:4:22)\n\nI went to the enzyme-adapter-react-16 page and followed exactly what they said - this did it (unclear why this fixed the problem?? but it worked):\n\nimport Enzyme from 'enzyme';\nimport Adapter from 'enzyme-adapter-react-16';\n\nEnzyme.configure({ adapter: new Adapter() })\"",
                lessons: ['react-test-react-components-and-dom-using-enzyme'],
                dependency: 'Enzyme',
              },
              {
                type: 'major issue',
                title: 'validation error',
                details:
                  '"Module ts-jest in the transform option was not found."',
                lessons: ['react-test-react-components-and-dom-using-enzyme'],
                dependency: 'ts-jest',
              },
              {
                type: 'minor issue',
                title: 'Depreciation Warning',
                details:
                  'Option "setupTestFrameworkScriptFile" was replaced by configuration "setupFilesAfterEnv". New configuration is type array instead of type string.',
                lessons: ['react-test-react-components-and-dom-using-enzyme'],
                dependency: 'ts-jest',
              },
            ],
          },
        ],
      },
      {
        id: 161,
        type: 'course',
        slug: 'create-dynamic-forms-in-angular',
        dependencies: {
          angular: '^6.0.0',
          rxjs: '^6.0.0',
        },
        illustrator: {
          name: 'Voijta Holik',
        },
      },
      {
        id: 160,
        type: 'course',
        slug: 'the-beginner-s-guide-to-react',
        freshness: {
          status: 'fresh',
          title: 'This is a Fresh Course',
          text: "Thousands of people have used this course as an introduction to the core\n          concepts of [React](/q/react). It's been reviewed and updated and is relevant and \n          valid. **There isn't a better introduction to React online**.\n          ",
          asOf: '2021-01-23',
        },
        dependencies: {
          react: '>=16.12.0 - 17',
        },
        topics: [
          'what problems React can solve',
          'how React solves those problems under the hood',
          'what JSX is and how it translates to regular JavaScript function calls and objects',
          'manage state with hooks',
          'build forms',
        ],
        pairWithResources: [
          {
            id: 412,
            type: 'course',
            title: 'Develop Accessible Web Apps with React',
            byline: 'Erin Doyle・1h 28m・Course',
            image:
              'https://d2eip9sf3oo6c2.cloudfront.net/series/square_covers/000/000/412/thumb/AccessibleReact_1000.png',
            path: '/courses/develop-accessible-web-apps-with-react',
            slug: 'develop-accessible-web-apps-with-react',
            description:
              'Gain the knowledge and skills required to audit and fix accessibility issues in your applications \n            and gain a better understanding of your target users and how to approach your web app design from their perspectives',
          },
          {
            id: 263,
            type: 'course',
            title: 'Simplify React Apps with React Hooks',
            byline: 'Kent C. Dodds・38m・Course',
            image:
              'https://d2eip9sf3oo6c2.cloudfront.net/series/square_covers/000/000/263/thumb/EGH_SimplifyHooks_Final.png',
            path: '/courses/simplify-react-apps-with-react-hooks',
            slug: 'simplify-react-apps-with-react-hooks',
            description:
              "React transitioned to an API called Hooks and most consider it the way to develop production applications\n              today. This 38-minute course will help you get started and is the perfect compliment to The Beginner's Guide.",
          },
          {
            id: 490,
            type: 'course',
            title: 'Build Maps with React Leaflet',
            byline: 'Colby Fayock・47m・Course',
            image:
              'https://d2eip9sf3oo6c2.cloudfront.net/series/square_covers/000/000/490/thumb/React_Leaflet_Final.png',
            path: '/courses/build-maps-with-react-leaflet',
            slug: 'build-maps-with-react-leaflet',
            description:
              "Build an interesting map focused application using modern React practices including Hooks. \n              While you are learning you'll be able to practice with challenges. This course would be a fantastic\n              base for a [developer portfolio project](https://joelhooks.com/developer-portfolio).",
          },
        ],
      },
      {
        id: 159,
        type: 'course',
        slug: 'build-react-components-from-streams-with-rxjs-and-recompose',
        dependencies: {
          rxjs: '^5.0.0',
          react: '^16.0.0',
        },
      },
      {
        id: 158,
        type: 'course',
        slug: 'make-webpack-easy-with-poi',
        dependencies: {
          poi: '^9.0.0',
        },
      },
      {
        id: 154,
        type: 'course',
        slug: 'offline-first-progressive-web-apps-pwa-in-vue-js',
        dependencies: {
          vue: '^2.5.2',
        },
        illustrator: {
          name: 'Maxime Bourgeois',
        },
      },
      {
        id: 152,
        type: 'course',
        slug: 'leverage-new-features-of-react-16',
        dependencies: {
          react: '^16.0.0',
        },
      },
      {
        id: 150,
        type: 'course',
        slug: 'structure-angular-apps-with-angular-material-components',
        dependencies: {
          angular: '5 - 6',
          rxjs: '5 - 6',
        },
        reviews: [
          {
            performedOn: '2018-08-18',
            performedBy: 264612,
            scopeOfReview: 'Full course review',
            notes: [
              {
                type: 'major issue',
                dependency: 'rxjs',
                title:
                  'rxjs-compat needs to be used if you upgraded from v5 -> v6',
                details:
                  'rxjs-compat is now necessary to run rxjs applications with angular if the application is updated from v5 -> v6 [ReactiveX/rxjs#3764](https://github.com/ReactiveX/rxjs/issues/3764)',
              },
            ],
          },
        ],
      },
      {
        id: 147,
        type: 'course',
        slug: 'learn-http-in-angular',
        dependencies: {
          angular: '4 - 6',
          rxjs: '5 - 6',
        },
        reviews: [
          {
            performedOn: '2018-07-18',
            performedBy: 186087,
            scopeOfReview: 'Full course review',
            notes: [
              {
                type: 'minor issue',
                dependency: 'codesandbox',
                title: 'polyfills.ts file needed for online embed',
                details:
                  'When using codesandbox for examples, a polyfills.ts file is necessary and imported that into the main.ts file',
              },
              {
                type: 'major issue',
                dependency: 'rxjs',
                title:
                  'rxjs-compat needs to be used if you upgraded from v5 -> v6',
                details:
                  'rxjs-compat is now necessary to run rxjs applications with angular if the application is updated from v5 -> v6 [ReactiveX/rxjs#3764](https://github.com/ReactiveX/rxjs/issues/3764)',
              },
            ],
          },
          {
            performedOn: '2019-07-18',
            performedBy: '346356',
            scopeOfReview: 'full course lesson review',
          },
        ],
      },
      {
        id: 146,
        type: 'course',
        slug: 'create-a-news-app-with-vue-js-and-nuxt',
        dependencies: {
          nuxt: '^1.0.0-rc3',
        },
      },
      {
        id: 145,
        type: 'course',
        slug: 'functional-programming-concepts-in-purescript',
        dependencies: {
          purescript: '0.11.7 - ^0.12',
        },
        reviews: [
          {
            performedOn: '2018-11-02',
            performedBy: '352387',
            scopeOfReview: 'full course lesson review',
            notes: [
              {
                type: 'minor issue',
                dependency: 'purescript',
                title: "'id' changed to 'identity'",
                details:
                  "With the update to purescript 4.0.0, 'id' was changed to 'identity'",
                documentation:
                  'https://github.com/purescript/purescript-prelude/issues/122',
              },
            ],
          },
        ],
      },
      {
        id: 142,
        type: 'course',
        slug: 'up-and-running-with-redux-observable',
        dependencies: {
          redux: '3 - 4',
          rxjs: '5 - 6',
          react: '15 - 16',
        },
        reviews: [
          {
            performedOn: '2017-08-25',
            performedBy: 264612,
            scopeOfReview: 'full course lesson review',
            notes: [
              {
                type: 'major issue',
                dependency: 'rxjs',
                title:
                  '`rxjs-compat` was installed for backwards compatibility between rxjs v6 to v5.',
              },
              {
                type: 'major issue',
                dependency: 'rxjs',
                title:
                  'With the update to 6.2, a lot of operators had to be imported directly',
                description:
                  'The list of these operators are: debounceTime, filter, switchMap, observable/dom/ajax, delay, map, catch, observable/of, observable/throw, observable/concat, and takeUntil',
              },
              {
                type: 'major issue',
                dependency: 'rxjs',
                lessons: [
                  'react-testing-the-output-of-epics',
                  'redux-mocking-an-ajax-request-when-testing-epics',
                  'redux-use-tests-to-verify-updates-to-the-redux-store',
                ],
                title:
                  'toArray had to be imported separately, `import "rxjs/add/operator/toArray"`',
              },
            ],
          },
        ],
      },
      {
        id: 140,
        type: 'course',
        slug: 'reduce-redux-boilerplate-with-redux-actions',
        dependencies: {
          redux: '^3.6.0',
          react: '^15.5.4',
        },
      },
      {
        id: 139,
        type: 'course',
        slug: 'learn-angular-router-for-real-world-applications',
        dependencies: {
          angular: '~7.0.0',
          react: '~6.3.3',
          'core-js': '^2.5.4',
        },
      },
      {
        id: 137,
        type: 'course',
        slug: 'advanced-static-types-in-typescript',
        freshness: {
          status: 'classic',
          title: 'Core Resource',
          text: "This covers TypeScript 2.0+ and is **valid for core concepts** related to using\n          [TypeScript](/q/typescript) in modern web applications. Since it was recorded\n          many features have been added to TypeScript, but 2.0 was a huge milestone for \n          the language and you'll learn a lot. **Highly recommended.**",
          asOf: '2021-01-25',
        },
        dependencies: {
          typescript: '^2.0.0',
        },
      },
      {
        id: 136,
        type: 'course',
        slug: 'vue-js-state-management-with-vuex-and-typescript',
        dependencies: {
          vue: '^2.2.6',
          vuex: '^2.3.1',
          typescript: '^2.3.2',
        },
      },
      {
        id: 135,
        type: 'course',
        slug: 'build-a-react-app-with-redux',
        dependencies: {
          react: '15 - 16',
          redux: '3 - 4',
        },
      },
      {
        id: 133,
        type: 'course',
        slug: 'fundamentals-of-react-native-video',
        dependencies: {
          'react-native': '^0.44.2',
          'react-native-video': '^1.0.0',
        },
      },
      {
        id: 132,
        type: 'course',
        slug: 'understand-how-to-style-angular-components',
        dependencies: {
          angular: '5.2.0 - 7.2.2',
          'core-js': '2.4.1 - 2.6.3',
          rxjs: '5.5.6 - 6.3.3',
        },
        reviews: [
          {
            performedOn: '2019-01-28',
            performedBy: 'Haze Provinsal',
            scopeOfReview: 'full course lesson review',
            notes: [],
          },
        ],
      },
      {
        id: 131,
        type: 'course',
        slug: 'use-typescript-to-develop-vue-js-web-applications',
        dependencies: {
          vue: '^2.2.6',
          typescript: '^2.3.2',
        },
      },
      {
        id: 129,
        type: 'course',
        slug: 'introduction-to-the-python-3-programming-language',
        dependencies: {
          python: '3',
        },
      },
      {
        id: 128,
        type: 'course',
        slug: 'build-algorithms-using-typescript',
        dependencies: {
          typescript: '^2.1.4',
        },
      },
      {
        id: 127,
        type: 'course',
        slug: 'build-virtual-reality-experiences-using-react-vr',
        dependencies: {
          react: '15 - 16',
          'react-vr': '1 - 2',
        },
        reviews: [
          {
            performedOn: '2018-08-04',
            performedBy: 248653,
            scopeOfReview: 'full course lesson review',
            notes: [
              {
                type: 'major issue',
                dependency: 'react',
                title:
                  'React v15.5.0 PropTypes was extracted into its own package',
                details:
                  'Documentation on that: https://reactjs.org/blog/2017/04/07/react-v15.5.0.html',
              },
              {
                type: 'major issue',
                dependency: 'react',
                title: 'Importing `blacklist` from `react-native` had changed',
                details:
                  'Instead of having blacklist imported from node_modules, it is now imported from metro',
              },
            ],
          },
        ],
      },
      {
        id: 124,
        type: 'course',
        slug: 'add-internationalization-i18n-to-a-react-app-using-react-intl',
        dependencies: {
          react: '15 - 16.8.4',
          enzyme: '3.9.0',
          'enzyme-to-json': '3.3.5',
          intl: '1.2.5',
          lodash: '4.17.11',
          'react-addons-test-utils': '15.6.2',
          'react-dom': '16.8.4',
          'react-intl': '2.8.0',
          'react-router-dom': '4.3.1',
        },
        reviews: [
          {
            performedOn: '2018-04-18',
            performedBy: 264612,
            scopeOfReview: 'full course lesson review',
            notes: [
              {
                type: 'major issue',
                dependency: 'react',
                title:
                  'React v15.5.0 PropTypes was extracted into its own package',
                details:
                  'Documentation on that: https://reactjs.org/blog/2017/04/07/react-v15.5.0.html',
              },
            ],
          },
          {
            performedOn: '2019-03-07',
            performedBy: 264612,
            scopeOfReview: 'full course lesson review',
          },
        ],
      },
      {
        id: 122,
        type: 'course',
        slug: 'build-a-node-js-rest-api-with-loopback',
        dependencies: {
          loopback: '^3.0.0',
        },
      },
      {
        id: 120,
        type: 'course',
        slug: 'build-a-twelve-factor-node-js-app-with-docker',
        dependencies: {
          mongodb: '^2.2.26',
          express: '^4.16.2',
        },
        illustrator: {
          name: 'Kamil Khadeyev',
        },
      },
      {
        id: 119,
        type: 'course',
        slug: 'build-a-desktop-application-with-electron',
        dependencies: {
          axios: '^0.18.0',
          electron: '^3.0.7',
          'electron-builder': '^20.31.2',
        },
        reviews: [
          {
            performedOn: '2018-11-02',
            performedBy: 186087,
            scopeOfReview: 'full course lesson review',
          },
        ],
      },
      {
        id: 118,
        type: 'course',
        slug: 'asynchronous-javascript-with-async-await',
        dependencies: {
          typescript: '^2.3.0',
        },
      },
      {
        id: 117,
        type: 'course',
        slug: 'up-and-running-with-preact',
        dependencies: {
          preact: '7 - 8',
          'react-router': '^4.0.0',
          redux: '^3.0.0',
        },
      },
      {
        id: 116,
        type: 'course',
        slug: 'add-routing-to-react-apps-using-react-router-v4',
        dependencies: {
          react: '15 - 16',
          'react-router': '^4.0.0',
        },
      },
      {
        id: 115,
        type: 'course',
        slug: 'maintainable-css-using-typestyle',
        dependencies: {
          typescript: '2.2.1',
          react: '^15.4.2',
        },
      },
      {
        id: 114,
        type: 'course',
        slug: 'higher-order-components-with-functional-patterns-using-recompose',
        dependencies: {
          react: '^16.0.0',
        },
        reviews: [
          {
            performedOn: '2018-04-29',
            performedBy: 264612,
            scopeOfReview: 'full course lesson review',
            notes: [
              {
                type: 'major issue',
                dependency: 'react',
                title:
                  'React v15.5.0 PropTypes was extracted into its own package',
                details:
                  'Documentation on that: https://reactjs.org/blog/2017/04/07/react-v15.5.0.html',
              },
            ],
          },
        ],
      },
      {
        id: 112,
        type: 'course',
        slug: 'save-time-avoiding-common-mistakes-using-rxjs',
        dependencies: {
          rxjs: '^5.0.0',
        },
        reviews: [
          {
            performedOn: '2017-08-25',
            performedBy: 186087,
            scopeOfReview: 'full course lesson review',
          },
        ],
      },
      {
        id: 109,
        type: 'course',
        slug: 'create-your-own-twitter-bots',
        dependencies: {
          twit: '^2.2.5',
        },
      },
      {
        id: 108,
        type: 'course',
        slug: 'understand-joins-and-unions-in-postgres',
        dependencies: {
          PostgreSQL: '9.4.5',
        },
      },
      {
        id: 106,
        type: 'course',
        slug: 'use-objective-c-swift-and-java-api-s-in-nativescript-for-angular-ios-and-android-apps',
        dependencies: {
          angular: '^2.0.0',
          rxjs: '^5.0.0',
          'nativescript-angular': '^1.0.0',
        },
      },
      {
        id: 105,
        type: 'course',
        slug: 'using-postgres-window-functions',
        dependencies: {
          PostgreSQL: '^9.6',
        },
      },
      {
        id: 104,
        type: 'course',
        slug: 'get-started-with-postgresql',
        dependencies: {
          PostgreSQL: '^9.6',
        },
      },
      {
        id: 103,
        type: 'course',
        slug: 'build-basic-nativescript-app-templates',
        dependencies: {
          nativescript: '2 - 4',
        },
      },
      {
        id: 101,
        type: 'course',
        slug: 'publish-javascript-packages-on-npm',
        dependencies: {
          'babel-cli': '^6.18.0',
        },
      },
      {
        id: 98,
        type: 'course',
        slug: 'get-started-with-elasticsearch',
        dependencies: {
          elasticsearch: '^12.1.3',
        },
      },
      {
        id: 96,
        type: 'course',
        slug: 'real-world-react-native-animations',
        dependencies: {
          react: '^15.4.0',
          'react-native': '0.38.0',
        },
      },
      {
        id: 95,
        type: 'course',
        slug: 'building-apps-with-ionic-2',
        dependencies: {
          angular: '2 - 6',
          'ionic-angular': '2 - 3',
        },
        reviews: [
          {
            performedOn: '2018-08-09',
            performedBy: 186087,
            scopeOfReview: 'Full course review',
            notes: [
              {
                type: 'major issue',
                dependency: 'ionic',
                lessons: [
                  'angular-build-your-first-page-component-with-ionic-2',
                  'angular-use-sliding-gestures-to-reorder-an-ionic-2-list',
                  'angular-use-the-ionic-cli-to-generate-angular-2-mobile-components',
                  'angular-fetch-data-from-an-api-using-angular-2-http-module',
                  'angular-lazy-load-data-with-ionic-2',
                  'angular-navigate-between-mobile-screens-with-the-ionic-2-navcontroller',
                  'angular-preview-an-angular-2-mobile-app-with-ionic-lab',
                  'angular-create-angular-2-mobile-card-based-layouts-with-ionic-2',
                  'angular-use-ionic-2-navcontroller-to-manipulate-app-history',
                  'angular-create-an-overlay-component-with-the-ionic-2-overlay-api',
                  'angular-create-a-native-mobile-side-menu-layout-in-ionic-2',
                ],
                title: 'runtimeError `webpackJsonp is not defined`',
                details:
                  'Add in `<script src="build/vendor.js"></script>` in the index.html file',
              },
            ],
          },
        ],
      },
      {
        id: 92,
        type: 'course',
        slug: 'build-your-first-production-quality-react-app',
        dependencies: {
          react: '15 - 16',
        },
        reviews: [
          {
            performedOn: '2018-04-05',
            performedBy: 264612,
            scopeOfReview: 'full course lesson review',
            notes: [
              {
                type: 'major issue',
                dependency: 'react',
                lessons: [
                  'react-validate-component-input-with-prop-types-in-react',
                  'react-add-data-to-a-list-without-mutations',
                  'react-update-react-application-state-from-form-input',
                  'react-prevent-empty-form-values-with-conditional-submit-handlers',
                  'react-use-es2016-property-initializer-syntax-in-es6-classes',
                  'react-update-data-in-a-list-without-mutations',
                  'react-pass-data-to-event-handlers-with-partial-function-application',
                  'react-create-a-pipe-function-to-enable-function-composition',
                  'react-remove-items-from-a-list-without-mutations',
                  'react-build-a-link-component-to-navigate-to-routes-in-react',
                  'react-use-react-context-to-manage-application-state-through-routes',
                  'react-filter-data-on-property-values-in-react',
                  'react-keep-react-application-state-in-sync-with-browser-history',
                  'react-load-data-for-react-from-a-server-with-fetch',
                  'react-save-data-to-the-server-with-fetch-in-react',
                  'react-show-temporary-messages-in-a-react-application',
                  'react-update-data-on-the-server-with-fetch-in-react',
                  'react-delete-data-on-the-server-with-fetch-in-react',
                ],
                title:
                  'React v15.5.0 PropTypes was extracted into its own package',
                details:
                  'Documentation: https://reactjs.org/blog/2017/04/07/react-v15.5.0.html',
              },
              {
                type: 'major issue',
                dependency: 'react',
                title: 'Router prop change',
                details:
                  '`browserHistory` must be imported and used on `<Router>`',
              },
            ],
          },
        ],
      },
      {
        id: 91,
        type: 'course',
        slug: 'understand-angular-directives-in-depth',
        dependencies: {
          angular: '^6.0.0',
        },
        reviews: [
          {
            performedOn: '2018-08-13',
            performedBy: 186087,
            scopeOfReview: 'full course review',
            notes: [
              {
                type: 'major issue',
                dependency: 'angular',
                lessons: [
                  'angular-use-template-elements-in-angular',
                  'angular-create-elements-from-template-elements-with-ngtemplateoutlet-in-angular',
                  'angular-create-a-template-storage-service-in-angular',
                ],
                title: '`template` has been changed to `ng-template`',
                details:
                  '`template` has been deprecated since version 4.0. use `ng-template` instead.',
              },
              {
                type: 'major issue',
                dependency: 'angular',
                lessons: [
                  'angular-create-elements-from-template-elements-with-ngtemplateoutlet-in-angular',
                ],
                title:
                  '`ngOutletContext` has been removed as it was deprecated since v4.',
                details:
                  'Use `ngTemplateOutletContext` instead of `ngOutletContext`.',
              },
              {
                type: 'minor issue',
                dependency: 'codesandbox',
                title: 'polyfills.ts file needed for online embed',
                details:
                  'To be able to run this code in codesandbox.io, a polyfills.ts file is necessary.',
              },
            ],
          },
        ],
      },
      {
        id: 90,
        type: 'course',
        slug: 'build-a-react-native-todo-application',
        dependencies: {
          react: '^15.0.0',
          'react-native': '0.35 - 0.37',
        },
      },
      {
        id: 89,
        type: 'course',
        slug: 'natural-language-processing-in-javascript-with-natural',
        dependencies: {
          natural: '^0.4.0',
        },
      },
      {
        id: 87,
        type: 'course',
        slug: 'learn-the-best-and-most-useful-scss',
        dependencies: {
          'node-sass': '^3.11',
        },
      },
      {
        id: 85,
        type: 'course',
        slug: 'animate-react-native-ui-elements',
        dependencies: {
          react: '^15.0.0',
          'react-native': '0.35 - 0.39',
        },
      },
      {
        id: 84,
        type: 'course',
        slug: 'create-native-mobile-apps-with-nativescript-for-angular',
        dependencies: {
          angular: '^2.0.0',
          rxjs: '^5.0.0',
        },
      },
      {
        id: 83,
        type: 'course',
        slug: 'develop-basic-web-apps-with-vue-js',
        dependencies: {
          vue: '^2.5.16',
        },
      },
      {
        id: 80,
        type: 'course',
        slug: 'build-a-graphql-server',
        dependencies: {
          graphql: '0.7 - 14',
        },
      },
      {
        id: 77,
        type: 'course',
        slug: 'build-interactive-javascript-charts-with-d3-v4',
        dependencies: {
          d3: '^4.1.1',
        },
      },
      {
        id: 76,
        type: 'course',
        slug: 'build-an-angular-instant-search-component',
        dependencies: {
          angular: '^2.0.0',
          rxjs: '^5.0.0',
        },
      },
      {
        id: 72,
        type: 'course',
        slug: 'professor-frisby-introduces-composable-functional-javascript',
        freshness: {
          status: 'classic',
          title: 'This is a Classic Resource',
          text: 'Dr. Boolean has created a modern JavaScript masterpiece with this\n          creative and entertaining lesson in functional programming. It is both quirky\n          and wonderful–delivering seriously useful information without taking itself too\n          seriously. Recorded in 2016, this delightful resource will be **just as valid in \n          2030** as it was then. Enjoy.\n          ',
          asOf: '2021-01-24',
        },
        dependencies: {
          javascript: '∞',
        },
        pairWithResources: [
          {
            id: 241,
            type: 'course',
            title: 'Just Enough Functional Programming in JavaScript',
            byline: 'Kyle Shevlin・30m・Course',
            image:
              'https://d2eip9sf3oo6c2.cloudfront.net/series/square_covers/000/000/241/thumb/Functional_Programming.png',
            path: '/courses/just-enough-functional-programming-in-javascript',
            slug: 'just-enough-functional-programming-in-javascript',
            description:
              'Functional programming is a useful evergreen skill that will travel with you for your entire career. This course dives into the fundamentals of functional programming\n              in [JavaScript](/q/javascript) to give you a working vocabulary and patterns you can apply on the job today.',
          },
          {
            id: 353,
            type: 'course',
            title: 'Advanced JavaScript Foundations',
            byline: 'Tyler Clark・41m・Course',
            image:
              'https://d2eip9sf3oo6c2.cloudfront.net/series/square_covers/000/000/353/thumb/foundation.png',
            path: '/courses/advanced-javascript-foundations',
            slug: 'advanced-javascript-foundations',
            description:
              'This course is perfect for the **advanced beginner** that is fluent in core JavaScript and is ready to take it to the next level of expertise.',
          },
          {
            id: 185,
            type: 'course',
            title: 'JavaScript Promises in Depth',
            byline: 'Marius Schulz・1h 7m・Course',
            image:
              'https://d2eip9sf3oo6c2.cloudfront.net/series/square_covers/000/000/185/thumb/JSPromises_Final.png',
            path: '/courses/javascript-promises-in-depth',
            slug: 'javascript-promises-in-depth',
            description:
              'Promises are one of the core building blocks of modern JavaScript applications. We rely heavily on asynchronous operations\n              and have a lot of our tools at our disposal to make those operations more efficient and simpler to think about.',
          },
        ],
      },
      {
        id: 71,
        type: 'course',
        slug: 'build-node-js-apis-with-openapi-spec-swagger',
        dependencies: {
          express: '^4.12.3',
        },
      },
      {
        id: 70,
        type: 'course',
        slug: 'build-angular-1-x-apps-with-redux',
        dependencies: {
          angular: '1.5.7',
        },
      },
      {
        id: 66,
        type: 'course',
        slug: 'angular-dependency-injection-di-explained',
        dependencies: {
          angular: '2 - 6',
          rxjs: '5 - 6',
        },
      },
      {
        id: 65,
        type: 'course',
        slug: 'animate-angular-web-applications',
        dependencies: {
          angular: '2 - ~8.1.1',
          rxjs: '5 - ~6.4.0',
        },
        reviews: [
          {
            performedOn: '2019-07-16',
            performedBy: 'Parker Landon',
            scopeOfReview: 'full',
          },
        ],
      },
      {
        id: 64,
        type: 'course',
        slug: 'learn-the-basics-of-angular-forms',
        dependencies: {
          angular: '2 - 6',
          rxjs: '5 - 6',
        },
        reviews: [
          {
            performedOn: '2018-07-24',
            performedBy: 186087,
            scopeOfReview: 'Full course Review',
            notes: [
              {
                type: 'minor issue',
                dependency: 'no dependency',
                title: 'polyfills.ts file needed for online embed',
                details:
                  'When using codesandbox for examples, a polyfills.ts file is necessary and imported that into the main.ts file',
              },
              {
                type: 'major issue',
                dependency: 'rxjs',
                title:
                  'rxjs-compat needs to be used if you upgraded from v5 -> v6',
                details:
                  'rxjs-compat is now necessary to run rxjs applications with angular if the application is updated from v5 -> v6 [ReactiveX/rxjs#3764](https://github.com/ReactiveX/rxjs/issues/3764)',
              },
            ],
          },
        ],
      },
      {
        id: 63,
        type: 'course',
        slug: 'manage-ui-state-with-the-angular-router',
        dependencies: {
          angular: '2 - 4',
          rxjs: '^5.0.0',
        },
      },
      {
        id: 62,
        type: 'course',
        slug: 'using-angular-2-patterns-in-angular-1-x-apps',
        dependencies: {
          angular: '^1.5.7',
        },
      },
      {
        id: 58,
        type: 'course',
        slug: 'manage-complex-state-in-react-apps-with-mobx',
        dependencies: {
          mobx: '2 - 5',
          react: '15 - 16',
        },
        reviews: [
          {
            performedOn: '2018-07-17',
            performedBy: 248653,
            scopeOfReview: 'full course lesson review',
            notes: [
              {
                type: 'major issue',
                title: 'removed line- “useStrict(true);',
                details: 'The useStrict terminology is no longer recognized',
              },
              {
                type: 'major issue',
                title: 'Keys and values now return iterators',
                details:
                  'keys and values now return iterators, to return an array, use Array.from with the iterator https://github.com/mobxjs/mobx/issues/1488',
              },
            ],
          },
        ],
      },
      {
        id: 56,
        type: 'course',
        slug: 'building-angular-components',
        dependencies: {
          angular: '2 - 6',
          rxjs: '5 - 6',
        },
        reviews: [
          {
            performedOn: '2018-07-24',
            performedBy: 186087,
            scopeOfReview: 'full course review',
            notes: [
              {
                type: 'major issue',
                dependency: 'angular',
                lessons: [
                  'angular-generate-and-render-angular-2-template-elements-in-a-component',
                  'angular-set-values-on-generated-angular-2-templates-with-template-context',
                ],
                title: '`template` has been changed to `ng-template`',
                details:
                  '`template` has been deprecated since version 4.0. use `ng-template` instead.',
              },
              {
                type: 'minor issue',
                dependency: 'codesandbox',
                title: 'polyfills.ts file needed for online embed',
                details:
                  'To be able to run this code in codesandbox.io, a polyfills.ts file is necessary.',
              },
            ],
          },
        ],
      },
      {
        id: 54,
        type: 'course',
        slug: 'use-webpack-2-for-production-javascript-applications',
        dependencies: {
          webpack: '^2.1.0',
          babel: '6.5.2',
        },
      },
      {
        id: 53,
        type: 'course',
        slug: 'building-react-applications-with-idiomatic-redux',
        dependencies: {
          react: '^15.0.0',
          redux: '^3.0.0',
        },
      },
      {
        id: 52,
        type: 'course',
        slug: 'up-and-running-with-typescript',
        dependencies: {
          typescript: '^3.2.1',
        },
      },
      {
        id: 48,
        type: 'course',
        slug: 'use-types-effectively-in-typescript',
        dependencies: {
          typescript: '^2.0.0',
        },
      },
      {
        id: 47,
        type: 'course',
        slug: 'build-redux-style-applications-with-angular-rxjs-and-ngrx-store',
        dependencies: {
          angular: '2 - 6',
          rxjs: '5 - 6',
        },
        reviews: [
          {
            performedOn: '2018-07-18',
            performedBy: 186087,
            scopeOfReview: 'Full course review',
            notes: [
              {
                type: 'minor issue',
                dependency: 'codesandbox',
                title: 'polyfills.ts file needed for online embed',
                details:
                  'When using codesandbox for examples, a polyfills.ts file is necessary and imported that into the main.ts file',
              },
              {
                type: 'major issue',
                dependency: 'rxjs',
                title:
                  'rxjs-compat needs to be used if you upgraded from v5 -> v6',
                details:
                  'rxjs-compat is now necessary to run rxjs applications with angular if the application is updated from v5 -> v6 [ReactiveX/rxjs#3764](https://github.com/ReactiveX/rxjs/issues/3764)',
              },
            ],
          },
        ],
      },
      {
        id: 44,
        type: 'course',
        slug: 'start-using-elm-to-build-web-applications',
        dependencies: {
          elm: '0.17',
        },
        reviews: [
          {
            performedOn: '2018-12-14',
            performedBy: '21147',
            scopeOfReview: 'quick course review',
            notes: [
              {
                type: 'major issue',
                title: 'elm-lang moved to elm',
                details:
                  'Since version 0.19 elm-lang/* packages have been moved over to elm/*',
              },
              {
                type: 'major issue',
                title: 'Elm.MODULENAME.fullscreen deprecated',
                details:
                  'Elm.MODULENAME.fullscreen has been deprecated in favor of Elm.MODULENAME.init',
              },
            ],
          },
        ],
      },
      {
        id: 43,
        type: 'course',
        slug: 'getting-started-with-react-router-v3',
        dependencies: {
          react: '0.14 - 16',
          'react-router': '^3.0.0',
        },
        reviews: [
          {
            performedOn: '2018-04-05',
            performedBy: 231890,
            scopeOfReview: 'full course lesson review',
            notes: [
              {
                type: 'major issue',
                dependency: 'react',
                title:
                  'React v15.5.0 PropTypes was extracted into its own package',
                details:
                  'Documentation on that: https://reactjs.org/blog/2017/04/07/react-v15.5.0.html',
              },
            ],
          },
        ],
      },
      {
        id: 41,
        type: 'course',
        slug: 'use-higher-order-observables-in-rxjs-effectively',
        dependencies: {
          rxjs: '^5.0.0',
        },
        reviews: [
          {
            performedOn: '2017-08-25',
            performedBy: 186087,
            scopeOfReview: 'full course lesson review',
          },
        ],
      },
      {
        id: 40,
        type: 'course',
        slug: 'rxjs-subjects-and-multicasting-operators',
        dependencies: {
          rxjs: '^5.0.0',
        },
        reviews: [
          {
            performedOn: '2017-08-28',
            performedBy: 186087,
            scopeOfReview: 'full course lesson review',
          },
        ],
      },
      {
        id: 39,
        type: 'course',
        slug: 'rxjs-beyond-the-basics-creating-observables-from-scratch',
        dependencies: {
          rxjs: '^5.0.0',
        },
        reviews: [
          {
            performedOn: '2017-08-28',
            performedBy: 186087,
            scopeOfReview: 'full course lesson review',
          },
        ],
      },
      {
        id: 37,
        type: 'course',
        slug: 'introduction-to-node-servers-with-hapi-js',
        dependencies: {
          hapi: '^11.0.3',
        },
      },
      {
        id: 35,
        type: 'course',
        slug: 'step-by-step-async-javascript-with-rxjs',
        dependencies: {
          rxjs: '^5.0.0',
        },
        illustrator: {
          name: 'Maxime Bourgeois',
        },
        reviews: [
          {
            performedOn: '2017-08-28',
            performedBy: 186087,
            scopeOfReview: 'full course lesson review',
          },
        ],
      },
      {
        id: 34,
        type: 'course',
        slug: 'rxjs-beyond-the-basics-operators-in-depth',
        freshness: {
          status: `classic`,
          title: `Still good, but there are issues with this course`,
          text: `While much of the information in this course is useful it is showing its age in specific details. In this course, the code for RxJS has updated from '5.0.0' to '6.3.3'. The operators still achieve the same outcome, the way you use them are slightly different. Also, ES5 has been updated to ES6.`,
          asOf: `2021-01-25`,
        },
        dependencies: {
          rxjs: '^6.3.3',
        },
        reviews: [
          {
            performedOn: '2021-01-25',
            performedBy: 186087,
            scopeOfReview: 'full course lesson review',
          },
        ],
      },
      {
        id: 33,
        type: 'course',
        slug: 'introduction-to-angular-material',
        dependencies: {
          'angular-material': '^1.1.12',
          angular: '^1.5.6',
        },
      },
      {
        id: 31,
        type: 'course',
        slug: 'building-an-angular-1-x-ionic-application',
        dependencies: {
          angular: '1.5.5',
          ionic: '1.2.1',
        },
      },
      {
        id: 30,
        type: 'course',
        slug: 'cycle-js-fundamentals',
        dependencies: {
          cycle: '^3.1',
        },
      },
      {
        id: 27,
        type: 'course',
        slug: 'react-testing-cookbook',
        dependencies: {
          react: '0.14 - 15',
          redux: '^3.0.0',
        },
      },
      {
        id: 26,
        type: 'course',
        slug: 'creating-custom-web-elements-with-polymer-2',
        dependencies: {
          polymer: '1.2 - 1.11',
        },
      },
      {
        id: 25,
        type: 'course',
        slug: 'getting-started-with-redux',
        freshness: {
          status: 'classic',
          title: 'This is a Classic Resource',
          text: "Redux has changed a lot since Dan first recorded this course in 2015, but \n          this is still an essential watch, if not directly applicable to your \n          application. This is **the source** that inspired so much in the\n          React ecosystem and beyond. **We strongly recommend this course for all modern web developers**. It's\n          excellent.\n          ",
          asOf: '2021-01-23',
        },
        dependencies: {
          react: '0.14 - 17',
          redux: '3 - 4',
        },
        reviews: [
          {
            performedOn: '2018-04-19',
            performedBy: 186087,
            scopeOfReview: 'full course lesson review',
          },
        ],
      },
      {
        id: 24,
        type: 'course',
        slug: 'react-flux-architecture-es6',
        dependencies: {
          react: '0.14 - 16',
          flux: '2 - 3',
          'react-router': '1 - 3',
        },
        illustrator: {
          name: 'Maxime Bourgeois',
        },
        reviews: [
          {
            performedOn: '',
            performedBy: 186087,
            dependency: 'react',
            scopeOfReview: 'full course lesson review',
            notes: [
              {
                type: 'major issue',
                title:
                  'React v15.5.0 PropTypes was extracted into its own package',
                details:
                  'Documentation on that: https://reactjs.org/blog/2017/04/07/react-v15.5.0.html',
              },
            ],
          },
          {
            performedOn: '2018-05-18',
            performedBy: 264612,
            dependency: 'react-router',
            scopeOfReview: 'full course lesson review',
            notes: [
              {
                type: 'major issue',
                title: 'import change',
                lessons: [
                  'react-flux-architecture-routing-with-react-router-1-0',
                  'react-flux-architecture-component-wrap-up',
                  'react-flux-architecture-dumb-stores',
                ],
                details:
                  "`browserHistory` must be imported and used on `<Router>` to avoid `Cannot read property  'location' of undefined`",
              },
            ],
          },
        ],
      },
      {
        id: 23,
        type: 'course',
        slug: 'get-started-with-angular',
        dependencies: {
          angular: '5 - 6',
          rxjs: '5 - 6',
        },
      },
      {
        id: 22,
        type: 'course',
        slug: 'learn-how-to-use-immutable-js',
        dependencies: {
          Lodash: '7.1.0',
          Jest: '^24.5.0',
          react: '7.0.0',
          'react-dom': '7.1.0',
          immutable: '7.0.0',
          '@babel/core': '7.4.0',
          '@babel/preset-env': '^7.4.2',
          'parcel-bundler': '^1.6.1',
        },
        illustrator: {
          name: 'Maxime Bourgeois',
        },
        reviews: [
          {
            performedOn: '2019-02-27',
            performedBy: 264612,
            scopeOfReview: 'full course lesson review',
            notes: [
              {
                type: 'minor issue',
                title: 'CodeSandbox compatibility',
                details:
                  'Removed JSBin support and added support for CodeSandbox',
                lessons: 'all',
                dependency: 'Lodash, Mocah, Chai, react, react-dom, immutable',
              },
            ],
          },
        ],
      },
      {
        id: 20,
        type: 'course',
        slug: 'introduction-to-reactive-programming',
        dependencies: {
          rxjs: '4 - 5',
        },
        reviews: [
          {
            performedOn: '2017-04-19',
            performedBy: 186087,
            scopeOfReview: 'full course lesson review',
            notes: [
              {
                type: 'major issue',
                dependency: 'rxjs',
                title:
                  '`buffer` has been split into: `buffer`, `bufferWhen`, and `bufferToggle`',
                details:
                  'To reduce polymorphism and get better performance out of operators, some operators have been split into more than one operator',
              },
              {
                type: 'major issue',
                dependency: 'rxjs',
                title:
                  '`debounce` has been split into: `debounce` and `debounceTime`',
                details:
                  'To reduce polymorphism and get better performance out of operators, some operators have been split into more than one operator',
              },
              {
                type: 'major issue',
                dependency: 'rxjs',
                title:
                  'flatMap is now an alias for mergeMap but will work just the same.',
                details:
                  'To reduce polymorphism and get better performance out of operators, some operators have been split into more than one operator',
              },
            ],
          },
        ],
      },
      {
        id: 18,
        type: 'course',
        slug: 'getting-started-with-express-js',
        dependencies: {
          express: '^4.13.1',
        },
      },
      {
        id: 14,
        type: 'course',
        slug: 'react-native-fundamentals',
        dependencies: {
          react: '0.14 - 16',
          'react-native': '0.3 - 0.53',
        },
        reviews: [
          {
            performedOn: '2018-02-08',
            performedBy: 248653,
            scopeOfReview: 'full course lesson review',
            notes: [
              {
                dependency: 'react',
                type: 'major issue',
                title:
                  'React v15.5.0 PropTypes was extracted into its own package',
                details:
                  'Documentation on that: https://reactjs.org/blog/2017/04/07/react-v15.5.0.html',
              },
            ],
          },
          {
            dependency: 'react-native',
            performedOn: '2018-02-08',
            performedBy: 248653,
            scopeOfReview: 'full course lesson review',
            notes: [
              {
                type: 'major issue',
                title:
                  '0.46 in React Native breaks the build configuration in Xcode',
              },
            ],
          },
          {
            performedOn: '2017-06-25',
            performedBy: 186087,
            scopeOfReview: 'full course lesson review',
            notes: [
              {
                dependency: 'react-native',
                type: 'major issue',
                title:
                  'react-native-xcode.sh now lives in a different location',
                details:
                  'https://github.com/facebook/react-native/releases/tag/v0.46.4',
              },
            ],
          },
        ],
      },
      {
        id: 12,
        type: 'course',
        slug: 'angular-automation-with-gulp',
        dependencies: {
          gulp: '^3.8.11',
          angular: '^1.4.7',
        },
      },
      {
        id: 11,
        type: 'course',
        slug: 'asynchronous-programming-the-end-of-the-loop',
        dependencies: {
          rxjs: '^2.3',
        },
        illustrator: {
          name: 'Maxime Bourgeois',
        },
      },
      {
        id: 7,
        type: 'course',
        slug: 'angularjs-authentication-with-jwt',
        dependencies: {
          angular: '^1.2.25',
        },
      },
      {
        id: 6,
        type: 'course',
        slug: 'angularjs-fundamentals',
        dependencies: {
          angular: '^1.6.5',
        },
      },
      {
        id: 4,
        type: 'course',
        slug: 'angularjs-data-modeling',
        dependencies: {
          angular: '^1.2.23',
        },
      },
      {
        id: 3,
        type: 'course',
        slug: 'start-learning-react',
        dependencies: {
          react: '0.14 - 16',
        },
      },
      {
        id: 2,
        type: 'course',
        slug: 'learn-protractor-testing-for-angularjs',
        dependencies: {
          protractor: '^1.4.0',
          angular: '^1.2.8',
        },
      },
      {
        id: 1,
        type: 'course',
        slug: 'use-d3-v3-to-build-interactive-charts-with-javascript',
        dependencies: {
          d3: '^3.5',
        },
      },
    ],
    {slug: courseSlug},
  )
export default courseDependencyData
