const nodePageData = [
  {
    id: 'beginner',
    title: 'Beginner',
    name: 'Get Started',
    resources: [
      {
        title: 'Getting Started with Express.js',
        byline: 'Ben Clinkinbeard・1h 4m・Course',
        path: '/courses/getting-started-with-express-js',
        slug: 'getting-started-with-express-js,',
        image:
          'https://d2eip9sf3oo6c2.cloudfront.net/playlists/square_covers/000/432/563/full/course_image.png',
      },
      {
        image:
          'https://d2eip9sf3oo6c2.cloudfront.net/tags/images/000/000/256/full/nodejslogo.png',
        byline: 'Will Button・1h 24m・Course',
        path: '/courses/learn-the-fundamentals-of-node-js-for-beginners-7b6f4282',
        slug: 'learn-the-fundamentals-of-node-js-for-beginners-7b6f4282',
        title: 'Learn the Fundamentals of Node.js for Beginners',
      },
      {
        byline: 'Kevin Cunningham・31m・Course',
        path: '/courses/building-an-api-with-express-f1ea',
        slug: 'building-an-api-with-express-f1ea',
        title: 'Building an API with Express',
        image:
          'https://d2eip9sf3oo6c2.cloudfront.net/tags/images/000/000/256/full/nodejslogo.png',
      },
    ],
  },
  {
    id: 'intermediate',
    title: 'Intermediate',
    name: 'Hitting Your Stride',
    resources: [
      {
        byline: 'Joel Lord・32m・Course',
        path: '/courses/json-web-token-jwt-authentication-with-node-js-and-auth0',
        slug: 'json-web-token-jwt-authentication-with-node-js-and-auth0',
        title: 'Authentication with Node.js and Auth0',
        image:
          'https://d2eip9sf3oo6c2.cloudfront.net/playlists/square_covers/000/432/537/full/EGH_JSONTokensNode_Final.png',
      },
      {
        byline: 'Chris Biscardi・17m・Course',
        path: '/courses/dynamodb-the-node-js-documentclient-1396',
        slug: 'dynamodb-the-node-js-documentclient-1396',
        title: 'DynamoDB: The Node.js DocumentClient',
        image:
          'https://d2eip9sf3oo6c2.cloudfront.net/tags/images/000/000/256/full/nodejslogo.png',
      },
      {
        byline: 'Murphy Randle・4m・Course',
        path: '/courses/making-an-http-server-in-reasonml-on-top-of-node-js-dab086a2',
        slug: 'making-an-http-server-in-reasonml-on-top-of-node-js-dab086a2',
        title: 'Making an HTTP server in ReasonML on top of Node.js',
        image:
          'https://d2eip9sf3oo6c2.cloudfront.net/tags/images/000/000/256/full/nodejslogo.png',
      },
    ],
  },
  {
    id: 'advanced',
    title: 'Advanced',
    name: 'Above And Beyond',
    resources: [
      {
        byline: 'Mark Shust・30m・Course',
        path: '/courses/build-a-twelve-factor-node-js-app-with-docker',
        slug: 'build-a-twelve-factor-node-js-app-with-docker',
        title: 'Build a Twelve-Factor Node.js App with Docker',
        image:
          'https://d2eip9sf3oo6c2.cloudfront.net/playlists/square_covers/000/432/681/full/EGH_NodeDocker_1000.png',
      },
      {
        byline: 'Mike Sherov・55m・Course',
        path: '/courses/web-security-essentials-mitm-csrf-and-xss',
        slug: 'web-security-essentials-mitm-csrf-and-xss',
        title: 'Web Security Essentials: MITM, CSRF, and XSS',
        image:
          'https://d2eip9sf3oo6c2.cloudfront.net/tags/images/000/000/256/full/nodejslogo.png',
      },
      {
        byline: 'Bram Borggreve・31m・Course',
        path: '/courses/build-a-node-js-rest-api-with-loopback',
        slug: 'build-a-node-js-rest-api-with-loopback',
        title: 'Build a Node.js REST API with LoopBack',
        image:
          'https://d2eip9sf3oo6c2.cloudfront.net/tags/images/000/000/256/full/nodejslogo.png',
      },
    ],
  },
  {
    id: 'performance-article',
    name: 'Nodejs Application Performance ',
    title:
      'Improve Performance with the Object Pool Design Pattern in JavaScript',
    description: `The Object Pool design pattern is used in order to improve performance. It does that by reducing runtime memory allocation and garbage collection. There are various real life examples to object pool usage. Game engines are using them, obviously, and any node.js application can benefit from this pattern.`,
    byline: 'Yonatan Kra',
    path: '/blog/object-pool-design-pattern',
    image:
      'https://d2eip9sf3oo6c2.cloudfront.net/tags/images/000/000/256/full/nodejslogo.png',
  },
  {
    id: 'feature-course',
    image: `https://d2eip9sf3oo6c2.cloudfront.net/playlists/square_covers/000/432/498/full/Egh_NodeAWSServerless_Final.png`,
    title: 'Develop a Serverless Backend using Node.js on AWS Lambda',
    byline: 'Nik Graf・15m・Course',
    path: '/courses/develop-a-serverless-backend-using-node-js-on-aws-lambda',
    slug: `develop-a-serverless-backend-using-node-js-on-aws-lambda`,
    description: `In this course we walk through the basics on how to create a serverless API. We start off creating a simple HTTP endpoint. `,
  },
  {
    id: 'secondary-feature-course',
    title: 'Build a REST API with Express 5 and Node 14',
    byline: 'Jamund Ferguson・28m・Course',
    image:
      'https://d2eip9sf3oo6c2.cloudfront.net/tags/images/000/000/359/full/expressjslogo.png',
    path: '/courses/building-an-express-api-with-express-5-and-node-14-7b96',
    slug: 'building-an-express-api-with-express-5-and-node-14-7b96',
  },
]

export default nodePageData
