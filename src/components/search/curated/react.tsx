import * as React from 'react'
import {NextSeo} from 'next-seo'
import Card from '../components/card'
import Callout from '../components/callout'
import Topic from '../components/topic'
import Resource from '../components/resource'

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
            <ul className="-mb-2">
              <Resource
                title="Up and running with Recoil - a new state management library for React"
                path="/playlists/up-and-running-with-recoil-a-new-state-management-library-for-react-78b8"
                imageUrl="https://d2eip9sf3oo6c2.cloudfront.net/tags/images/000/000/026/thumb/react.png"
              />
              <Resource
                title="Manage React Form State with redux-form"
                path="/courses/manage-react-form-state-with-redux-form"
                imageUrl="https://d2eip9sf3oo6c2.cloudfront.net/series/square_covers/000/000/197/full/Manage_React_Form.png"
              />
              <Resource
                title="React Context for State Management"
                path="/courses/react-context-for-state-management"
                imageUrl="https://d2eip9sf3oo6c2.cloudfront.net/series/square_covers/000/000/262/full/EGH_ReactContext_Final.png"
              />
              <Resource
                title="Update state asynchronously in React using Promise and `setState()`"
                path="/lessons/react-update-state-asynchronously-in-react-using-promise-and-setstate"
                imageUrl="https://d2eip9sf3oo6c2.cloudfront.net/tags/images/000/000/026/thumb/react.png"
              />
            </ul>
          </Card>
          <Card title="React Hooks" description="Simplify your code base">
            <ul className="-mb-2">
              <Resource
                title="Build Advanced Component with React Hooks"
                path="/playlists/build-advanced-component-with-react-hooks-cd6a"
                imageUrl="https://d2eip9sf3oo6c2.cloudfront.net/tags/images/000/000/026/thumb/react.png"
              />
              <Resource
                title="Learn Apollo Client Hooks"
                path="/playlists/learn-apollo-client-hooks-9226f672"
                imageUrl="https://d2eip9sf3oo6c2.cloudfront.net/tags/images/000/001/034/thumb/graphqllogo.png"
              />
              <Resource
                title="React Crash Course (with hooks)"
                path="/playlists/react-crash-course-58eb"
                imageUrl="https://d2eip9sf3oo6c2.cloudfront.net/tags/images/000/000/026/thumb/react.png"
              />
            </ul>
          </Card>
          <Card
            title=" Build Professional Real World Apps"
            description="Level up your React development career"
          >
            <ul className="-mb-2">
              <Resource
                title="Progressive Web Apps in React with create-react-app"
                path="/courses/progressive-web-apps-in-react-with-create-react-app"
                imageUrl="https://d2eip9sf3oo6c2.cloudfront.net/series/square_covers/000/000/266/full/EGH_PWAReact_Final.png"
              />
              <Resource
                title="Build A React App With Redux"
                path="/courses/build-a-react-app-with-redux"
                imageUrl="https://d2eip9sf3oo6c2.cloudfront.net/series/square_covers/000/000/135/full/EGH_ReactRedux_Final.png"
              />
              <Resource
                title={`Build a "Name Picker" app - Intro to React, Hooks & Context API`}
                path="/playlists/build-a-name-picker-app-intro-to-react-hooks-context-api-1ded"
                imageUrl="https://d2eip9sf3oo6c2.cloudfront.net/series/square_covers/000/000/262/full/EGH_ReactContext_Final.png"
              />
            </ul>
          </Card>
        </div>
        <aside className="md:col-span-4 rounded-md overflow-hidden border-0 border-gray-100">
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
