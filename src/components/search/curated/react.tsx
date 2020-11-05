import {NextSeo} from 'next-seo'
import Card from '../components/card'
import Stack from '../components/stack'
import Callout from '../components/callout'
import Topic from '../components/topic'

const SearchReact = () => {
  const description = `Life is too short for lonnnnnng boring videos. Learn React using the best screencast tutorial videos online.`
  const title = `Advanced React Tutorials for ${new Date().getFullYear()}`
  return (
    <>
      <NextSeo
        description={description}
        title={title}
        titleTemplate={'%s | egghead.io'}
        twitter={{
          site: `@eggheadio`,
          cardType: 'summary_large_image',
        }}
        openGraph={{
          title,
          description: description,
          site_name: 'egghead',
          images: [
            {
              url: `https://res.cloudinary.com/dg3gyk0gu/image/upload/v1604437767/eggo/React_Planet.png`,
            },
          ],
        }}
      />
      <div className="grid md:grid-cols-12 grid-cols-1 gap-5 items-start sm:mt-5 mt-3">
        <Topic
          className="col-span-6"
          title="React"
          imageUrl="https://res.cloudinary.com/dg3gyk0gu/image/upload/v1604411002/next.egghead.io/react/space_2x.png"
        >
          {`
The one of the web’s most popular frameworks for building
JavaScript applications. If you know what you’re doing, React
can drastically simplify how you build, use, and maintain code.

Whether you’re a React newbie or you’re ready for advanced
techniques, you can level-up with egghead.
`}
        </Topic>

        <Callout
          title="React is just JavaScript"
          imageUrl="https://res.cloudinary.com/dg3gyk0gu/image/upload/v1604409609/next.egghead.io/icons/bulp.svg"
          className="col-span-6"
        >
          {`
One of the nice aspects of React is that it is just JavaScript.
When you are creating react applications, you are able to use all
of your core knowledge avout JavaScript and apply it to the
creation of components in React.

Of course, if your JavaScript fundamentals aren't quite there yet,
this can be an entirely different challenge!

We highly recommend [Kent C. Dodds's article on JavaScript for React](https://kentcdodds.com/blog/javascript-to-know-for-react) to get an idea of the **essential JavaScript** you'll need to
be successful on your React journey.

`}
        </Callout>
      </div>
      <div className="grid md:grid-cols-12 grid-cols-1 gap-5 mt-5">
        <div className="md:col-span-8 grid grid-flow-row gap-5">
          <Card
            title="State Management in React"
            description="Learn how to store state in React, the right way"
          >
            <Stack
              resources={[
                {
                  type: 'playlist',
                  slug:
                    'up-and-running-with-recoil-a-new-state-management-library-for-react-78b8',
                },
                {
                  type: 'course',
                  slug: 'manage-react-form-state-with-redux-form',
                },
                {
                  type: 'course',
                  slug: 'react-context-for-state-management',
                },
                {
                  type: 'lesson',
                  slug:
                    'react-update-state-asynchronously-in-react-using-promise-and-setstate',
                },
              ]}
            />
          </Card>
          <Card title="React Hooks" description="Simplify your code base">
            <Stack
              resources={[
                {
                  type: 'playlist',
                  slug: 'build-advanced-component-with-react-hooks-cd6a',
                },
                {
                  type: 'playlist',
                  slug: 'learn-apollo-client-hooks-9226f672',
                },
                {
                  type: 'playlist',
                  slug: 'react-crash-course-58eb',
                },
              ]}
            />
          </Card>
          <Card
            title=" Build Professional Real World Apps"
            description="Level up your React development career"
          >
            <Stack
              resources={[
                {
                  type: 'course',
                  slug: 'progressive-web-apps-in-react-with-create-react-app',
                },
                {
                  type: 'course',
                  slug: 'build-a-react-app-with-redux',
                },
                {
                  type: 'playlist',
                  slug:
                    'build-a-name-picker-app-intro-to-react-hooks-context-api-1ded',
                },
              ]}
            />
          </Card>
        </div>
        <aside className="md:col-span-4 rounded-md overflow-hidden border-0 border-gray-200">
          <a href="https://epicreact.dev">
            <img
              src="https://egghead.io/webpack/a03682deb1d0acefc51e1015b3aa8008.png"
              alt="epicreact.dev by Kent C. Dodds"
            />
          </a>
        </aside>
      </div>
    </>
  )
}
export default SearchReact
