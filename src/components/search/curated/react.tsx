import Link from 'next/link'

const SearchReact = () => (
  <>
    <div className="grid md:grid-cols-12 grid-cols-1 gap-5 items-start sm:mt-5 mt-3">
      <div className="col-span-6 grid grid-cols-8 h-full relative items-start overflow-hidden rounded-md border border-gray-200">
        <div
          className="overflow-hidden sm:col-span-2 col-span-2 w-full h-full"
          style={{
            background:
              'url(https://res.cloudinary.com/dg3gyk0gu/image/upload/v1604411002/next.egghead.io/react/space_2x.png)',
            backgroundSize: 'cover',
            backgroundPosition: '38%',
          }}
        />
        <div className="sm:col-span-6 col-span-6 sm:p-8 p-4 sm:pr-3 flex flex-col justify-start h-full">
          <h1 className="sm:text-2xl text-xl font-bold">React</h1>
          <div className="prose pt-2 sm:text-base text-sm leading-normal text-gray-800 mt-0">
            <p>
              The one of the web’s most popular frameworks for building
              JavaScript applications. If you know what you’re doing, React can
              drastically simplify how you build, use, and maintain code.
            </p>
            <p>
              Whether you’re a React newbie or you’re ready for advanced
              techniques, you can level-up with egghead.
            </p>
          </div>
        </div>
      </div>
      <div className="col-span-6 sm:p-8 p-5 border border-gray-200 mt-0 rounded-md">
        <div className="flex items-center mb-4">
          <img
            src="https://res.cloudinary.com/dg3gyk0gu/image/upload/v1604409609/next.egghead.io/icons/bulp.svg"
            alt="a bulp icon"
          />
          <h3 className="ml-3 text-lg font-semibold leading-tight">
            React is just JavaScript
          </h3>
        </div>
        <div className="prose prose-sm max-w-none mt-0">
          <p>
            One of the nice aspects of React is that it is just JavaScript. When
            you are creating react applications, you are able to use all of your
            core knowledge avout JavaScript and apply it to the creation of
            components in React.
          </p>
          <p>
            Of course, if your JavaScript fundamentals aren't quite there yet,
            this can be an entirely different challenge!
          </p>
          <p>
            We highly recommend{' '}
            <a href="https://kentcdodds.com/blog/javascript-to-know-for-react">
              Kent C. Dodds's article on JavaScript for React
            </a>{' '}
            to get an idea of the <b>essential JavaScript</b> you'll need to be
            successful on your React journey.
          </p>
        </div>
      </div>
    </div>

    <div className="grid md:grid-cols-12 grid-cols-1 gap-5 mt-5">
      <div className="md:col-span-8 grid grid-flow-row gap-5">
        <article className="md:p-8 p-5 rounded-md overflow-hidden border border-gray-200">
          <h3 className="sm:text-xl text-lg font-semibold">
            State Management in React
          </h3>
          <div className="prose mt-1 sm:text-base text-sm">
            Learn how to go about storing state in React, the right way
          </div>
          <ul className="mt-6 -mb-3">
            <li>
              <Link href="/playlists/up-and-running-with-recoil-a-new-state-management-library-for-react-78b8">
                <a className="flex font-semibold py-2 hover:underline cursor-pointer leading-tight">
                  <img
                    src="https://d2eip9sf3oo6c2.cloudfront.net/tags/images/000/000/026/thumb/react.png"
                    className="w-6 h-6 mr-2"
                  />
                  Up and running with Recoil - a new state management library
                  for React
                </a>
              </Link>
            </li>
            <li>
              <Link href="/courses/manage-react-form-state-with-redux-form">
                <a className="flex font-semibold py-2 hover:underline cursor-pointer leading-tight">
                  <img
                    src="https://d2eip9sf3oo6c2.cloudfront.net/series/square_covers/000/000/197/square_480/Manage_React_Form.png"
                    className="w-6 h-6 mr-2"
                  />
                  Manage React Form State with redux-form
                </a>
              </Link>
            </li>
            <li>
              <Link href="/courses/react-context-for-state-management">
                <a className="flex font-semibold py-2 hover:underline cursor-pointer leading-tight">
                  <img
                    src="https://d2eip9sf3oo6c2.cloudfront.net/series/square_covers/000/000/262/square_480/EGH_ReactContext_Final.png"
                    className="w-6 h-6 mr-2"
                  />
                  React Context for State Management
                </a>
              </Link>
            </li>
            <li>
              <Link href="/lessons/react-update-state-asynchronously-in-react-using-promise-and-setstate">
                <a className="flex font-semibold py-2 hover:underline cursor-pointer leading-tight">
                  <img
                    src="https://d2eip9sf3oo6c2.cloudfront.net/tags/images/000/000/026/thumb/react.png"
                    className="w-6 h-6 mr-2"
                  />
                  Update state asynchronously in React using Promise and
                  setState()
                </a>
              </Link>
            </li>
          </ul>
        </article>
        <article className="md:p-8 p-5 rounded-md overflow-hidden border border-gray-200">
          <h3 className="sm:text-xl text-lg font-semibold leading-tight">
            React Hooks
          </h3>
          <div className="prose mt-1 sm:text-base text-sm">
            What's the catch?
          </div>
          <ul className="mt-6 -mb-3">
            <li>
              <Link href="/playlists/build-advanced-component-with-react-hooks-cd6a">
                <a className="flex font-semibold py-2 hover:underline cursor-pointer leading-tight">
                  <img
                    src="https://d2eip9sf3oo6c2.cloudfront.net/tags/images/000/000/026/thumb/react.png"
                    className="w-6 h-6 mr-2"
                  />
                  Build Advanced Component with React Hooks
                </a>
              </Link>
            </li>

            <li>
              <Link href="/playlists/learn-apollo-client-hooks-9226f672">
                <a className="flex font-semibold py-2 hover:underline cursor-pointer leading-tight">
                  <img
                    src="https://d2eip9sf3oo6c2.cloudfront.net/tags/images/000/001/034/thumb/graphqllogo.png"
                    className="w-6 h-6 mr-2"
                  />
                  Learn Apollo Client Hooks
                </a>
              </Link>
            </li>
            <li>
              <Link href="/playlists/react-crash-course-58eb">
                <a className="flex font-semibold py-2 hover:underline cursor-pointer leading-tight">
                  <img
                    src="https://d2eip9sf3oo6c2.cloudfront.net/tags/images/000/000/026/thumb/react.png"
                    className="w-6 h-6 mr-2"
                  />
                  React Crash Course (with hooks)
                </a>
              </Link>
            </li>
          </ul>
        </article>
        <article className="md:p-8 p-5 rounded-md overflow-hidden border border-gray-200">
          <h3 className="sm:text-xl text-lg font-semibold leading-tight">
            Build Professional Real World Apps
          </h3>
          <div className="prose mt-1 sm:text-base text-sm">
            Level up your React development career
          </div>
          <ul className="mt-6 -mb-3">
            <li>
              <Link href="/courses/progressive-web-apps-in-react-with-create-react-app">
                <a className="flex font-semibold py-2 hover:underline cursor-pointer leading-tight">
                  <img
                    src="https://d2eip9sf3oo6c2.cloudfront.net/series/square_covers/000/000/266/thumb/EGH_PWAReact_Final.png"
                    className="w-6 h-6 mr-2"
                  />
                  Progressive Web Apps in React with create-react-app
                </a>
              </Link>
            </li>
            <li>
              <Link href="/courses/build-a-react-app-with-redux">
                <a className="flex font-semibold py-2 hover:underline cursor-pointer leading-tight">
                  <img
                    src="https://d2eip9sf3oo6c2.cloudfront.net/series/square_covers/000/000/135/thumb/EGH_ReactRedux_Final.png"
                    className="w-6 h-6 mr-2"
                  />
                  Build A React App With Redux
                </a>
              </Link>
            </li>
            <li>
              <Link href="/playlists/build-a-name-picker-app-intro-to-react-hooks-context-api-1ded">
                <a className="flex font-semibold py-2 hover:underline cursor-pointer leading-tight">
                  <img
                    src="https://d2eip9sf3oo6c2.cloudfront.net/tags/images/000/000/026/thumb/react.png"
                    className="w-6 h-6 mr-2"
                  />
                  Build a "Name Picker" app - Intro to React, Hooks & Context
                  API
                </a>
              </Link>
            </li>
          </ul>
        </article>
      </div>
      <aside className="md:col-span-4 rounded-md overflow-hidden border-0 border-gray-200">
        <a href="https://epicreact.dev" className="">
          <img
            className="md:p-0 px-32"
            src="https://egghead.io/webpack/a03682deb1d0acefc51e1015b3aa8008.png"
            alt="epicreact.dev by Kent C. Dodds"
          />
        </a>
      </aside>
    </div>
  </>
)

export default SearchReact
