import * as React from 'react'
import Link from 'next/link'
import Image from 'next/image'

const articles = [
  {
    title: `Content Modeling and Data Design with Sanity.io`,
    description: `How we are using Sanity to add layered contextual metadata to our large catalog of learning resources.`,
    state: 'notes',
    author: {
      name: 'Joel Hooks',
      image:
        'https://res.cloudinary.com/dg3gyk0gu/image/upload/v1611700848/egghead-next-ebombs/article-illustrations/authors/joel-hooks.jpg',
      path: '/q/resources-by-joel-hooks',
    },
    ogImage: {
      url: `https://og-image-react-egghead.now.sh/article/Content%20Modeling%20and Data%20Design%20with%20Sanity.io?author=Joel%20Hooks&theme=dark&bgImage=https://res.cloudinary.com/dg3gyk0gu/image/upload/c_scale,w_1200/v1612730504/egghead-next-ebombs/egghead-content-modeling-with-santity-io/boxes.png`,
    },
    coverImage: {
      url:
        'https://res.cloudinary.com/dg3gyk0gu/image/upload/c_scale,w_1200/v1612730504/egghead-next-ebombs/egghead-content-modeling-with-santity-io/boxes.png',
      alt: 'gradient rainbow of boxes representing data',
    },
    path: '/learn/data/egghead-content-modeling-with-santity-io',
  },
  {
    title: `Build a Content Management System for an E-commerce Store with Next.js and Sanity`,
    description: `Having the ability to build an online store opens up a ton of possibilities, whether you’re building that store for a new client to pay the bills or you’re trying to start your own business. In this article, you will learn how to build a CMS for an ecommerce store with Next.js and Sanity.`,
    state: 'published',
    author: {
      name: 'Colby Fayock',
      image:
        'https://res.cloudinary.com/dg3gyk0gu/image/upload/v1611015219/next.egghead.io/pages/learn/ecommerce/build-a-content-management-system-for-an-e-commerce-store-with-nextjs-and-sanity/image.webp',
      path: '/q/resources-by-colby-fayock',
    },
    contributors: [
      {
        name: 'Lauro Silva',
        type: 'Illustration + Content Review',
        path: '/q/resource-by-lauro-silva',
      },
    ],
    coverImage: {
      url:
        'https://res.cloudinary.com/dg3gyk0gu/image/upload/v1612166212/egghead-next-ebombs/build-a-content-management-system-for-an-e-commerce-store-with-nextjs-and-sanity/system-illustration_2x.png',
      alt: 'abstract illustration of a dashboard',
    },
    ogImage: {
      url: `https://res.cloudinary.com/dg3gyk0gu/image/upload/v1612166442/egghead-next-ebombs/build-a-content-management-system-for-an-e-commerce-store-with-nextjs-and-sanity/system-illustration-ogImage.png`,
    },
    path:
      '/learn/ecommerce/build-a-content-management-system-for-an-e-commerce-store-with-nextjs-and-sanity.mdx',
  },
  {
    title: `Product Images That Don't Byte with the Next.js Image Component`,
    description: `Performance matters no matter the type of project. Providing a good user experience should be fundamental to anything we build. But it becomes even more critical to a business when dealing with an online store. By using the Next.js Image Component, you can add images to your project just like you would the standard img tag and be confident that you’ll be serving optimized images to your website visitors.`,
    status: 'draft',
    author: {
      name: 'Colby Fayock',
      image:
        'https://res.cloudinary.com/dg3gyk0gu/image/upload/v1611015219/next.egghead.io/pages/learn/ecommerce/build-a-content-management-system-for-an-e-commerce-store-with-nextjs-and-sanity/image.webp',
      path: '/q/resources-by-colby-fayock',
    },
    contributors: [
      {
        name: 'Lauro Silva',
        type: 'Content Review',
        path: '/q/resource-by-lauro-silva',
      },
      {
        name: 'Zac Jones',
        type: 'Content Review',
        path: '/q/resources-by-zac-jones',
      },
    ],
    coverImage: {
      url:
        'https://res.cloudinary.com/dg3gyk0gu/image/upload/v1613454662/next.egghead.io/resources/create-an-ecommerce-store-with-next-js-and-stripe-checkout/product-images-ecommerce-article_2x.png',
      alt: 'Image Component Illustration',
    },
    ogImage: {
      url: `https://res.cloudinary.com/dg3gyk0gu/image/upload/v1613465778/next.egghead.io/resources/create-an-ecommerce-store-with-next-js-and-stripe-checkout/product-images-ecommerce-article-ogImage.png`,
    },
    path:
      '/learn/ecommerce/product-images-that-dont-byte-with-the-nextjs-image-component.mdx',
  },
  {
    title: `Codemods with Babel Plugins`,
    description: `A codemod is an automated way to transform one set of syntax into another. They're often written to ship with API changes or other things that fundamentally change the interface developers interact with.`,
    state: 'published',
    author: {
      name: 'Laurie Barth',
      image:
        'https://d2eip9sf3oo6c2.cloudfront.net/instructors/avatars/000/000/281/square_128/laurie_b.jpg',
      path: '/q/resources-by-laurie-barth',
    },
    contributors: [
      {
        name: 'Maggie Appleton',
        type: 'illustration',
        image:
          'https://d2eip9sf3oo6c2.cloudfront.net/instructors/avatars/000/000/281/square_128/laurie_b.jpg',
        path: '/q/resource-by-laurie-barth',
      },
    ],
    coverImage: {
      url:
        'https://res.cloudinary.com/dg3gyk0gu/image/upload/v1607523756/egghead-next-ebombs/article-illustrations/codemods.png',
      alt:
        'abstract illustration of sphere morphing into ring, stop motion style',
    },
    ogImage: {
      url: `https://og-image-react-egghead.now.sh/article/Codemods%20with%20Babel%20Plugins?bgImage=https://res.cloudinary.com/dg3gyk0gu/image/upload/v1607527530/egghead-next-ebombs/article-illustrations/card.png&author=Laurie%20Barth`,
    },
    path: '/learn/javascript/codemods-with-babel-plugins',
  },
  {
    title: `Handling copy and paste in Cypress`,
    description: `There are no out of the box ways of handling copy and paste in Cypress, but there are ways of effectively testing it.`,
    state: 'draft',
    author: {
      name: 'Filip Hric',
      image:
        'https://res.cloudinary.com/dg3gyk0gu/image/upload/v1607904938/next.egghead.io/pages/learn/javascript/handling-copy-and-paste-in-cypress/QSeXT_1d_400x400.jpg',
      path: 'https://filiphric.com/',
    },
    contributors: [
      {
        name: 'Lauro Silva',
        type: 'Content Review',
        image:
          'https://res.cloudinary.com/dg3gyk0gu/image/upload/v1607909398/next.egghead.io/pages/learn/javascript/handling-copy-and-paste-in-cypress/Zx-2ko9t_400x400.jpg',
        path: '/q/resource-by-lauro-silva',
      },
    ],
    coverImage: {
      url:
        'https://res.cloudinary.com/dg3gyk0gu/image/upload/v1607937478/next.egghead.io/pages/learn/javascript/handling-copy-and-paste-in-cypress/copy-and-paste.png',
      alt: 'abstract illustration of copy and paste',
    },
    ogImage: {
      url: `https://og-image-react-egghead.now.sh/article/Handling%20copy%20and%20paste%20in%20Cypress?bgImage=https://res.cloudinary.com/dg3gyk0gu/image/upload/v1607941112/next.egghead.io/pages/learn/javascript/handling-copy-and-paste-in-cypress/card.png&author=Filip%20Hric&state=draft`,
    },
    path: '/learn/javascript/handling-copy-and-paste-in-cypress',
  },
  {
    title: `Improve Performance with the Object Pool Design Pattern in JavaScript`,
    description: `This is an in-depth article on the object pool design pattern and how it used to improve performance.`,
    state: 'draft',
    author: {
      name: 'Yonatan Kra',
      image:
        'https://res.cloudinary.com/dg3gyk0gu/image/upload/v1611011780/next.egghead.io/pages/learn/javascript/improve-performance-with-the-object-pool-design-pattern-in-javascript/image.webp',
      path: '/q/resources-by-yonatan-kra',
    },
    coverImage: {
      url:
        'https://res.cloudinary.com/dg3gyk0gu/image/upload/v1611025373/next.egghead.io/pages/learn/javascript/improve-performance-with-the-object-pool-design-pattern-in-javascript/coverImage.png',
      alt: 'abstract illustration of speed test',
    },
    ogImage: {
      url: `https://res.cloudinary.com/dg3gyk0gu/image/upload/v1611025373/next.egghead.io/pages/learn/javascript/improve-performance-with-the-object-pool-design-pattern-in-javascript/ogImage.png`,
    },
    path:
      '/learn/javascript/improve-performance-with-the-object-pool-design-pattern-in-javascript',
  },

  {
    title: `Use the Intersection Observer API For Analytics Events`,
    description: `Pageviews only tell a tiny part of the story of what your visitors are doing on your site. Modern web APIs make creating tracking for certain events much more performant than in the past, and one of those is Intersection Observer.`,
    state: 'published',
    author: {
      name: 'Stephanie Eckles',
      image:
        'https://d2eip9sf3oo6c2.cloudfront.net/instructors/avatars/000/000/406/medium/StephEckles.JPG',
      path: '/q/resources-by-stephanie-eckles',
    },
    contributors: [
      {
        name: 'Lauro Silva',
        type: 'Illustration + Content Review',
        path: '/q/resource-by-lauro-silva',
      },
    ],
    coverImage: {
      url:
        'https://res.cloudinary.com/dg3gyk0gu/image/upload/v1612477966/egghead-next-ebombs/use-the-intersection-observer-api-for-analytics-events/cover.png',
      alt: '3D illustration with motion',
    },
    ogImage: {
      url: `https://res.cloudinary.com/dg3gyk0gu/image/upload/v1612477966/egghead-next-ebombs/use-the-intersection-observer-api-for-analytics-events/ogImage.png`,
    },
    path:
      '/learn/javascript/use-the-intersection-observer-api-for-analytics-events',
  },

  {
    title: `TailwindCSS Dark Mode in Next.js with Tailwind Typography Prose Classes`,
    description: `Add a dark and light mode toggle switch to your Next.js fueled Tailwind styled website.`,
    state: 'draft',
    author: {
      name: 'Joel Hooks',
      image:
        'https://res.cloudinary.com/dg3gyk0gu/image/upload/v1611700848/egghead-next-ebombs/article-illustrations/authors/joel-hooks.jpg',
      path: '/q/resources-by-joel-hooks',
    },
    coverImage: {
      url: '',
      alt: '',
    },
    ogImage: {
      url: `https://og-image-react-egghead.now.sh/article/TailwindCSS%20Dark%20Mode%20in%20Next.js?author=Joel%20Hooks&bgImage=https://res.cloudinary.com/dg3gyk0gu/image/upload/v1611700753/egghead-next-ebombs/article-illustrations/gradient-for-post.png`,
    },
    path: '/learn/next/tailwindcss-dark-mode-nextjs-typography-prose',
  },
  {
    title: `Rails + GraphQL + TypeScript + React + Apollo`,
    state: 'draft',
    author: {
      name: 'Ryan Bigg',
      image:
        'https://res.cloudinary.com/dg3gyk0gu/image/upload/v1608026938/next.egghead.io/pages/learn/graphql/rails-graphql-typescript-react-apollo/ryan-bigg.jpg',
      path: 'https://ryanbigg.com/',
    },
    coverImage: {
      url:
        'https://res.cloudinary.com/dg3gyk0gu/image/upload/v1608031669/next.egghead.io/pages/learn/graphql/rails-graphql-typescript-react-apollo/rails-graphql-typescript-react-apollo_2x.png',
      alt:
        'abstract illustration of user interface built using Rails, GraphQL, TypeScript, React, and Apollo',
    },
    ogImage: {
      url: `https://og-image-react-egghead.now.sh/article/Rails%20+%20GraphQL%20+%20TypeScript%20+%20React%20+%20Apollo?bgImage=https://res.cloudinary.com/dg3gyk0gu/image/upload/v1608031567/next.egghead.io/pages/learn/graphql/rails-graphql-typescript-react-apollo/rails-graphql-typescript-react-apollo-card.png&author=Ryan%20Bigg&state=draft`,
    },
    path: '/learn/rails-graphql-typescript-react-apollo',
  },
  {
    title: `Simple GitHub Issues Powered Blog`,
    description: `Create a simple blog using GitHub issues as the post and rendered with React`,
    state: 'notes',
    author: {
      name: 'Joel Hooks',
      image:
        'https://res.cloudinary.com/dg3gyk0gu/image/upload/v1611700848/egghead-next-ebombs/article-illustrations/authors/joel-hooks.jpg',
      path: '/q/resources-by-joel-hooks',
    },
    ogImage: {
      url: `https://og-image-react-egghead.now.sh/article/Simple%20GitHub%20Issues%20Powered%20Blog%20in%2015-minutes?author=Joel%20Hooks&theme=dark`,
    },
    path: '/learn/gardening/github-issues-powered-blog',
  },
  {
    title: `Interact with the DOM using JavaScript`,
    contributors: [{name: 'Hiro Nishimura'}, {name: 'Maggie Appleton'}],
    path: '/learn/javascript/interact-DOM',
  },
  {
    title: `The Real Introduction to JavaScript`,
    contributors: [{name: 'Hiro Nishimura'}, {name: 'Maggie Appleton'}],
    path: '/learn/javascript/javascript-introduction',
  },
  {
    title: `What is the DOM?`,
    contributors: [{name: 'Hiro Nishimura'}, {name: 'Maggie Appleton'}],
    path: '/learn/javascript/the-dom',
  },
  {
    title: `A Guide to ES6`,
    contributors: [{name: 'Hiro Nishimura'}],
    path: '/learn/javascript/es6.mdx',
  },
  {
    title: `JavaScript Ultimate Guide`,
    path: '/learn/javascript',
  },
  {
    title: `React for Beginners`,
    path: '/learn/react/beginners',
  },
  {
    title: `React State Management`,
    path: '/learn/react/state-management',
  },
  {
    title: `React Ultimate Guide`,
    contributors: [{name: 'Joel Hooks'}, {name: 'Will Johnson'}],
    path: '/learn/react',
  },
  {
    title: `Is React.js a framework or a toolkit?`,
    contributors: [{name: 'Joel Hooks'}],
    updatedOn: '2020-08-21',
    bigIdeas: ['metaframeworks'],
    path: '/learn/react/toolkit-or-framework.mdx',
  },
  {
    title: `Understanding by Design in a Nutshell`,
    contributors: [{name: 'Taylor Bell'}, {name: 'Joel Hooks'}],
    path: '/learn/understanding-by-design',
  },
  {
    title: `Performance Task Patterns`,
    contributors: [{name: 'Taylor Bell'}],
    path: '/learn/understanding-by-design/performance-task-patterns.mdx',
  },
  {
    title: `Sales Safari in a Nutshell`,
    path: '/learn/30x500/sales-safari',
  },
]

const Learn: React.FC = () => {
  return (
    <div className="prose dark:prose-dark mx-auto max-w-screen-md lg:mt-14 md:mt-8 mt-3">
      <h1>Articles</h1>
      {articles.map((article: any) => {
        return (
          <div className="py-2">
            {article.coverImage?.url && (
              <div className="mt-4">
                <Image
                  src={article.coverImage.url}
                  alt={article.coverImage.alt || article.title}
                  width={1280}
                  height={720}
                  quality={100}
                  className="rounded-lg"
                />
              </div>
            )}
            <Link key={article.path} href={article.path}>
              <a>
                <h2>{article.title}</h2>
              </a>
            </Link>
            {article.description && <p>{article.description}</p>}
          </div>
        )
      })}
    </div>
  )
}

export default Learn
