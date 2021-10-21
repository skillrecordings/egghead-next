import * as React from 'react'
import Image from 'next/image'
import {BadgeCheckIcon} from '@heroicons/react/solid'

import Hero from './components/hero'
import TechIcons from './components/tech-icons'
import Benefits from './components/benefits'
import imgIntersection01 from './images/image-intersection-01.png'
import imgIntersection02 from './images/image-intersection-02.png'
import imgIntersection03 from './images/image-intersection-03.png'

const NewHome: React.FunctionComponent = () => {
  return (
    <div className="pt-4 md:pt-8 lg:pt-16">
      <Hero />

      <section className="mt-16 md:mt-28">
        <TechIcons />
      </section>

      <div className="mt-16 space-y-14 md:space-y-20 md:mt-28">
        <section className="mx-auto md:max-w-screen-sm lg:max-w-screen-md">
          <h4 className="mb-4 text-sm font-semibold tracking-wide text-blue-600 uppercase dark:text-blue-400">
            Why bother with another learning platform?
          </h4>
          <h3 className="mb-6 text-lg font-semibold leading-tight tracking-wide md:leading-normal md:text-xl xl:text-2xl">
            Obviously you can pick up a new framework, language or platform on
            your own. You’ve done it before.
            <br />
            You know the drill...
          </h3>
          <div className="space-y-6 md:text-lg dark:text-white">
            <ul className="space-y-4">
              {[
                {
                  emoji: '😞',
                  text: 'Cobble together hours-long videos, docs, tutorials, and forum posts',
                },
                {
                  emoji: '😖',
                  text: 'Watch long, unedited videos at 2x speed',
                },
                {
                  emoji: '😫',
                  text: 'Dig through the comments when tutorials give you more bugs than working code',
                },
                {
                  emoji: '😢',
                  text: 'Read blog post after unreliable blog post',
                },
                {
                  emoji: '😭',
                  text: 'Beg for answers on StackOverflow when you hit dead ends',
                },
              ].map((item, index) => (
                <li key={index} className="flex space-x-4">
                  <span className="text-xl leading-normal -translate-y-1">
                    {item.emoji}
                  </span>
                  <span>{item.text}</span>
                </li>
              ))}
            </ul>
            <p>
              All the while, your poor computer screams under the weight of all
              those tabs.
            </p>
            <p>
              What about learning from books? Books are great! <br /> They're
              sometimes edited by professionals, which is more than you can say
              for most tutorials you find. But publishers can’t keep up with the
              pace of modern web development. You can't keep up either, at least
              not with your old approach.
            </p>
            <p>
              Nobody’s paying you to find the bugs in their crummy tutorials.
              You don’t have time to dig your way out of all those rabbit holes
              for a supposedly free education.
            </p>
            <p>So you’ve been procrastinating a little. Or… a lot.</p>
            <p>Your time is precious. You're a professional.</p>
          </div>
        </section>

        <div className="w-full mx-auto max-w-[12rem] md:max-w-[16rem] lg:max-w-screen-xs">
          <Image src={imgIntersection01} width={400} height={400} alt="" />
        </div>

        <section className="mx-auto md:max-w-screen-sm lg:max-w-screen-md">
          <h4 className="mb-4 text-sm font-semibold tracking-wide text-blue-600 uppercase dark:text-blue-400">
            There <span className="underline">has</span> to be an easier way
          </h4>
          <h3 className="mb-6 text-lg font-semibold leading-tight tracking-wide md:leading-normal md:text-xl xl:text-2xl">
            Don't you wish you could jack into the Matrix and inject React
            directly to your brain?
          </h3>
          <div className="space-y-6 md:text-lg dark:text-white">
            <p>Sounds convenient, but it's not going to happen anytime soon.</p>
            <p>But what if you had the next best thing?</p>
            <p>
              What if you could simply sit down and start learning? What if you
              could skip all the searching, the cobbling, the contradictory
              advice, the bugs, the forums, and the dead ends?
            </p>
            <p>
              What if you had on-demand experts avaliable to hand you the best,
              curated material on modern web development?
            </p>
            <p className="font-semibold">
              Think how much easier it would be for you to <i>stay</i> on the
              bleeding edge of our industry. With just 10-30 minutes a day,
              you'd be able to power through a major topic every week.
            </p>
            <p>
              With the right teacher and the right courses, this isn't a pipe
              dream.
              <br />
              Picture yourself months from now, sitting down to a heady
              programming challenge, and whispering{' '}
              <i className="font-bold">I know wtf I am doing.</i>
            </p>
            <p>
              <b>That</b> is what egghead can do for you.
            </p>
          </div>
        </section>

        <div className="w-full mx-auto max-w-[12rem] md:max-w-[16rem] lg:max-w-screen-xs">
          <Image src={imgIntersection02} width={400} height={400} alt="" />
        </div>

        <section className="mx-auto md:max-w-screen-sm lg:max-w-screen-md">
          <h4 className="mb-4 text-sm font-semibold tracking-wide text-blue-600 uppercase dark:text-blue-400">
            There <i>is</i> an easier way
          </h4>
          <h3 className="mb-6 text-lg font-semibold leading-tight tracking-wide md:leading-normal md:text-xl xl:text-2xl">
            egghead will turn you into a badass web developer.
            <br /> Learn any time, any place, at your own pace.
          </h3>
          <div className="space-y-6 md:text-lg dark:text-white">
            <p>
              We're here to help you level up. We've designed everything from
              our courses to our tools to our community to advance your skills
              without sacrificing your precious time.
            </p>
            <p>
              egghead is <i>not</i> a sloppy video marketplace or grab-bag of
              random content.
              <br /> We're a boutique label curating{' '}
              <b>high-quality video courses for professional web developers.</b>
            </p>
            <p>When you join egghead you'll get:</p>
            <ul className="space-y-4 md:text-lg">
              {[
                'Access to hundreds of courses by world-class folks like Dan Abramov, Kent C. Dodds, Jason Lengstorf, and Laurie Barth',
                'Lessons designed to teach you exactly what you need to know, without any of the fluff or cruft',
                'Code examples (without the bugs) and projects to immediately test your knowledge',
                'Professionally produced and edited videos with high-quality sound and resolution',
                'Tools to help you plan, track, and follow through on your learning goals',
              ].map((item, index) => (
                <li key={index} className="flex space-x-4">
                  <div className="flex-shrink-0 mt-1">
                    <BadgeCheckIcon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p>
              And unlike book publishers, we move at the speed of the web. When
              you need the most up-to-date tutorials on React, we've got you
              covered.
            </p>
            <p>
              We have over 5,000 lessons and 250+ courses, with new material
              released every week.
            </p>
            <p>
              Our lessons are 3-7 minutes long – short, sweet, and to the point.
              They're designed to be watched either individually or as part of a
              course, so you can jump around and get exactly the information you
              need.
            </p>
            <p>
              Our courses will give you a comprehensive tour through a topic.
              They cover all the essentials from beginning to end. This includes
              a realistic practice project and all the code you'll need to
              complete it.
            </p>
            <p>
              This means you can pick up individual skills anytime you want. New
              languages, frameworks, and libraries are easy to add to your
              professional toolkit.
            </p>
            <p>
              Learn at your desk, on the train, or in the bathroom – whenever
              and whereever you want. Videos, transcripts, and code examples are
              always avaliable – even offline.
            </p>
            <p>
              And all of it is nop-notch quality. Your secret weapon to get
              ahead, shine at work, and build things you love.
            </p>
          </div>
        </section>

        <div className="w-full mx-auto max-w-[12rem] md:max-w-[16rem] lg:max-w-screen-xs">
          <Image src={imgIntersection03} width={400} height={400} alt="" />
        </div>
      </div>

      <div className="mt-20 translate-y-5">
        <Benefits />
      </div>
    </div>
  )
}
export default NewHome
