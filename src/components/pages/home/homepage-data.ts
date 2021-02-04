const homepageData = [
  {
    id: 'jumbotron',
    title: 'Introduction to Cloudflare Workers',
    byline: 'new course',
    description:
      "Follow along with Kristian Freeman as you build a localization engine that renders data based on the Edge location nearest to the application's user.",
    image:
      'https://d2eip9sf3oo6c2.cloudfront.net/playlists/square_covers/000/418/892/full/EGH_IntroCloudFlareWorkers_Final.png',
    path: '/playlists/introduction-to-cloudflare-workers-5aa3',
    slug: 'introduction-to-cloudflare-workers-5aa3',
    instructor: {
      name: 'Kristian Freeman',
      slug: 'kristian-freeman',
      path: '/q/resources-by-kristian-freeman',
      twitter: 'signalnerve',
      image:
        'https://d2eip9sf3oo6c2.cloudfront.net/instructors/avatars/000/000/469/square_128/kristian.jpeg',
    },
  },
  {
    id: 'video',
    name: 'Optimize your Learning',
    title: 'Learning Tips Every Developer Should Know',
    description: `Learning will be a constant in your career no matter what you decide to do, especially if you are breaking into tech.

There are a number of tried and true methods that will allow you to learn more efficiently so that you can keep up with the industry. These evergreen methods will serve you well no matter your level of expertise.
      `,
    instructor: 'Ceora Ford',
    instructor_path: '/q/resources-by-nader-dabit',
    path:
      '/lessons/egghead-egghead-talks-learning-tips-every-developer-should-know',
    poster:
      'https://res.cloudinary.com/dg3gyk0gu/image/upload/v1612390842/egghead-next-pages/home-page/LearningTipsCover.png.png',
    hls_url:
      'https://d2c5owlt6rorc3.cloudfront.net/egghead-eggheadtalk-learning-tips-every-developer-should-know--ZSo0lRrh/hls/egghead-eggheadtalk-learning-tips-every-developer-should-know--ZSo0lRrh.m3u8',

    dash_url:
      'https://d2c5owlt6rorc3.cloudfront.net/egghead-eggheadtalk-learning-tips-every-developer-should-know--ZSo0lRrh/dash/egghead-eggheadtalk-learning-tips-every-developer-should-know--ZSo0lRrh.mpd',

    subtitlesUrl:
      'https://app.egghead.io/api/v1/lessons/egghead-egghead-talks-learning-tips-every-developer-should-know/subtitles',
  },
  {
    id: 'featured',
    title: 'Featured',
    resources: [
      {
        name: 'Fresh Course',
        title: 'Netlify Serverless Functions and Hasura',
        byline: 'Jason Lengstorf・1h 27m・Course',
        image:
          'https://d2eip9sf3oo6c2.cloudfront.net/playlists/square_covers/000/414/202/thumb/EGH_NetlifyServerlessFunction_Final.png',
        path:
          '/playlists/build-a-corgi-up-boop-web-app-with-netlify-serverless-functions-and-hasura-553c',
        slug:
          'build-a-corgi-up-boop-web-app-with-netlify-serverless-functions-and-hasura-553c',
      },
      {
        name: 'Ship anywhere',
        title: 'Containerize Apps with Docker',
        byline: 'Joel Lord ・1h 24m・Course',
        image:
          'https://d2eip9sf3oo6c2.cloudfront.net/playlists/square_covers/000/410/102/full/egh_intro-to-docker.png',
        path:
          '/playlists/containerize-full-stack-javascript-applications-with-docker-30a8',
      },
      {
        name: 'Get Reactive',
        title: 'Thinking Reactively with RxJS',
        byline: 'Rares Matei・1h 50m・Course',
        image:
          'https://d2eip9sf3oo6c2.cloudfront.net/series/square_covers/000/000/447/thumb/EGH_ThinkingRxJs.png',
        path: '/courses/thinking-reactively-with-rxjs',
        slug: 'thinking-reactively-with-rxjs',
        description:
          'When a manager gives us the requirements for an application feature, they don\'t care too much about *how* we build it. And often times, they think that hard things will be easy.\n\nDealing with time and coordinating different types of events can be tricky.\n\nLuckily, we have RxJS to help!\n\nIn this course, you will use RxJS to build a loading spinner in an app that meets the ever-changing requirements from a mock Product Manager.\n\nYou\'ll also learn how to implement a "Konami Code" style feature that listens for a correct sequence of keys to be typed in a set amount of time.\n\nFollow the thought process that Rares uses as he breaks problems down into manageable pieces that remain flexible, and become more comfortable solving problems reactively.',
      },
    ],
  },
  {
    id: 'workflows',
    title: 'Optimize Daily Workflows',
    description:
      'Humans were never meant to repeat joyless tasks in a precise manner, over and over and over. Computers are meant precisely for these types of tasks. Automation is all about saving you time — and these courses are well worth yours. Enjoy!',
    resources: [
      {
        title: 'Advanced Bash Automation for Web Developers',
        byline: 'Cameron Nokes・ Course',
        image:
          'https://d2eip9sf3oo6c2.cloudfront.net/series/square_covers/000/000/239/thumb/EGH_BashAutomation_Final.png',
        path: '/courses/advanced-bash-automation-for-web-developers',
        slug: 'advanced-bash-automation-for-web-developers',
      },
      {
        title: 'Regex in Javascript',
        byline: 'Joe Maddalone・ Course',
        image:
          'https://d2eip9sf3oo6c2.cloudfront.net/series/square_covers/000/000/029/thumb/course_image.png',
        path: '/courses/regex-in-javascript',
        slug: 'regex-in-javascript',
      },
      {
        title: 'Use Grep for Fast Search from the Command Line',
        byline: 'Bonnie Eisenman・ Course',
        image:
          'https://d2eip9sf3oo6c2.cloudfront.net/series/square_covers/000/000/088/thumb/EGH_Grep_Final_Small.png',
        path: '/courses/use-grep-for-fast-search-from-the-command-line',
        slug: 'use-grep-for-fast-search-from-the-command-line',
      },
      {
        title: 'Wrangle your terminal with tmux',
        byline: 'Bonnie Eisenman・ Course',
        image:
          'https://d2eip9sf3oo6c2.cloudfront.net/series/square_covers/000/000/099/thumb/EGH_TMUX_Final_2x.png',
        path: '/courses/wrangle-your-terminal-with-tmux',
        slug: 'wrangle-your-terminal-with-tmux',
      },
      {
        title: 'Productive Git for Developers',
        byline: 'Juri Strumpflohner・ Course',
        image:
          'https://d2eip9sf3oo6c2.cloudfront.net/series/square_covers/000/000/247/thumb/EGH_ProductiveGitFinal.png',
        path: '/courses/productive-git-for-developers',
        slug: 'productive-git-for-developers',
      },
    ],
  },
  {
    id: 'getStarted',
    name: 'Introductions',
    title: 'Start Learning Here',
    description:
      'These courses will get you started building real-world applications with these tools. They are all excellent introductions if you want to learn something new today.',
    resources: [
      {
        title: "The Beginner's Guide to React",
        byline: 'Kent C. Dodds・2h 27m ・Course',
        image:
          'https://d2eip9sf3oo6c2.cloudfront.net/series/square_covers/000/000/160/thumb/EGH_BeginnersReact2.png',
        path: '/courses/the-beginner-s-guide-to-react',
      },
      {
        title: "The Beginner's Guide to Figma",
        byline: 'Joe Previte・ Course',
        image:
          'https://d2eip9sf3oo6c2.cloudfront.net/series/square_covers/000/000/265/thumb/EGH_BeginnerFigma_Final.png',
        path: '/courses/the-beginner-s-guide-to-figma',
        slug: 'the-beginner-s-guide-to-figma',
      },
      {
        title: 'Up and running with Svelte 3',
        byline: 'Tomasz Łakomy・26m ・Course',
        image:
          'https://d2eip9sf3oo6c2.cloudfront.net/tags/images/000/001/236/thumb/svelte-logo-vertical.png',
        path: '/playlists/getting-started-with-svelte-3-05a8541a',
      },
      {
        title: 'Develop Basic Web Apps with Vue.js',
        byline: 'Greg Thoman・16m ・Course',
        image:
          'https://d2eip9sf3oo6c2.cloudfront.net/series/square_covers/000/000/083/thumb/EGH_VueJS_Final.png',
        path: '/courses/develop-basic-web-apps-with-vue-js',
      },
      {
        title: 'Write Your First Program with the Rust Language',
        byline: 'Pascal Precht・19m ・Course',
        image:
          'https://d2eip9sf3oo6c2.cloudfront.net/series/square_covers/000/000/448/thumb/EGH_BuildaRustApp_Final.png',
        path: '/courses/write-your-first-program-with-the-rust-language',
      },
    ],
  },
  {
    id: 'freeCourses',
    name: 'Community Resource ',
    title: 'Learn Something New',
    description:
      'A Community Resource is a course that is free to access for all. The instructor of this course requested it to be open to the public. ',
    resources: [
      {
        title: 'Get Started with Reason',
        byline: 'Nik Graf・1h 13m・Course',
        image:
          'https://d2eip9sf3oo6c2.cloudfront.net/series/square_covers/000/000/163/thumb/EGH_Reason_Final.png',
        path: '/courses/get-started-with-reason',
      },
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
        title: 'Practical Git for Everyday Professional Use',
        byline: 'Trevor Miller・1h ・Course',
        image:
          'https://d2eip9sf3oo6c2.cloudfront.net/series/square_covers/000/000/050/thumb/egghead-practical-git-course.png',
        path: '/courses/practical-git-for-everyday-professional-use',
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
        title: 'How to Contribute to an Open Source Project on GitHub',
        byline: 'Kent C. Dodds・38m ・Course',
        image:
          'https://d2eip9sf3oo6c2.cloudfront.net/series/square_covers/000/000/032/thumb/EGH_JSopensource_final.png',
        path: '/courses/how-to-contribute-to-an-open-source-project-on-github',
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
        title: 'Debug the DOM in Chrome with the Devtools Elements panel',
        byline: 'Mykola Bilokonsky・25m・Course',
        image:
          'https://d2eip9sf3oo6c2.cloudfront.net/series/square_covers/000/000/060/full/EGH_Chrome_Elements.png',
        path: '/courses/using-chrome-developer-tools-elements',
      },
    ],
  },
  {
    id: 'aws',
    name: 'Amazon Web Services',
    title: 'Deep Dive into AWS 🤯',
    path: '/playlists/react-state-management-in-2021-6732',
    description:
      'Amazon Web Services (AWS) has over 165 services. Not sure where to start? Let these courses guide you through quickly getting up and running on AWS. ',
    resources: [
      {
        byline: 'Tomasz Łakomy・1h 4m・Course',
        description:
          "Amazon AWS is one of the most popular cloud providers in the world, but it can also be daunting to learn thanks to the alphabet soup of service acronyms.Once you've figured out which subset of services to use, you've got a lot of clicking around to do in order to get things configured.Not anymore!With the AWS Cloud Development Kit (CDK), you are able to configure AWS services from your terminal & editor.Even better, you can do your configuration, frontend, and backend all with the same language. In this course, Tomasz Łakomy will guide you through using TypeScript to complete the lifecycle of an application powered by AWS CDK. You'll see how to start a project, develop it locally, deploy it globally, then tear it all down when you're done.The services & development approach Tomasz demonstrates in this course are used by countless companies around the world. Is yours next?",
        image:
          'https://d2eip9sf3oo6c2.cloudfront.net/series/square_covers/000/000/450/thumb/EGH_AWS-TS.png',
        path: '/courses/build-an-app-with-the-aws-cloud-development-kit',
        slug: 'build-an-app-with-the-aws-cloud-development-kit',
        title: 'Build an App with the AWS Cloud Development Kit',
      },
      {
        byline: 'Lee Robinson・30m・Course',
        description:
          'Learn how to use the [AWS Cloud Development Kit (CDK)](https://docs.aws.amazon.com/cdk/latest/guide/getting_started.html#getting_started_install) to create and deploy a [DynamoDB table](https://aws.amazon.com/dynamodb/) with [Next.js](https://nextjs.org).- 🛠 API Route to handle CRUD actions- 📦 AWS CDK for Infrastructure as Code- 🔓 IAM role to restrict permissions- 🚀 Deploy instantly to [Vercel](https://vercel.com)You can view the completed code [here](https://github.com/leerob/nextjs-aws-dynamodb). ',
        image:
          'https://d2eip9sf3oo6c2.cloudfront.net/playlists/square_covers/000/411/838/thumb/EGH_DynamoDB.png',
        path: '/playlists/using-dynamodb-with-next-js-b40c',
        slug: 'using-dynamodb-with-next-js-b40c',
        title: 'Using DynamoDB with Next.js',
      },
      {
        byline: 'Chris Biscardi・17m・Course',
        description:
          "This playlist covers all of the ways to use the node.js DocumentClient to interact with one or more DynamoDB tables.note: We do not cover scan() as it is not recommended for most usage and if you need it you'll know how to read the documentation to use it by the end of this collection.",
        path: '/playlists/dynamodb-the-node-js-documentclient-1396',
        slug: 'dynamodb-the-node-js-documentclient-1396',
        title: 'DynamoDB: The Node.js DocumentClient',
        image:
          'https://d2eip9sf3oo6c2.cloudfront.net/tags/images/000/001/090/thumb/aws.png',
      },
      {
        byline: 'Chris Biscardi・15m・Course',
        description:
          "This collection includes introductory level material for AWS DynamoDB. We cover what DynamoDB is, when you'd use it, and the vocabulary you'll need to understand documentation and talks in the ecosystem.You'll come out of this playlist with the ability to understand what people mean when they say DynamoDB and the base you need to get started yourself.**View and contribute to the [Community Notes!](https://github.com/eggheadio-projects/intro-to-dynamodb)**",
        image:
          'https://d2eip9sf3oo6c2.cloudfront.net/tags/images/000/001/090/thumb/aws.png',
        path: '/playlists/intro-to-dynamodb-f35a',
        slug: 'intro-to-dynamodb-f35a',
        title: 'Intro to DynamoDB',
      },
      {
        byline: 'Tomasz Łakomy・21m・Course',
        description: `AWS Lambda, Serverless, FaaS - there is a lot of noise around those topics online (and for a very good reason!) and it can get confusing at times 🤯In this collection we're going to take a look at AWS Lambda from scratch, in order to get **YOU** from:"_I have no idea what a lambda function is_" to "_I know quite a bit about AWS Lambda, and I'm going to use it to solve my problems_"Checkout the [community notes for this collection on github](https://github.com/theianjones/egghead.io_learn_aws_lambda_from_scratch).`,
        image:
          'https://d2eip9sf3oo6c2.cloudfront.net/tags/images/000/001/090/thumb/aws.png',
        path: '/playlists/learn-aws-lambda-from-scratch-d29d',
        slug: 'learn-aws-lambda-from-scratch-d29d',
        title: 'Learn AWS Lambda from scratch',
      },
      {
        byline: 'Tomasz Łakomy・4m・Course',
        description:
          "We generally tend to avoid paying for things unless we actually need them, and the same goes for AWSWhen using a cloud provider like AWS sometimes an unexpected charge may occur and we'd like to understand what are we being charged for and how to be notified whenever an unexpected charge occurs (especially when we're trying to stay within a free tier).In this quick (4 minutes, 2 lessons) collection we're going to learn how to:- Review the AWS Billing & Cost Management Dashboard- Set up a billing alarm to be notified whenever our bill is larger than $5- Review the AWS bill to understand how much are we going to pay this month and why",
        image:
          'https://d2eip9sf3oo6c2.cloudfront.net/tags/images/000/001/090/thumb/aws.png',
        path:
          '/playlists/use-aws-billing-cost-management-dashboard-to-keep-your-aws-bill-to-minimum-ff0f',
        slug:
          'use-aws-billing-cost-management-dashboard-to-keep-your-aws-bill-to-minimum-ff0f',
        title:
          'Use AWS Billing & Cost Management Dashboard to keep your AWS bill to minimum',
      },
      {
        byline: 'Chris Biscardi・42m・Course',
        description:
          'This collection is a sequel to the [Building a Serverless JAMStack Todo app with Netlify, Gatsby, GraphQL, and FaunaDB](https://egghead.io/playlists/building-a-serverless-jamstack-todo-app-with-netlify-gatsby-graphql-and-faunadb-53bb) collection. In this collection we take the TODO application we built and convert it to run using Netlify Identity, AWS Lambda (using the serverless framework) and DynamoDB. We cover* Fauna vs DynamoDB and when to use each* Setting up AWS accounts* Creating DynamoDB tables and data modeling differences between Fauna and Dynamo* Converting our Netlify Functions deployment to a Serverless Framework deployment* Implementing Custom authorizer functions on AWSIt uses tools that remove as many of the barriers as possible. Netlify Functions grows into Serverless Framework adn AWS Lambda, Netlify Identity is kept around, and FaunaDB can grows into DynamoDB.',
        image:
          'https://d2eip9sf3oo6c2.cloudfront.net/tags/images/000/001/090/thumb/aws.png',
        path:
          '/playlists/converting-a-serverless-app-to-run-on-aws-lambda-and-dynamodb-with-serverless-framework-223a',
        slug:
          'converting-a-serverless-app-to-run-on-aws-lambda-and-dynamodb-with-serverless-framework-223a',
        title:
          'Converting a Serverless App to run on AWS Lambda and DynamoDB with Serverless Framework',
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
        path:
          '/lessons/react-using-redux-in-modern-react-apps-with-mark-erikson?pl=react-state-management-2020-6bec',
      },
      {
        title: 'XState for State Management in React Apps with David Khourshid',
        byline: 'David Khourshid & Joel Hooks・55m・Chat',
        path:
          '/lessons/react-xstate-for-state-management-in-react-apps-with-david-khourshid?pl=react-state-management-2020-6bec',
      },
      {
        title: 'State Management in React with Chance Strickland',
        byline: 'Chance Strickland & Joel Hooks・46m・Chat',
        path:
          '/lessons/react-state-management-in-react-with-chance-strickland?pl=react-state-management-2020-6bec',
      },
      {
        title:
          'Using Recoil to Manage Orthogonal State in React Apps with David McCabe',
        byline: 'David McCabe & Joel Hooks・34m・Chat',
        path:
          '/lessons/react-using-recoil-to-manage-orthogonal-state-in-react-apps-with-david-mccabe?pl=react-state-management-2020-6bec',
      },
      {
        title: 'Managing Complex State in React with Jared Palmer',
        byline: 'Jared Palmer & Joel Hooks・1h 28m・Chat',
        path:
          '/lessons/react-managing-complex-state-in-react-with-jared-palmer?pl=react-state-management-2020-6bec',
      },
    ],
  },
  {
    id: 'cms',
    name: 'Content Management System',
    title:
      'WordPress as a Headless Content Management System (CMS) and GraphQL API',
    path: '/playlists/headless-wordpress-4a14',
    image:
      'https://d2eip9sf3oo6c2.cloudfront.net/playlists/square_covers/000/410/100/full/Headless-Wordpress.png',
    byline: 'Kevin Cunningham',
    description: `You and your clients will be able to take advantage of WordPress's content editing experience, without having to settle for a cookie-cutter theme on the frontend.`,
  },
  {
    id: 'redux',
    name: 'The Classic',
    byline: 'Dan Abramov・2h 1m・Course',
    description: `In this comprehensive course, Dan Abramov - the creator of Redux - will teach you how to manage state in your [React](/q/react) application with [Redux](/q/redux).`,
    path: '/courses/getting-started-with-redux',
    slug: 'getting-started-with-redux',
    title: 'Getting Started with Redux',
    image:
      'https://d2eip9sf3oo6c2.cloudfront.net/series/square_covers/000/000/025/thumb/EGH_Redux-New.png',
  },
  {
    id: 'security',
    name: 'Protect Your Application',
    title: 'Web Security Essentials: MITM, CSRF, and XSS',
    byline: 'Mike Sherov・50m・Course',
    image: `https://d2eip9sf3oo6c2.cloudfront.net/series/square_covers/000/000/413/square_280/EGH_WebSecurity.png`,
    path: '/courses/web-security-essentials-mitm-csrf-and-xss',
    description: `Security is important, yet it is often overlooked and forgotten. In this course, you'll learn how to protect your application by learning how to attack it.`,
  },
  {
    id: 'accessibleReactApps',
    name: 'Accessible React Applications ',
    byline: 'Erin Doyle・1h 28m・Course',

    image:
      'https://d2eip9sf3oo6c2.cloudfront.net/series/square_covers/000/000/412/thumb/AccessibleReact_1000.png',
    path: '/courses/develop-accessible-web-apps-with-react',
    slug: 'develop-accessible-web-apps-with-react',
    title: 'Develop Accessible Web Apps with React',
  },
  {
    id: 'accessibleApps',
    name: 'Accessible Portfolio Pieces',
    title: 'Start Building Accessible Web Applications Today',
    byline: 'Marcy Sutton・2h 7m ・ Course',
    image: `https://d2eip9sf3oo6c2.cloudfront.net/series/square_covers/000/000/055/thumb/EGH_AccessibleWeb.png`,
    path: '/courses/start-building-accessible-web-applications-today',
    slug: 'start-building-accessible-web-applications-today',
  },
  {
    id: 'reactTeams',
    name: 'Techniques and Patterns for React Teams',
    byline: 'Juri Strumpflohner・1h 40m・Course',
    description:
      "On the surface, starting a project sounds easy. First you make some directories, install some dependencies, then you write some code. But there's a bit more to it than just those three steps. The type of project you're working on impacts the decisions you make.",
    image:
      'https://d2eip9sf3oo6c2.cloudfront.net/playlists/square_covers/000/405/344/thumb/EGH_ScalingReactNx.png',
    path: '/playlists/scale-react-development-with-nx-4038',
    slug: 'scale-react-development-with-nx-4038',
    title: 'Scale React Development with Nx',
  },
  {
    id: 'portfolioProject',
    name: 'Portfolio Project',
    title: 'Create an eCommerce Store with Next.js and Stripe Checkout',
    path:
      '/projects/create-an-ecommerce-store-with-next-js-and-stripe-checkout',
    image:
      'https://d2eip9sf3oo6c2.cloudfront.net/playlists/square_covers/000/412/781/square_480/ecommerce-stripe-next.png',
    byline: 'Colby Fayock',
    description:
      'Build a modern eCommerce store with the best-in-class tools available to web developers to add to your portfolio.',
  },
  {
    id: 'portfolioBlog',
    name: 'Portfolio Blog',
    title:
      'Build a site from scratch with Next.js, TypeScript, Emotion and Netlify',
    path:
      '/playlists/build-a-blog-with-next-js-typescript-emotion-and-netlify-adcc',
    image:
      'https://d2eip9sf3oo6c2.cloudfront.net/playlists/square_covers/000/387/163/square_480/netlify-ts.png',
    byline: 'Tomasz Łakomy',
    description:
      'Use cutting-edge tools and leverage the best developer experience provided by Next.js to build your developer portfolio blog.',
  },
  {
    id: 'advancedCourse',
    name: 'Mind-Expanding',
    title: 'Composing Closures and Callbacks in JavaScript',
    path: '/playlists/composing-closures-and-callbacks-in-javascript-1223',
    image:
      'https://d2eip9sf3oo6c2.cloudfront.net/playlists/square_covers/000/402/036/full/EGH_ComposingCallbacks_Final.png',
    byline: 'John Lindquist',
    description:
      'This course is for aspiring lead developers. John Lindquist guides you from a blank JavaScript file all the way through creating a library of reusable functions, solving Callback Hell with composition, implementing debouncing, and building a word game among several other examples.',
  },
  {
    id: 'topics',
    name: 'Popular Topics',
    resources: [
      {
        title: 'React',
        path: '/q/react',
        slug: 'react',
        image:
          'https://d2eip9sf3oo6c2.cloudfront.net/tags/images/000/000/026/thumb/react.png',
      },
      {
        title: 'JavaScript',
        path: '/q/javascript',
        slug: 'javascript',
        image:
          'https://d2eip9sf3oo6c2.cloudfront.net/tags/images/000/000/205/thumb/javascriptlang.png',
      },
      {
        title: 'CSS',
        path: '/q/css',
        slug: 'css',
        image:
          'https://d2eip9sf3oo6c2.cloudfront.net/tags/images/000/000/175/square_480/csslang.png',
      },
      {
        title: 'Angular',
        path: '/q/angular',
        slug: 'angular',
        image:
          'https://d2eip9sf3oo6c2.cloudfront.net/tags/images/000/000/300/thumb/angular2.png',
      },
      {
        title: 'Node',
        path: '/q/node',
        slug: 'node',
        image:
          'https://d2eip9sf3oo6c2.cloudfront.net/tags/images/000/000/256/thumb/nodejslogo.png',
      },
      {
        title: 'TypeScript',
        path: '/q/typescript',
        slug: 'typescript',
        image:
          'https://d2eip9sf3oo6c2.cloudfront.net/tags/images/000/000/377/thumb/typescriptlang.png',
      },
      {
        title: 'GraphQL',
        path: '/q/graphql',
        slug: 'graphql',
        image:
          'https://d2eip9sf3oo6c2.cloudfront.net/tags/images/000/001/034/thumb/graphqllogo.png',
      },
      {
        title: 'AWS',
        path: '/q/aws',
        slug: 'aws',
        image:
          'https://d2eip9sf3oo6c2.cloudfront.net/tags/images/000/001/090/thumb/aws.png',
      },

      // {
      //   title: 'Redux',
      //   path: '/q/redux',
      //   image:
      //     'https://d2eip9sf3oo6c2.cloudfront.net/tags/images/000/000/386/thumb/redux.png',
      // },
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
