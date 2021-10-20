import * as React from 'react'

import Hero from './components/hero'
import TechIcons from './components/tech-icons'

const NewHome: React.FunctionComponent = () => {
  return (
    <div className="pt-4 md:pt-8 lg:pt-16">
      <Hero />

      <section className="mt-16 md:mt-28">
        <TechIcons />
      </section>

      <section className="max-w-screen-md mx-auto sm:my-20">
        <h4 className="mb-4 text-sm font-semibold tracking-wide text-blue-600 uppercase">
          Why bother with another learning platform?
        </h4>
        <h3 className="mb-6 text-2xl font-medium leading-snug">
          Obviously you can pick up a new framework, language or platform on
          your own. You’ve done it before.
          <br />
          You know the drill...
        </h3>
        <div className="space-y-6 text-lg dark:text-white">
          <ul className="space-y-4 text-lg prose dark:text-white">
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
                <span className="text-xl leading-normal">{item.emoji}</span>
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
            Nobody’s paying you to find the bugs in their crummy tutorials. You
            don’t have time to dig your way out of all those rabbit holes for a
            supposedly free education.
          </p>
          <p>So you’ve been procrastinating a little. Or… a lot.</p>
          <p>Your time is precious. You're a professional.</p>
        </div>
      </section>

      <section className="max-w-screen-md mx-auto sm:my-20">
        <h4 className="mb-4 text-sm font-semibold tracking-wide text-blue-600 uppercase">
          There <span className="underline">has</span> to be an easier way
        </h4>
        <h3 className="mb-6 text-2xl font-medium leading-snug">
          Don't you wish you could jack into the Matrix and inject React
          directly to your brain?
        </h3>
        <div className="space-y-6 text-lg dark:text-white">
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
          <p>
            Think how much easier it would be for you to <i>stay</i> on the
            bleeding edge of our industry. With just 10-30 minutes a day, you'd
            be able to power through a major topic every week.
          </p>
          <p>
            With the right teacher and the right courses, this isn't a pipe
            dream.
            <br />
            Picture yourself months from now, sitting down to a heady
            programming challenge, and whispering{' '}
            <i className="font-semibold">I know wtf I am doing.</i>
          </p>
          <p>
            <b>That</b> is what egghead can do for you.
          </p>
        </div>
      </section>
    </div>
  )
}
export default NewHome
