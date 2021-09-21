import * as React from 'react'
import {motion} from 'framer-motion'
import {
  Vueblue,
  Awsblue,
  Angularblue,
  Jsblue,
  Nextblue,
  Nodeblue,
  Reactblue,
  Reduxblue,
  Cssblue,
  Tsblue,
} from './allicons'

const NewHome: React.FunctionComponent = () => {
  return (
    <div className="mt-4 sm:mt-8 w-full">
      <section className="my-8 sm:my-16 flex flex-row justify-between items-center max-w-screen-xl mx-auto overflow-hidden">
        <div className="w-full sm:w-3/5">
          <motion.h1
            initial={{opacity: 0, x: -50}}
            animate={{opacity: 1, x: 0}}
            transition={{duration: 0.8, delay: 0.2}}
            className="text-4xl sm:text-6xl font-bold mb-8 leading-tight sm:leading-tighter text-gray-700"
          >
            Learn the best JavaScript tools and frameworks from industry pros
          </motion.h1>
          <motion.h2
            initial={{opacity: 0, x: -50}}
            animate={{opacity: 1, x: 0}}
            transition={{duration: 0.6, delay: 0.4}}
            className="text-lg sm:leading-loose text-coolGray-500 w-full sm:w-3/4"
          >
            egghead creates high-quality video tutorials and learning resources
            for badass web developers
          </motion.h2>

          {/* email input form */}
          <motion.form
            initial={{opacity: 0, x: -50}}
            animate={{opacity: 1, x: 0}}
            transition={{duration: 0.6, delay: 0.6}}
            className="mt-8"
          >
            <div className="flex flex-row items-center">
              <div className="mt-1 relative rounded-md shadow-sm w-72">
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
          </motion.form>
          <motion.p
            initial={{opacity: 0, x: -50}}
            animate={{opacity: 1, x: 0}}
            transition={{duration: 0.6, delay: 0.8}}
            className="mt-2 text-gray-400 text-sm"
          >
            We guarantee we're 100% spam-free. Unsubscribe at any time.
          </motion.p>
        </div>
        <div className="">
          <img
            className="min-w-full"
            width="400"
            alt="egghead course illustration"
            src="https://via.placeholder.com/400x400"
          />
        </div>
      </section>
      <TechnologyRow />
      <section className="my-12 sm:my-20 max-w-screen-xl mx-auto ">
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
          <ol className="list-disc ml-6">
            {[
              'Cobble together hours-long videos, docs, tutorials, and forum posts',
              'Watch long, unedited videos at 2x speed',
              'Dig through the comments when tutorials give you more bugs than working code',
              'Read blog post after unreliable blog post',
              'Beg for answers on StackOverflow when you hit dead ends',
            ].map((item) => (
              <li className="prose text-lg pl-2 pb-2">{item}</li>
            ))}
          </ol>
          <p className="mt-6 prose text-lg">
            All the while, your poor computer screams under the weight of all
            those tabs.
          </p>
          <p className="mt-6 prose text-lg">
            What about learning from books? Books are great! <br /> They're
            sometimes edited by professionals, which is more than you can say
            for most tutorials you find. But publishers can’t keep up with the
            pace of modern web development. You can't keep up either, at least
            not with your old approach.
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

      <section className="max-w-screen-xl mb-20 mx-auto">
        <div className="mx-auto md:mx-2 md:max-w-screen-md">
          <p className="uppercase mb-4 text-blue-600 font-semibold text-sm tracking-wide">
            There <span className="underline">has</span> to be an easier way
          </p>
          <h3 className="text-2xl leading-snug mb-6 font-medium">
            Don't you wish you could jack into the Matrix and inject React
            directly to your brain?
          </h3>
          {[
            "Sounds convenient, but it's not going to happen anytime soon.",
            'But what if you had the next best thing?',
            'What if you could simply sit down and start learning? What if you could skip all the searching, the cobbling, the contradictory advice, the bugs, the forums, and the dead ends?',
            'What if you had on-demand experts avaliable to hand you the best, curated material on modern web development?',
          ].map((item) => {
            return <p className="mt-6 prose text-lg">{item}</p>
          })}
          <p className="mt-6 prose text-lg font-bold">
            Think how much easier it would be for you to <i>stay</i> on the
            bleeding edge of our industry. With just 10-30 minutes a day, you'd
            be able to power through a major topic every week.
          </p>
          <p className="mt-6 prose text-lg">
            With the right teacher and the right courses, this isn't a pipe
            dream.
            <br />
            Picture yourself months from now, sitting down to a heady
            programming challenge, and whispering{' '}
            <i className="font-semibold">I know wtf I am doing.</i>
          </p>
          <p className="mt-6 prose text-lg">
            <b>That</b> is what egghead can do for you.
          </p>
        </div>
      </section>

      <section className="max-w-screen-xl mb-20 mx-auto">
        <div className="mx-auto md:mx-2 md:max-w-screen-md">
          <p className="uppercase mb-4 text-blue-600 font-semibold text-sm tracking-wide">
            There <i>is</i> an easier way
          </p>
          <h3 className="text-2xl leading-snug mb-6 font-medium">
            egghead will turn you into a badass web developer.
            <br /> Learn any time, any place, at your own pace.
          </h3>
          <p className="mt-6 prose text-lg">
            We're here to help you level up. We've designed everything from our
            courses to our tools to our community to advance your skills without
            sacrificing your precious time.
          </p>
          <p className="mt-6 prose text-lg">
            egghead is <i>not</i> a sloppy video marketplace or grab-bag of
            random content.
            <br /> We're a boutique label curating{' '}
            <b>high-quality video courses for professional web developers.</b>
          </p>
          <p className="mt-6 prose text-lg">
            When you join egghead you'll get:
          </p>
          <ol className="list-disc ml-6 mt-6">
            {[
              'Access to hundreds of courses by world-class folks like Dan Abramov, Kent C. Dodds, Jason Lengstorf, and Laurie Barth',
              'Lessons designed to teach you exactly what you need to know, without any of the fluff or cruft',
              'Code examples (without the bugs) and projects to immediately test your knowledge',
              'Professionally produced and edited videos with high-quality sound and resolution',
              'Tools to help you plan, track, and follow through on your learning goals',
            ].map((item) => (
              <li className="prose text-lg pl-2 pb-2">{item}</li>
            ))}
          </ol>
          <p className="mt-6 prose text-lg">
            And unlike book publishers, we move at the speed of the web. When
            you need the most up-to-date tutorials on React, we've got you
            covered.
          </p>
          {[
            'We have over 5,000 lessons and 250+ courses, with new material released every week.',
            "Our lessons are 3-7 minutes long – short, sweet, and to the point. They're designed to be watched either individually or as part of a course, so you can jump around and get exactly the information you need.",
            "Our courses will give you a comprehensive tour through a topic. They cover all the essentials from beginning to end. This includes a realistic practice project and all the code you'll need to complete it.",
            'This means you can pick up individual skills anytime you want. New languages, frameworks, and libraries are easy to add to your professional toolkit. Learn at your desk, on the train, or in the bathroom – whenever and whereever you want. Videos, transcripts, and code examples are always avaliable – even offline.',
            'And all of it is nop-notch quality. Your secret weapon to get ahead, shine at work, and build things you love.',
          ].map((item) => {
            return <p className="mt-6 prose text-lg">{item}</p>
          })}
        </div>
      </section>

      <section className="-mx-6 bg-gray-50 py-20 border-2 border-gray-100">
        <div className="max-w-screen-xl mb-20 mx-auto">
          <div className="mx-auto md:mx-2 md:max-w-screen-md">
            <p className="uppercase mb-4 text-blue-600 font-semibold text-sm tracking-wide">
              The sweet details
            </p>
            <h3 className="text-2xl leading-snug mb-6 font-medium">
              What you'll get as an egghead member
            </h3>
          </div>
          <BenefitsSection2 />
        </div>
      </section>
      <PricingSection />
    </div>
  )
}

export default NewHome

function BenefitsSection() {
  return (
    <div className="mt-10 grid grid-cols-4 grid-rows-3 gap-4">
      {[
        {text: '250+ comprehensive video courses', icon: <Reactblue />},
        {
          text: '5500+ short and sweet lessons',
          icon: <Reactblue />,
        },
        {
          text: 'Practice projects to apply your knowledge',
          icon: <Reactblue />,
        },
        {
          text: 'Transcripts and closed captions on every video',
          icon: <Reactblue />,
        },
        {text: 'Code examples for every lesson', icon: <Reactblue />},
        {
          text: 'Speed controls to watch at your own pace',
          icon: <Reactblue />,
        },
        {
          text: 'Downloadable videos to view offline',
          icon: <Reactblue />,
        },
        {
          text: 'Priority customer support and assistance',
          icon: <Reactblue />,
        },
        {text: 'RSS feeds for your favourite podcasting app', icon: ''},
        {
          text: 'Bookmarks to create learning plans and stay organised',
          icon: '',
        },
        {text: 'Watch history to see your progress over time', icon: ''},
      ].map((item) => {
        return (
          <div className="h-48 w-full bg-white border rounded-md shadow-sm border-gray-100 p-6 flex items-center">
            <p className="text-center leading-tight font-medium text-lg text-gray-700">
              {item.text}
            </p>
          </div>
        )
      })}
    </div>
  )
}

function BenefitsSection2() {
  return (
    <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-4 mx-auto md:mx-2">
      {[
        {text: '250+ comprehensive video courses', icon: <Reactblue />},
        {
          text: '5500+ short and sweet lessons',
          icon: <Reactblue />,
        },
        {
          text: 'Practice projects to apply your knowledge',
          icon: <Reactblue />,
        },
        {
          text: 'Transcripts and closed captions on every video',
          icon: <Reactblue />,
        },
        {text: 'Code examples for every lesson', icon: <Reactblue />},
        {
          text: 'Speed controls to watch at your own pace',
          icon: <Reactblue />,
        },
        {
          text: 'Downloadable videos to view offline',
          icon: <Reactblue />,
        },
        {
          text: 'Priority customer support and assistance',
          icon: <Reactblue />,
        },
        {text: 'RSS feeds for your favourite podcasting app', icon: ''},
        {
          text: 'Bookmarks to create learning plans and stay organised',
          icon: '',
        },
        {text: 'Watch history to see your progress over time', icon: ''},
      ].map((item) => {
        return (
          <div className="w-full border-gray-100 py-2 flex items-center">
            <img src="https://via.placeholder.com/60x60" alt="" />
            <p className="text-center leading-tight font-medium text-lg text-gray-700 ml-6">
              {item.text}
            </p>
          </div>
        )
      })}
    </div>
  )
}

function TechnologyRow() {
  return (
    <section className="my-12 sm:my-28">
      <div className="flex flex-row flex-wrap items-center justify-center content-between place-content-between">
        {[
          {
            label: 'JavaScript',
            image: <Jsblue />,
          },
          {
            label: 'React',
            image: <Reactblue />,
          },
          {
            label: 'Redux',
            image: <Reduxblue />,
          },
          {
            label: 'Angular',
            image: <Angularblue />,
          },
          {
            label: 'Vue',
            image: <Vueblue />,
          },
          {
            label: 'TypeScript',
            image: <Tsblue />,
          },
          {
            label: 'CSS',
            image: <Cssblue />,
          },
          {
            label: 'Node.js',
            image: <Nodeblue />,
          },
          {
            label: 'AWS',
            image: <Awsblue />,
          },
          {
            label: 'Next.js',
            image: <Nextblue />,
          },
        ].map((tech, i) => {
          return (
            <motion.div
              className="flex flex-col items-center"
              key={i}
              initial={{opacity: 0, y: 40}}
              animate={{opacity: 1, y: 0}}
              transition={{duration: 0.5, delay: i * 0.1}}
            >
              <div className="w-24 h-24 md:w-32 md:h-32 px-1 mx-3 my-2 flex items-center">
                {tech.image}
              </div>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}

function PricingSection() {
  return (
    <section className="mt-20">
      <div className="max-w-screen-xl mx-auto">
        <div className="">
          <p className="uppercase mb-4 text-blue-600 font-semibold text-sm tracking-wide">
            Join egghead today
          </p>
          <h3 className="text-2xl leading-snug mb-6 font-medium">
            Level up your career with an egghead membership
          </h3>
        </div>
      </div>
    </section>
  )
}
