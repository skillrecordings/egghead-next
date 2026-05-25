import * as React from 'react'
import SearchInstructorEssential from '../instructor-essential'
import CtaCard from '@/components/search/components/cta-card'
import {HorizontalResourceCard} from '@/components/card/horizontal-resource-card'
import {VerticalResourceCollectionCard} from '@/components/card/vertical-resource-collection-card'

export default function SearchChrisBiscardi({instructor}: {instructor: any}) {
  instructor = {...instructor, ...curatedInstructorData}
  const {courses, jamstackCollection, databaseCollection} = instructor
  const [primaryCourse, secondCourse, thirdCourse] = courses.resources
  const location = 'Chris Biscardi instructor page'

  return (
    <div className="max-w-screen-xl mx-auto">
      <div className="py-4">
        <SearchInstructorEssential
          instructor={instructor}
          CTAComponent={
            <CtaCard
              resource={primaryCourse}
              trackTitle="clicked instructor landing page CTA resource"
              location="Chris Biscardi instructor page"
              textLight
            />
          }
        />
        <section>
          <h2 className="sm:px-5 px-3 my-4 lg:text-2xl sm:text-xl text-lg dark:text-white font-semibold leading-tight">
            Featured Courses
          </h2>
          <div className="flex md:flex-row flex-col max-w-screen-xl mx-auto gap-4 px-4 md:px-0 ">
            <HorizontalResourceCard
              resource={secondCourse}
              location={location}
              className="md:w-1/2"
            />
            <HorizontalResourceCard
              resource={thirdCourse}
              location={location}
              className="md:w-1/2"
            />
          </div>
        </section>

        <section className="flex md:flex-row flex-col max-w-screen-xl mx-auto gap-4 px-4 md:px-0 my-4">
          <div className="flex flex-row sm:flex-nowrap flex-wrap gap-4">
            <VerticalResourceCollectionCard
              resource={jamstackCollection}
              className="w-1/2"
            />
            <VerticalResourceCollectionCard
              resource={databaseCollection}
              className="w-1/2"
            />
          </div>
        </section>
      </div>
    </div>
  )
}

const curatedInstructorData = {
  courses: {
    resources: [
      {
        background:
          'https://res.cloudinary.com/dg3gyk0gu/image/upload/v1632258770/next.egghead.io/resources/digital-garden-cli-with-rust/feature-card-background--digital-garden.png',
        byline: 'Chris Biscardi • 1h 10m • Course',
        description:
          'Build a Rust CLI to create notes for your digital garden. Step by step you will build, run, and test the CLI while learning core Rust concepts like move/copy semantics.',
        image:
          'https://d2eip9sf3oo6c2.cloudfront.net/playlists/square_covers/000/429/801/full/rust-garden-cli_424_2x.png',
        instructor: {
          name: 'Chris Biscardi',
        },
        path: '/courses/creating-a-digital-garden-cli-with-rust-34b8',
        title: 'Create a Digital Garden CLI with Rust',
      },
      {
        background: null,
        byline: 'Chris Biscardi・1h 4m・Course',
        description:
          "This course walks you through Rustlings exercises in a way that explains what's going on in each exercise. We cover everything from basic types to generics and threading.",
        image:
          'https://d2eip9sf3oo6c2.cloudfront.net/tags/images/000/001/226/full/rust.png',
        instructor: {
          name: 'Chris Biscardi',
        },
        path: '/courses/learning-rust-by-solving-the-rustlings-exercises-a722',
        title: 'Learning Rust by Working Through the Rustlings Exercises',
      },
      {
        background:
          'https://res.cloudinary.com/dg3gyk0gu/image/upload/v1632758569/next.egghead.io/resources/building-an-opengraph-image-generation-api-with-cloudinary-netlify-functions-and-react/feature-card-background--build-an-openGraph.png',
        byline: 'Chris Biscardi • 53m • Course',
        description:
          'You will come away from this collection with the ability to ship an API that you can use on any of your sites.',
        image:
          'https://d2eip9sf3oo6c2.cloudfront.net/playlists/square_covers/000/354/624/full/ogcards_netlify_cloudinary.png',
        instructor: {
          name: 'Chris Biscardi',
        },
        path: '/courses/building-an-opengraph-image-generation-api-with-cloudinary-netlify-functions-and-react-914e',
        title:
          'Building an OpenGraph image generation API with Cloudinary, Netlify Functions, and React',
      },
    ],
  },
  databaseCollection: {
    description: null,
    resources: [
      {
        background: null,
        byline: null,
        description:
          "This collection includes introductory level material for AWS DynamoDB. We cover what DynamoDB is, when you'd use it, and the vocabulary you'll need to understand documentation and talks in the ecosystem.\n\nYou'll come out of this playlist with the ability to understand what people mean when they say DynamoDB and the base you need to get started yourself.\n\n**View and contribute to the [Community Notes!](https://github.com/eggheadio-projects/intro-to-dynamodb)**",
        image:
          'https://d2eip9sf3oo6c2.cloudfront.net/tags/images/000/001/090/full/aws.png',
        instructor: {
          name: 'Chris Biscardi',
        },
        path: '/courses/intro-to-dynamodb-f35a',
        title: 'Intro to DynamoDB',
      },
      {
        background: null,
        byline: null,
        description:
          'This collection is a sequel to the [Building a Serverless JAMStack Todo app with Netlify, Gatsby, GraphQL, and FaunaDB](https://egghead.io/playlists/building-a-serverless-jamstack-todo-app-with-netlify-gatsby-graphql-and-faunadb-53bb) collection. In this collection we take the TODO application we built and convert it to run using Netlify Identity, AWS Lambda (using the serverless framework) and DynamoDB. We cover\n\n* Fauna vs DynamoDB and when to use each\n* Setting up AWS accounts\n* Creating DynamoDB tables and data modeling differences between Fauna and Dynamo\n* Converting our Netlify Functions deployment to a Serverless Framework deployment\n* Implementing Custom authorizer functions on AWS\n\nIt uses tools that remove as many of the barriers as possible. Netlify Functions grows into Serverless Framework adn AWS Lambda, Netlify Identity is kept around, and FaunaDB can grows into DynamoDB.\n\n',
        image:
          'https://d2eip9sf3oo6c2.cloudfront.net/tags/images/000/001/281/full/Fauna_Logo_blue.png',
        instructor: {
          name: 'Chris Biscardi',
        },
        path: '/courses/converting-a-serverless-app-to-run-on-aws-lambda-and-dynamodb-with-serverless-framework-223a',
        title:
          'Converting a Serverless App to run on AWS Lambda and DynamoDB with Serverless Framework',
      },
      {
        background: null,
        byline: 'Chris Biscardi・17m・Course',
        description:
          "This playlist covers all of the ways to use the node.js DocumentClient to interact with one or more DynamoDB tables.\n\n\nnote: We do not cover scan() as it is not recommended for most usage and if you need it you'll know how to read the documentation to use it by the end of this collection.",
        image:
          'https://d2eip9sf3oo6c2.cloudfront.net/tags/images/000/000/256/full/nodejslogo.png',
        instructor: {
          name: 'Chris Biscardi',
        },
        path: '/courses/dynamodb-the-node-js-documentclient-1396',
        title: 'DynamoDB: The Node.js DocumentClient',
      },
    ],
    title: 'Database',
  },
  jamstackCollection: {
    description: null,
    resources: [
      {
        background: null,
        byline: null,
        description:
          "When you see the word “theme” you might think of the visual aspects of a site or code editor where setting an option in one place can change the look everywhere.\n\nGatsby Themes take this idea to another level by allowing you to change and compose entire pieces of functionality.\n\nIn this advanced course, you will iteratively convert a fictitious SaaS website with marketing, eCommerce, blog, and dashboard pages into a set of horizontally composed Gatsby Themes.\n\nAfter everything's been split up, you will build a deeper understanding of parent/child theme relationships by exploring the blog data model with schema customization APIs that allow us to create multiple child themes with data sourced from different node types.",
        image:
          'https://d2eip9sf3oo6c2.cloudfront.net/playlists/square_covers/000/432/548/full/GatsbyThemes.png',
        instructor: {
          name: 'Chris Biscardi',
        },
        path: '/courses/composable-gatsby-themes',
        title: 'Composable Gatsby Themes',
      },
      {
        background: null,
        byline: null,
        description:
          'MDX is an authorable format that lets you seamlessly write JSX in your Markdown documents. \n\nGatsby is a free and open source framework based on React that helps developers build blazing fast websites and apps\n\nTogether, they combine to create a powerful platform for docs, blogs, and other rich applications.',
        image:
          'https://d2eip9sf3oo6c2.cloudfront.net/tags/images/000/001/211/full/gatsby.png',
        instructor: {
          name: 'Chris Biscardi',
        },
        path: '/courses/building-websites-with-mdx-and-gatsby-161e9529',
        title: 'Building Websites with MDX and Gatsby',
      },
      {
        background: null,
        byline: null,
        description:
          'This application serves as an introduction to building products with a JAMStack and Serverless approach. We cover everything from the beginning:\n\n* starting with the Gatsby client\n* handling authentication with Netlify Identity\n* Shipping a GraphQL server on Netlify Functions\n* Building in access control with a serverless capable database\n\nIt uses tools that remove as many of the barriers as possible while also allowing upgrading in the future. Netlify Functions can grow into AWS Lambda, Netlify Identity can grow into Auth0 or Cognito, and FaunaDB can grow into DynamoDB.',
        image:
          'https://d2eip9sf3oo6c2.cloudfront.net/tags/images/000/001/211/full/gatsby.png',
        instructor: {
          name: 'Chris Biscardi',
        },
        path: '/courses/building-a-serverless-jamstack-todo-app-with-netlify-gatsby-graphql-and-faunadb-53bb',
        title:
          'Building a Serverless JAMStack Todo app with Netlify, Gatsby, GraphQL, and FaunaDB',
      },
    ],
    title: 'Jamstack',
  },
  title: 'Chris Biscardi Landing Page',
} as Record<string, any>
