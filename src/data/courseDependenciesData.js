import {find} from 'lodash'

const courseDependencyData = (courseSlug) =>
  find(
    [
      {
        slug:
          'containerize-full-stack-javascript-applications-with-docker-30a8',
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
      },
      {
        slug:
          'build-a-corgi-up-boop-web-app-with-netlify-serverless-functions-and-hasura-553c',
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
            label: 'Command line familiarity',
          },
          {
            type: 'text',
            label: 'Accounts for Netlify, Hasura, and Heroku',
          },
        ],
      },
      {
        slug: 'create-an-ecommerce-store-with-next-js-and-stripe-checkout-562c',
        dependencies: {
          react: '>= 17.0.1',
          next: '>=9.5.5',
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
        prerequisites: [
          {
            type: 'egghead_course',
            slug: 'the-beginner-s-guide-to-react',
          },
        ],
        projects: [
          {
            label:
              'Create an eCommerce Store with Next.js and Stripe Checkout Workshop Repo',
            url: 'https://github.com/colbyfayock/space-jelly-store-workshop/',
          },
        ],
      },
      {
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
            label: 'PHP familiarity helpful',
          },
        ],
      },
      {
        slug:
          'react-real-time-messaging-with-graphql-using-urql-and-onegraph-be5a',
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
            type: 'egghead_course',
            slug: 'graphql-query-language',
          },
          {
            type: 'egghead_playlist',
            label: 'Introduction to urql',
            slug: 'introduction-to-urql-a-react-graphql-client-faaa2bf5',
          },
          {
            type: 'egghead_course',
            slug: 'react-context-for-state-management',
          },
        ],
        projects: [
          {
            label: 'Build a conversation list with GraphQL Subscriptions',
            url:
              'https://github.com/eggheadio/eggheadio-course-notes/tree/master/react-real-time-messaging-with-graph-ql-using-urql-and-one-graph/exercises',
          },
        ],
        notes: [
          {
            url:
              'https://github.com/eggheadio/eggheadio-course-notes/tree/master/react-real-time-messaging-with-graph-ql-using-urql-and-one-graph',
          },
        ],
      },
      {
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
            label: 'Command line familiarity',
          },
          {
            type: 'text',
            label: 'Node.js & npm installed',
          },
          {
            type: 'text',
            label: 'Familiarity with React & Express will be helpful',
          },
        ],
        notes: [
          {
            url:
              'https://github.com/eggheadio/eggheadio-course-notes/tree/master/scale-react-development-with-nx',
          },
        ],
      },
      {
        slug: 'composing-closures-and-callbacks-in-javascript-1223',
        topics: [
          'Closures, Callbacks, and Composition',
          'Currying, Caching, and Creating operators',
          'Creating custom React Hooks',
        ],
        notes: [
          {
            url:
              'https://github.com/eggheadio/eggheadio-course-notes/tree/master/composing-closures-and-callbacks-in-javascript',
          },
        ],
      },
      {
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
            url:
              'https://github.com/eggheadio/eggheadio-course-notes/tree/master/building-maps-with-react-leaflet',
          },
        ],
      },
      {
        slug:
          'eject-create-react-app-and-use-gatsby-for-advanced-react-app-development',
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
            type: 'egghead_course',
            slug: 'the-beginner-s-guide-to-react',
          },
        ],
        projects: [
          {
            label: 'Extract pages from CRA to Gatsby',
            url:
              'https://github.com/eggheadio/eggheadio-course-notes/tree/master/eject-create-react-app-and-use-gatsby-for-advanced-react-app-development/excercises/',
          },
        ],
        notes: [
          {
            url:
              'https://github.com/eggheadio/eggheadio-course-notes/tree/master/eject-create-react-app-and-use-gatsby-for-advanced-react-app-development',
          },
        ],
      },
      {
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
            label: 'Create an AWS IAM User with Programmatic Access',
            slug:
              'egghead-create-an-admin-user-with-iam-and-configure-aws-cli-to-enable-programmatic-access-to-aws',
          },
          {
            type: 'egghead_playlist',
            label: 'AWS Billing and Cost Management',
            slug:
              'use-aws-billing-cost-management-dashboard-to-keep-your-aws-bill-to-minimum-ff0f',
          },
          {
            type: 'egghead_playlist',
            label: 'Learn AWS Lambda from Scratch',
            slug: 'learn-aws-lambda-from-scratch-d29d',
          },
          {
            type: 'egghead_playlist',
            label: 'Learn AWS Serverless Application Model (SAM)',
            slug:
              'learn-aws-serverless-application-model-aws-sam-framework-from-scratch-baf9',
          },
          {
            type: 'egghead_playlist',
            label: 'Intro to DynamoDB',
            slug: 'intro-to-dynamodb-f35a',
          },
        ],
        projects: [
          {
            label: 'Store user input on AWS using DynamoDB',
            url:
              'https://github.com/eggheadio/eggheadio-course-notes/tree/master/build-an-app-with-the-AWS-cloud-development-kit/exercises',
          },
        ],
        notes: [
          {
            url:
              'https://github.com/eggheadio/eggheadio-course-notes/tree/master/build-an-app-with-the-AWS-cloud-development-kit',
          },
        ],
      },
      {
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
            type: 'egghead_course',
            slug: 'sql-fundamentals',
          },
          {
            type: 'text',
            label: 'Familiarity with the CRUD actions in SQL',
          },
        ],
        projects: [
          {
            url:
              'https://github.com/eggheadio-projects/advanced-sql-for-professional-developers/tree/master/exercises',
          },
        ],
        notes: [
          {
            url:
              'https://github.com/eggheadio-projects/advanced-sql-for-professional-developers',
          },
        ],
      },
      {
        slug: 'the-beginner-s-guide-to-react',
        freshness: {
          status: `fresh`,
          title: `This is an excellent course.`,
          text: `Thousands of people have used this course as an introduction to the core
          concepts of [React](/q/react). It's been reviewed and updated and is relevant and 
          valid. There isn't a better introduction to React online.
          `,
          asOf: `2021-23-01`,
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
      },
      {
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
            type: 'egghead_course',
            slug: 'introduction-to-reactive-programming',
          },
          {
            type: 'egghead_course',
            slug: 'rxjs-beyond-the-basics-operators-in-depth',
          },
        ],
      },
      {
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
            type: 'egghead_course',
            slug: 'understand-the-basics-of-http',
          },
          {
            type: 'egghead_course',
            slug: 'getting-started-with-express-js',
          },
        ],
      },
      {
        slug: 'build-custom-cli-tooling-with-oclif-and-typescript',
        dependencies: {
          typescript: '>=3.3',
          node: '>=8.0.0',
        },
        topics: [
          'Create a Simple CLI',
          'Pass Args and flags to a CLI',
          'Set up testing for a CLI',
          'Add filesystem state to a CLI',
          'Scaffold boilerplates (e.g. templates)',
          'Polish the CLI with colors, spinners, etc.',
          'Spawn child processes so other CLIs can run',
          'Control logging & output from other processes',
        ],
        illustrator: {
          name: 'Aleksander Ageev',
        },
      },
      {
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
            type: 'egghead_course',
            slug: 'construct-sturdy-uis-with-xstate',
          },
        ],
      },
      {
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
            type: 'egghead_course',
            slug: 'the-beginner-s-guide-to-react',
          },
          {
            type: 'egghead_course',
            slug: 'simplify-react-apps-with-react-hooks',
          },
          {
            type: 'egghead_course',
            slug: 'start-building-accessible-web-applications-today',
          },
        ],
      },
      {
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
            type: 'egghead_course',
            slug: 'the-beginner-s-guide-to-react',
          },
          {
            type: 'egghead_course',
            slug: 'simplify-react-apps-with-react-hooks',
          },
          {
            type: 'egghead_course',
            slug: 'build-a-blog-with-react-and-markdown-using-gatsby',
          },
          {
            type: 'egghead_course',
            slug: 'gatsby-theme-authoring',
          },
        ],
      },
      {
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
            type: 'egghead_course',
            slug: 'graphql-query-language',
          },
          {
            type: 'egghead_course',
            slug: 'graphql-data-in-react-with-apollo-client',
          },
        ],
      },
      {
        slug: 'build-an-app-with-react-suspense',
        dependencies: {
          react: '^0.0.0-experimental-b53ea6ca0',
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
            type: 'egghead_course',
            slug: 'the-beginner-s-guide-to-react',
          },
          {
            type: 'egghead_course',
            slug: 'simplify-react-apps-with-react-hooks',
          },
          {
            type: 'egghead_course',
            slug: 'react-class-component-patterns',
          },
          {
            type: 'egghead_course',
            slug: 'reusable-state-and-effects-with-react-hooks',
          },
        ],
      },
      {
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
            type: 'egghead_course',
            slug: 'develop-basic-web-apps-with-vue-js',
          },
        ],
      },
      {
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
            type: 'egghead_course',
            slug: 'practical-git-for-everyday-professional-use',
          },
          {
            type: 'egghead_course',
            slug: 'productive-git-for-developers',
          },
        ],
      },
      {
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
            type: 'egghead_course',
            slug: 'introduction-to-state-machines-using-xstate',
          },
        ],
      },
      {
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
            type: 'egghead_course',
            slug: 'gatsby-theme-authoring',
          },
        ],
      },
      {
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
            type: 'egghead_course',
            slug: 'learn-es6-ecmascript-2015',
          },
        ],
      },
      {
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
            type: 'egghead_course',
            slug: 'simplify-react-apps-with-react-hooks',
          },
          {
            type: 'egghead_course',
            slug: 'javascript-promises-in-depth',
          },
        ],
      },
      {
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
            type: 'egghead_course',
            slug: 'the-beginner-s-guide-to-react',
          },
          {
            type: 'egghead_course',
            slug: 'reusable-state-and-effects-with-react-hooks',
          },
        ],
      },
      {
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
            label: 'Basic knowledge of immutable principles',
          },
          {
            type: 'egghead_course',
            slug: 'learn-es6-ecmascript-2015',
          },
          {
            type: 'egghead_course',
            slug: 'simplify-react-apps-with-react-hooks',
          },
        ],
      },
      {
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
      },
      {
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
            label: 'Usage of common command line tools',
          },
          {
            type: 'egghead_course',
            slug: 'learn-es6-ecmascript-2015',
          },
          {
            type: 'egghead_course',
            slug: 'introduction-to-node-the-fundamentals',
          },
        ],
        goals: [
          'use every new feature approved for ES2019',
          'understand when to use optional catch binding',
          'update legacy projects for ES2019',
        ],
      },
      {
        slug:
          'build-content-rich-progressive-web-apps-with-gatsby-and-contentful',
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
            type: 'egghead_course',
            slug: 'build-a-blog-with-react-and-markdown-using-gatsby',
          },
          {
            type: 'text',
            label: 'Know React and GraphQL basics',
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
        slug: 'gatsby-theme-authoring',
        dependencies: {
          gatsby: '>=2.13.1',
        },
      },
      {
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
            label: 'Some basic understanding of JavaScript, HTML, and CSS',
          },
          {
            type: 'text',
            label:
              'Familiarity with Vue, npm and node, and express servers is recommended',
          },
          {
            type: 'text',
            label:
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
            type: 'egghead_course',
            slug: 'the-beginner-s-guide-to-react',
          },
          {
            type: 'text',
            label: 'Know the basics of React and how to use npm',
          },
          {
            type: 'text',
            label: 'Have some knowledge of JavaScript and CSS',
          },
          {
            type: 'text',
            label: 'No math or WebGL required!',
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
            label: 'Basic knowledge of JavaScript, HTML, and CSS.',
          },
          {
            type: 'text',
            label: 'Basic understanding of client/server data transfer',
          },
          {
            type: 'text',
            label: 'Familiarity with DOM element selectors',
          },
        ],
        goals: [
          'Use Cypress to test all layers of your stack simultaneously',
          'Test the front and back ends of your application',
          'Ship apps that work like they’re supposed to, with no secret bugs for your users to discover',
        ],
      },
      {
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
            label: 'SQL beginners welcome!',
          },
          {
            type: 'text',
            label: 'Some command line and terminal experience will be helpful',
          },
        ],
      },
      {
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
        slug: 'rxjs-beyond-the-basics-operators-in-depth',
        dependencies: {
          rxjs: '^5.0.0',
        },
        reviews: [
          {
            performedOn: '2017-09-15',
            performedBy: 186087,
            scopeOfReview: 'full course lesson review',
          },
        ],
      },
      {
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
        slug: 'build-react-components-from-streams-with-rxjs-and-recompose',
        dependencies: {
          rxjs: '^5.0.0',
          react: '^16.0.0',
        },
      },
      {
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
        slug: 'animate-react-native-ui-elements',
        dependencies: {
          react: '^15.0.0',
          'react-native': '0.35 - 0.39',
        },
      },
      {
        slug: 'build-a-react-native-todo-application',
        dependencies: {
          react: '^15.0.0',
          'react-native': '0.35 - 0.37',
        },
      },
      {
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
        slug: 'up-and-running-with-preact',
        dependencies: {
          preact: '7 - 8',
          'react-router': '^4.0.0',
          redux: '^3.0.0',
        },
      },
      {
        slug:
          'higher-order-components-with-functional-patterns-using-recompose',
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
        slug: 'up-and-running-with-redux-observable',
        dependencies: {
          react: '15 - 16',
          redux: '3 - 4',
        },
        reviews: [
          {
            performedOn: '2018-05-28',
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
              {
                type: 'major issue',
                dependency: 'rxjs',
                title:
                  'rxjs-compat needs to be used if you upgraded from v5 -> v6',
                details:
                  'rxjs-compat is now necessary to run rxjs applications with angular if the application is updated from v5 -> v6 [ReactiveX/rxjs#3764](https://github.com/ReactiveX/rxjs/issues/3764)',
              },
              {
                type: 'minor issue',
                dependency: 'rxjs',
                title:
                  'all lessons had to have specific commands in rxjs be imported individually from `operator`',
              },
            ],
          },
        ],
      },
      {
        slug:
          'build-a-server-rendered-code-split-app-in-react-with-react-universal-component',
        dependencies: {
          express: '^4.0.0',
          react: '^16.0.0',
        },
      },
      {
        slug: 'build-a-react-app-with-redux',
        dependencies: {
          react: '15 - 16',
          redux: '3 - 4',
        },
      },
      {
        slug: 'build-react-components-from-streams-with-rxjs-and-recompose',
        dependencies: {
          react: '^16.0.0',
          rxjs: '^5.0.0',
        },
      },
      {
        slug: 'leverage-new-features-of-react-16',
        dependencies: {
          react: '^16.0.0',
        },
      },
      {
        slug: 'add-routing-to-react-apps-using-react-router-v4',
        dependencies: {
          react: '15 - 16',
          'react-router': '^4.0.0',
        },
      },
      {
        slug: 'build-a-server-rendered-reactjs-application-with-next-js',
        dependencies: {
          react: '^16.0.0',
          next: '^4.0.0',
        },
      },
      {
        slug: 'build-a-blog-with-react-and-markdown-using-gatsby',
        dependencies: {
          gatsby: '^2.0.0',
        },
      },
      {
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
        slug: 'optimistic-ui-updates-in-react',
        dependencies: {
          react: '^16.0.0',
        },
      },
      {
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
        slug: 'test-react-components-with-enzyme-and-jest',
        dependencies: {
          react: '^16.0.0',
          enzyme: '^3.0.0',
          redux: '^3.0.0',
        },
      },
      {
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
        slug: 'angular-dependency-injection-di-explained',
        dependencies: {
          angular: '2 - 6',
          rxjs: '5 - 6',
        },
      },
      {
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
        slug: 'manage-ui-state-with-the-angular-router',
        dependencies: {
          angular: '2 - 4',
          rxjs: '^5.0.0',
        },
      },
      {
        slug: 'build-an-angular-instant-search-component',
        dependencies: {
          angular: '^2.0.0',
          rxjs: '^5.0.0',
        },
      },
      {
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
        slug:
          'use-objective-c-swift-and-java-api-s-in-nativescript-for-angular-ios-and-android-apps',
        dependencies: {
          angular: '^2.0.0',
          rxjs: '^5.0.0',
          'nativescript-angular': '^1.0.0',
        },
      },
      {
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
        slug: 'start-learning-react',
        dependencies: {
          react: '0.14 - 16',
        },
      },
      {
        slug: 'react-testing-cookbook',
        dependencies: {
          react: '0.14 - 15',
          redux: '^3.0.0',
        },
      },
      {
        slug: 'building-react-applications-with-idiomatic-redux',
        dependencies: {
          react: '^15.0.0',
          redux: '^3.0.0',
        },
      },
      {
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
        slug: 'manage-application-state-with-mobx-state-tree',
        dependencies: {
          react: '^16.0.0',
          mobx: '^3.0.0',
        },
      },
      {
        slug: 'beautiful-and-accessible-drag-and-drop-with-react-beautiful-dnd',
        dependencies: {
          react: '^16.0.0',
        },
      },
      {
        slug: 'getting-started-with-redux',
        dependencies: {
          react: '0.14 - 16',
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
        slug:
          'seo-friendly-progressive-web-applications-with-angular-universal',
        dependencies: {
          angular: '^6.0.0',
          rxjs: '^6.0.0',
        },
        illustrator: {
          name: 'Maxime Bourgeois',
        },
      },
      {
        slug: 'create-native-mobile-apps-with-nativescript-for-angular',
        dependencies: {
          angular: '^2.0.0',
          rxjs: '^5.0.0',
        },
      },
      {
        slug: 'get-started-with-angular',
        dependencies: {
          angular: '5 - 6',
          rxjs: '5 - 6',
        },
      },
      {
        slug: 'build-basic-nativescript-app-templates',
        dependencies: {
          nativescript: '2 - 4',
        },
      },
      {
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
        slug: 'fully-connected-neural-networks-with-keras',
        dependencies: {
          python: '^3.0.0',
        },
      },
      {
        slug: 'advanced-angular-component-patterns',
        dependencies: {
          angular: '5 - 6',
        },
      },
      {
        slug:
          'create-smooth-performant-transitions-with-react-transition-group-v2',
        dependencies: {
          react: '^16.0.0',
        },
      },
      {
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
        slug: 'design-systems-with-react-and-typescript-in-storybook',
        dependencies: {
          react: '^16.0.0',
          'react-storybook': '^3.0.0',
        },
      },
      {
        slug: 'build-your-own-rxjs-pipeable-operators',
        dependencies: {
          rxjs: '^6.0.0',
        },
      },
      {
        slug: 'style-and-theme-ionic-applications',
        dependencies: {
          ionic: '^3.0.0',
        },
      },
      {
        slug: 'build-basic-nativescript-app-templates',
        dependencies: {
          nativescript: '^4.0.0',
        },
        reviews: [
          {
            performedOn: '2018-09-06',
            performedBy: 248653,
            scopeOfReview: 'full course lesson review',
          },
        ],
      },
      {
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
        slug: 'build-a-graphql-server',
        dependencies: {
          graphql: '0.7 - 14',
        },
      },
      {
        slug: 'execute-npm-package-binaries-with-the-npx-package-runner',
        dependencies: {
          npm: '>=5.2.0',
        },
        illustrator: {
          name: 'Aleksander Ageev',
        },
      },
      {
        slug:
          'scalable-offline-ready-graphql-applications-with-aws-appsync-react',
        dependencies: {
          graphql: '^14.0.0',
        },
      },
      {
        slug: 'react-context-for-state-management',
        dependencies: {
          react: '^16.6.0',
        },
      },
      {
        slug: 'simplify-react-apps-with-react-hooks',
        dependencies: {
          react: '^16.7.0-alpha',
        },
        illustrator: {
          name: 'Maxime Bourgeois',
        },
      },
      {
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
        slug: 'learn-angular-router-for-real-world-applications',
        dependencies: {
          angular: '~7.0.0',
          react: '~6.3.3',
          'core-js': '^2.5.4',
        },
      },
      {
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
        slug: 'build-an-angular-instant-search-component',
        dependencies: {
          angular: '2.0.0-rc.5 - ^7.0.3',
          rxjs: '5.0.0-beta.6 - ^6.3.3',
        },
        review: [
          {
            performedOn: '2018-11-13',
            performedBy: '352387',
            scopeOfReview: 'full course review',
          },
        ],
      },
      {
        slug: 'get-started-with-angular',
        dependencies: {
          angular: '4.1.1 - ^7.0.1',
          rxjs: '5.0.0 - ^6.3.3',
        },
        reviews: [
          {
            performedOn: '2018-10-30',
            performedBy: '264612',
            scopeOfReview: 'full course review',
          },
        ],
      },
      {
        slug: 'build-graphql-apis-with-aws-appsync',
        dependencies: {
          react: '^16.4.2',
        },
        reviews: [
          {
            performedOn: '2018-10-30',
            performedBy: '264612',
            scopeOfReview: 'full course review',
          },
        ],
      },
      {
        slug: 'advanced-angular-component-patterns',
        dependencies: {
          angular: '5.0.0 - ^7.0.2',
          rxjs: '5.5.2 - ^6.3.3',
        },
        reviews: [
          {
            performedOn: '2018-11-07',
            performedBy: '352387',
            scopeOfReview: 'full course review',
            notes: [
              {
                type: 'minor issue',
                dependency: '@angular/core',
                title: '6.0.0 -> set preserveWhitespaces to false by default',
                details:
                  "On lesson 4 This caused “Off Off” to become “OffOff”. In main.ts .bootstrapModule(AppModule, {preserveWhitespaces: true} was added to replicate the example's original configuration settings",
                documentation:
                  'https://github.com/angular/angular/blob/master/CHANGELOG.md#600-2018-05-03',
              },
            ],
          },
        ],
      },
      {
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
        slug: 'reusable-stateful-logic-with-react-hooks',
        dependencies: {
          react: '^16.7.0-alpha.0',
          emotion: '^9.2.12',
          'lodash.uniqueid': '4^.0.1',
        },
      },
      {
        slug: 'graphql-data-in-react-with-apollo-client',
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
        slug: 'simplify-react-apps-with-react-hooks',
        dependencies: {
          emotion: '10.0.0-beta.8',
          react: '16.7.0-alpha.2',
          'reach/router': '1.2.1',
          'date-fns': '1.29.0',
          'graphql-request': '1.8.2',
          'match-sorter': '2.3.0',
          'netlify-auth-providers': '1.0.0-alpha5',
          'prop-types': '15.6.2',
        },
      },
      {
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
        slug: 'practical-advanced-typescript',
        dependencies: {
          typescript: '^3.0.0',
        },
      },
      {
        slug: 'use-typescript-to-develop-vue-js-web-applications',
        dependencies: {
          vue: '^2.2.6',
          typescript: '^2.3.2',
        },
      },
      {
        slug: 'vue-js-state-management-with-vuex-and-typescript',
        dependencies: {
          vue: '^2.2.6',
          vuex: '^2.3.1',
          typescript: '^2.3.2',
        },
      },
      {
        slug: 'build-algorithms-using-typescript',
        dependencies: {
          typescript: '^2.1.4',
        },
      },
      {
        slug: 'async-await-using-typescript',
        dependencies: {
          '@types/node': '8.0.53',
        },
      },
      {
        slug: 'advanced-static-types-in-typescript',
        dependencies: {
          typescript: '^2.0.0',
        },
      },
      {
        slug: 'build-angular-1-x-apps-with-redux',
        dependencies: {
          angular: '1.5.7',
        },
      },
      {
        slug: 'use-types-effectively-in-typescript',
        dependencies: {
          typescript: '^2.0.0',
        },
      },
      {
        slug: 'reduce-redux-boilerplate-with-redux-actions',
        dependencies: {
          redux: '^3.6.0',
          react: '^15.5.4',
        },
      },
      {
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
        slug: 'end-to-end-testing-with-google-s-puppeteer-and-jest',
        dependencies: {
          react: '^16.2.0',
          puppeteer: '^0.13.0',
          jest: '^22.0.4',
        },
      },
      {
        slug: 'build-a-node-js-rest-api-with-loopback',
        dependencies: {
          loopback: '^3.0.0',
        },
      },
      {
        slug: 'integrate-ibm-domino-with-node-js',
        dependencies: {
          express: '^4.16.3',
        },
      },
      {
        slug: 'offline-first-progressive-web-apps-pwa-in-vue-js',
        dependencies: {
          vue: '^2.5.2',
        },
        illustrator: {
          name: 'Maxime Bourgeois',
        },
      },
      {
        slug: 'real-world-react-native-animations',
        dependencies: {
          react: '^15.4.0',
          'react-native': '0.38.0',
        },
      },
      {
        slug: 'angular-and-webpack-for-modular-applications',
        dependencies: {
          angular: '^1.5.0-rc.0',
          webpack: '^1.7.2',
        },
      },
      {
        slug: 'asynchronous-javascript-with-async-await',
        dependencies: {
          typescript: '^2.3.0',
        },
      },
      {
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
        slug: 'fundamentals-of-react-native-video',
        dependencies: {
          'react-native': '^0.44.2',
          'react-native-video': '^1.0.0',
        },
      },
      {
        slug: 'develop-basic-web-apps-with-vue-js',
        dependencies: {
          vue: '^2.5.16',
        },
      },
      {
        slug: 'vue-update-vuex-state-with-mutations-and-mapmutations-in-vue-js',
        dependencies: {
          nuxt: '^2.0.0',
        },
      },
      {
        slug: 'create-a-news-app-with-vue-js-and-nuxt',
        dependencies: {
          nuxt: '^1.0.0-rc3',
        },
      },
      {
        slug: 'advanced-fine-grained-control-of-vue-js-components',
        dependencies: {
          vue: '^2.5.9',
        },
      },
      {
        slug: 'build-node-js-apis-with-openapi-spec-swagger',
        dependencies: {
          express: '^4.12.3',
        },
      },
      {
        slug: 'angularjs-authentication-with-jwt',
        dependencies: {
          angular: '^1.2.25',
        },
      },
      {
        slug: 'publish-javascript-packages-on-npm',
        dependencies: {
          'babel-cli': '^6.18.0',
        },
      },
      {
        slug: 'use-webpack-2-for-production-javascript-applications',
        dependencies: {
          webpack: '^2.1.0',
          babel: '6.5.2',
        },
      },
      {
        slug: 'learn-protractor-testing-for-angularjs',
        dependencies: {
          protractor: '^1.4.0',
          angular: '^1.2.8',
        },
      },
      {
        slug: 'getting-started-with-express-js',
        dependencies: {
          express: '^4.13.1',
        },
      },
      {
        slug: 'end-to-end-testing-with-cypress',
        dependencies: {
          cypress: '^1.4.1',
          react: '^16.0.0',
        },
      },
      {
        slug: 'react-class-component-patterns',
        dependencies: {
          react: '^16.3.2',
          redux: '^3.7.2',
        },
      },
      {
        slug: 'introduction-to-the-python-3-programming-language',
        dependencies: {
          python: '3',
        },
      },
      {
        slug:
          'build-user-interfaces-by-composing-css-utility-classes-with-tailwind',
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
        slug: 'maintainable-css-using-typestyle',
        dependencies: {
          typescript: '2.2.1',
          react: '^15.4.2',
        },
      },
      {
        slug: 'create-your-own-twitter-bots',
        dependencies: {
          twit: '^2.2.5',
        },
      },
      {
        slug: 'introduction-to-node-servers-with-hapi-js',
        dependencies: {
          hapi: '^11.0.3',
        },
      },
      {
        slug: 'make-webpack-easy-with-poi',
        dependencies: {
          poi: '^9.0.0',
        },
      },
      {
        slug: 'angularjs-data-modeling',
        dependencies: {
          angular: '^1.2.23',
        },
      },
      {
        slug: 'using-angular-2-patterns-in-angular-1-x-apps',
        dependencies: {
          angular: '^1.5.7',
        },
      },
      {
        slug: 'angular-automation-with-gulp',
        dependencies: {
          gulp: '^3.8.11',
          angular: '^1.4.7',
        },
      },
      {
        slug: 'introduction-to-angular-material',
        dependencies: {
          'angular-material': '^1.1.12',
          angular: '^1.5.6',
        },
      },
      {
        slug: 'natural-language-processing-in-javascript-with-natural',
        dependencies: {
          natural: '^0.4.0',
        },
      },
      {
        slug: 'angularjs-fundamentals',
        dependencies: {
          angular: '^1.6.5',
        },
      },
      {
        slug: 'build-interactive-javascript-charts-with-d3-v4',
        dependencies: {
          d3: '^4.1.1',
        },
      },
      {
        slug: 'using-postgres-window-functions',
        dependencies: {
          PostgreSQL: '^9.6',
        },
      },
      {
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
        slug: 'get-started-with-postgresql',
        dependencies: {
          PostgreSQL: '^9.6',
        },
      },
      {
        slug: 'asynchronous-programming-the-end-of-the-loop',
        dependencies: {
          rxjs: '^2.3',
        },
        illustrator: {
          name: 'Maxime Bourgeois',
        },
      },
      {
        slug: 'learn-the-best-and-most-useful-scss',
        dependencies: {
          'node-sass': '^3.11',
        },
      },
      {
        slug: 'cycle-js-fundamentals',
        dependencies: {
          cycle: '^3.1',
        },
      },
      {
        slug: 'understand-joins-and-unions-in-postgres',
        dependencies: {
          PostgreSQL: '9.4.5',
        },
      },
      {
        slug: 'use-d3-v3-to-build-interactive-charts-with-javascript',
        dependencies: {
          d3: '^3.5',
        },
      },
      {
        slug: 'creating-custom-web-elements-with-polymer-2',
        dependencies: {
          polymer: '1.2 - 1.11',
        },
      },
      {
        slug: 'get-started-with-elasticsearch',
        dependencies: {
          elasticsearch: '^12.1.3',
        },
      },
      {
        slug: 'ember-2-fundamentals',
        dependencies: {
          ember: '~2.5',
        },
      },
      {
        slug: 'building-an-angular-1-x-ionic-application',
        dependencies: {
          angular: '1.5.5',
          ionic: '1.2.1',
        },
      },
      {
        slug: 'up-and-running-with-typescript',
        dependencies: {
          typescript: '^3.2.1',
        },
      },
    ],
    {slug: courseSlug},
  )
export default courseDependencyData
