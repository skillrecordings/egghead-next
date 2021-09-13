import * as React from 'react'
import {motion} from 'framer-motion'

const NewHome: React.FunctionComponent = () => {
  return (
    <div className="mt-4 sm:mt-8 mb-28 w-full">
      <section className="my-8 sm:my-16 flex flex-row justify-between items-center max-w-screen-xl mx-auto">
        <div className="w-3/5">
          <h1 className="text-4xl sm:text-6xl font-bold mb-8 leading-tighter sm:leading-tighter  text-gray-700">
            Learn the best JavaScript tools and frameworks from industry pros
          </h1>
          <h2 className="text-xl sm:leading-normal text-coolGray-600 w-3/4">
            egghead creates high-quality video tutorials and learning resources
            for badass web developers
          </h2>

          {/* email input form */}
          <form className="mt-8">
            <div className="flex flex-row items-center">
              <div className="mt-1 relative rounded-md shadow-sm w-80">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                </div>
                <input
                  id="email"
                  type="email"
                  placeholder="you@company.com"
                  className="text-black autofill:text-fill-black py-3 placeholder-gray-400 focus:ring-indigo-500 focus:border-blue-500 block w-full pl-10 border-gray-300 rounded-md"
                  required
                />
              </div>
              <button
                type="submit"
                className="transition-all duration-150 mt-1 ml-2 ease-in-out bg-blue-600 hover:bg-blue-700 active:bg-blue-800 hover:shadow-sm text-white font-semibold py-3 px-5 rounded-md"
              >
                Get started for free
              </button>
            </div>
          </form>
          <p className="mt-2 text-gray-400 text-sm">
            We guarantee we're 100% spam-free. Unsubscribe at any time.
          </p>
        </div>
        <img
          alt="egghead course illustration"
          src="https://via.placeholder.com/400x400"
        />
      </section>
      <TechnologyRow />
      <section className="my-12 sm:mt-40 sm:mb-28 max-w-screen-xl mx-auto ">
        <div className="mx-auto md:mx-2 md:max-w-screen-md">
          <p className="uppercase mb-4 text-blue-600 font-semibold text-sm tracking-wide">
            Why bother with another learning platform?
          </p>
          <h3 className="text-2xl leading-snug mb-6 font-medium">
            Obviously you can pick up a new framework, language or platform on
            your own. You’ve done it before.
            <br />
            You know the drill...
          </h3>
          <ol className="">
            {[
              'Cobble together hours-long videos, docs, tutorials, and forum posts',
              'Watch long, unedited videos at 2x speed',
              'Dig through the comments when tutorials give you more bugs than working code',
              'Read blog post after unreliable blog post',
              'Ask StackOverflow questions when you get stuck in holes',
            ].map((item) => (
              <li className="prose text-lg">{item}</li>
            ))}
          </ol>
          <p className="mt-6 prose text-lg">
            All the while, your poor computer screams under the weight of all
            those tabs.
          </p>
          <p className="mt-6 prose text-lg">
            What about books? Books are great! They're sometimes edited by
            professionals, which is more than you can say for most tutorials you
            find. But publishers can’t keep up with the pace of modern web
            development. You can't keep up either, at least not with your old
            approach.
          </p>
          <p className="mt-6 prose text-lg">
            Nobody’s paying you to find the bugs in their crummy tutorials. You
            don’t have time to dig your way out of all those rabbit holes for a
            supposedly free education.
          </p>
          <p className="mt-6 prose text-lg">
            So you’ve been procrastinating a little. Or… a lot.
          </p>
          <p className="mt-6 prose text-lg">
            Your time is precious. You're a professional.
          </p>
        </div>
      </section>

      <section className="max-w-screen-xl mx-auto">
        <div className="mx-auto md:mx-2 md:max-w-screen-md">
          <div className="w-40 border border-blue-500" />
          <h3 className="text-2xl leading-snug my-6 font-medium">
            Don't you wish you could jack into the Matrix and inject React
            directly to your brain?
          </h3>
          {[
            "Sounds convenient, but it's not going to happen anytime soon.",
            'But if you had the next best thing?',
            'What if you could simply sit down and start learning? What if you could skip all the searching, the cobbling, the contradictory advice, the bugs, the forums, and the dead ends?',
            'What if you had on-demand experts avaliable to carefully explain ',
          ].map((item) => {
            return <p className="mt-6 prose text-lg">{item}</p>
          })}
        </div>
      </section>
    </div>
  )
}

export default NewHome

function TechnologyRow() {
  return (
    <section className="my-12 sm:my-32">
      <div className="flex flex-row items-center">
        {[
          {
            label: 'JavaScript',
            image: 'https://via.placeholder.com/250x250',
          },
          {
            label: 'React',
            image: 'https://via.placeholder.com/250x250',
          },
          {
            label: 'Angular',
            image: 'https://via.placeholder.com/250x250',
          },
          {
            label: 'Vue',
            image: 'https://via.placeholder.com/250x250',
          },
          {
            label: 'Node',
            image: 'https://via.placeholder.com/250x250',
          },
          {
            label: 'Gatsby',
            image: 'https://via.placeholder.com/250x250',
          },
          {
            label: 'Next.js',
            image: 'https://via.placeholder.com/250x250',
          },
          {
            label: 'Redux',
            image: 'https://via.placeholder.com/250x250',
          },
        ].map((tech, i) => {
          return (
            <div className="flex flex-col items-center mx-6">
              <img src={tech.image} alt={tech.label} className="" />
              <p>{tech.label}</p>
            </div>
          )
        })}
      </div>
    </section>
  )
}
