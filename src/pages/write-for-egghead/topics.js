import React from 'react'

const topicLists = [
  {
    topicTitle: 'General Topics',
    topics: [
      {headline: 'Vue 3'},
      {headline: 'Svelte'},
      {headline: 'TypeScript'},
      {headline: 'Accessibility'},
      {headline: 'Cloudflare Workers'},
      {headline: 'Observability'},
      {headline: 'Serverless'},
      {headline: 'AWS (most of it!)'},
      {headline: 'Next.js'},
      {headline: 'E-Commerce'},
      {headline: 'React Concurrent Mode Patterns'},
      {headline: 'Zustand'},
      {headline: 'React-Query'},
      {headline: 'Http Caching'},
      {headline: 'Mdx'},
      {headline: 'How to Give a Great Technical Talk'},
      {headline: 'Tailwind'},
      {headline: 'Design Systems'},
      {headline: 'React-Three-Fiber'},
      {headline: '"Advanced Beginner" Css'},
      {headline: 'Design Patterns'},
      {headline: 'Functional Programming'},
      {headline: 'Open Source Development'},
      {headline: 'Github Actions'},
      {headline: 'Vs Code (Tools in General)'},
      {headline: 'Design for Developers'},
      {headline: 'Problem Solving'},
      {headline: 'Debugging'},
      {headline: 'Performance Testing and Tuning'},
      {headline: 'Digital Gardens'},
      {headline: 'Patterns of Learning'},
    ],
  },
  {
    topicTitle: 'Beginners React',
    topics: [
      {
        headline: 'What are the essential principles of React?',
        points: `- React is made up of reusable components
                - modern web development is component based
                - components can be portable
                - components can be reusable assets
            - React is declarative
                - declarative components can be more composed
            - React is written in JSX
            - React renders a virtual DOM (note the VDOM is a deprecated concept. Should use the term "render tree" to explain)`,
      },
      {
        headline: 'How does React connect to HTML, CSS, and JS?',
        points: `- React came at a time where we were separating HTML, CSS, and JS. React took a step back and thought, you know what? This separation of these different technologies doesn't make any sense.
                - Let's just marry all these concepts together into one thing and make it as easy as possible to maintain that in the long-term.
                - Just putting them all together allowed us to co-locate that concern into a single concern, a single place for that one concern, and that gave us this black box magic where we can stuff all of the garbage that we want to in this black box.
                - That's where React relates to the three foundational technologies of the web, is it allows you to create those things all together in a single file.`,
      },
      {
        headline: "What's React's Relationship with the DOM?",
        points: `- What "rendering" is
                - How rendering works
                - React builds a "render tree" from our code
                - The render tree controls the DOM for us
                - React's render tree efficiently updates the DOM
                - React only updates what’s necessary
                - Components "mount" and "unmount" from the DOM`,
      },
    ],
  },
  {
    topicTitle: 'Intermediate React',
    topics: [
      {
        headline:
          'How does useState compare with all of the other tools of state management?',
        points: `- Any tool outside of React, that you may have heard of, has one thing going against it and that's that you have to install it. It has a different release cycle from React.
                - **useState is your first line of defense for managing state in React applications, and you can build an entire application just using useState to manage your state.**
                - There's also useReducer, which is another way to manage state, and that's also blessed, but that's for more advanced use cases.`,
      },
      {
        headline:
          'Where does useContext come into play in the development cycle?',
        points: `- Solving what's called the prop drilling problem, which actually isn't really a problem.
                - [https://kentcdodds.com/blog/prop-drilling](https://kentcdodds.com/blog/prop-drilling)
                - Use [React's Context API](https://kentcdodds.com/blog/how-to-use-react-context-effectively) for things that are truly necessary deep in the react tree.
                - Redux took off, is because they solved this problem. So context is this problem solved and blessed by the framework.
                - You can take this state that needs to be shared across multiple elements in my React tree and stick it into some registry that Reacts, maintains, and then anywhere from that part of the tree on down, will have access to that state.`,
      },
      {
        headline:
          'How do you decide when to use useEffect and when to use useState?',
        points: `- useEffect is most commonly used with props when something is changing that you need to react to in a way other than displaying data on the screen.
                - For example, if a prop comes in that has the component re-fetch something from the server and show a loading spinner while you wait for the response. This is more than just a display change, so it calls for useEffect.`,
      },
    ],
  },
  {
    topicTitle: 'Advanced React',
    topics: [
      {
        headline: 'Where should State live?',
        points: `- You should never have State in two places at any time. **Do not duplicate State.**
                - You need to have a single source of truth, and it needs to live in one place.
                    - It can live in memory, local storage, session storage, URL bar and the browser history.
                    - Example of implementing **State in browser history.**`,
      },
      {
        headline: 'How do determine the right amount of UI abstraction?',
        points: `- **For client state:** there's no need to go outside of React. Unless I want to, like going for Redux because of the dev tools.
                - **For server-state:** I'm going to reach for React Query, Apollo, SWR.
                - Keeping track of local state is easy, it's predictable. You can control everything inside your application.
                - When you start consuming stuff outside of your app, you are no longer in control. They are reading a snapchat of an API endpoint. People treat data as they own it, which they don't. And that's really hard to keep track of.
                - **Rule:** Who owns this code?
                    - If you can answer this question correctly, then you'll know what tool to use.`,
      },
      {
        headline: 'When is XState not appropriate?',
        points: `- You don't need a library to implement State Machines.
                - You can use patters in each language.
                - XState becomes more useful when representing Statecharts.`,
      },
    ],
  },
]

export function TopicListComponent() {
  return (
    <>
      {topicLists.map((topicList, i) => {
        return (
          <>
            <p>{topicLists[i].topicTitle}</p>
            <p>
              {topicLists[i].topics.map((topicItem, i) => {
                return (
                  <div>
                    <p>{topicItem.headline}</p>
                    <ul>{topicItem.points}</ul>
                  </div>
                )
              })}
            </p>
          </>
        )
      })}
    </>
  )
}
