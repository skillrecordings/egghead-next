import * as React from 'react'

/**
 * Full body copy for the lifetime membership page
 * Shown to non-members who need convincing about egghead's value
 * Written in Total TypeScript style - direct, punchy, pain-point focused
 */
const BodyCopyFull: React.FC = () => {
  return (
    <>
      {/* Pain point section */}
      <section className="container max-w-2xl px-6 py-12">
        <div className="prose prose-lg dark:prose-invert mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            You're good. But you want to be <em>faster</em>.
          </h2>
          <p>
            You could be shipping features. Instead, you're Googling "how to
            center a div" for the 47th time or fighting with a coding agent on
            how to do it. Or re-learning that one React pattern you always
            forget. Or figuring out why your TypeScript types are angry again.
          </p>
          <p>
            The modern web stack moves fast. React Server Components. App
            Router. Edge functions. AI tooling. Every few <s>months</s> days,
            there's a new paradigm to learn.
          </p>
          <p>
            So you keep pushing, piecing together blog posts, docs, and Stack
            Overflow threads, all while feeling like you're perpetually behind.
          </p>
          <p>The truth is:</p>
          <p>
            <strong>
              You never found a resource that respects your time AND keeps you
              current.
            </strong>
          </p>
        </div>
      </section>

      {/* Testimonial break */}
      <section className="bg-gray-100 dark:bg-gray-800/50 py-10">
        <div className="container max-w-2xl px-6">
          <blockquote className="text-center">
            <p className="text-lg italic text-gray-700 dark:text-gray-200">
              "egghead tutorials{' '}
              <strong className="text-blue-600 dark:text-blue-400">
                helped me land a job out of university!
              </strong>
              "
            </p>
            <footer className="mt-3 flex items-center justify-center gap-3">
              <img
                src="https://res.cloudinary.com/dg3gyk0gu/image/upload/v1612183242/next.egghead.io/testimonials/zhentian-wan_2x.png"
                alt="Zhentian Wan"
                className="h-10 w-10 rounded-full"
              />
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Zhentian Wan, JavaScript Developer
              </div>
            </footer>
          </blockquote>
        </div>
      </section>

      {/* Value prop section */}
      <section className="container max-w-2xl px-6 py-12">
        <div className="prose prose-lg dark:prose-invert mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Learn in minutes. Ship the same day.
          </h2>
          <p>
            What separates developers who stay current from those who fall
            behind?
          </p>
          <p>
            <strong>Efficiency.</strong>
          </p>
          <p>
            They don't have more time than you. They have better systems. They
            know exactly where to go when they need to learn something new.
          </p>
          <p>
            egghead is built for momentum. Lessons are 5-10 minutes, not hours.
            Courses are scoped to a single shipped outcome—not vague theory that
            leaves you wondering "okay, but how do I actually use this?"
          </p>
          <p>Come in with a ticket. Leave with a PR. That's the egghead way.</p>
        </div>
      </section>

      {/* What you deserve section */}
      <section className="container max-w-2xl px-6 py-12">
        <div className="prose prose-lg dark:prose-invert mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            You deserve better than tutorial hell
          </h2>
          <p>
            You deserve a resource where every lesson earns its runtime. Where
            instructors get to the point because they're senior devs too—they
            know your time is expensive.
          </p>
          <p>egghead courses are built like tickets in your issue tracker:</p>
          <ul className="space-y-2">
            <li>Add auth with OAuth + sessions</li>
            <li>Migrate to React Server Components</li>
            <li>Type a gnarly API response safely</li>
            <li>Add Stripe checkout + webhooks</li>
            <li>Ship an AI feature with the Vercel AI SDK</li>
          </ul>
          <p>
            If it sounds like something that would land in your sprint, we
            probably have a course for it.
          </p>
          <p>
            <strong>
              When the stack shifts (and it will), you don't start from zero.
            </strong>{' '}
            Come back, grab the lesson, ship the change. Repeat for the rest of
            your career.
          </p>
        </div>
      </section>

      {/* Testimonial break 2 */}
      <section className="bg-gray-100 dark:bg-gray-800/50 py-10">
        <div className="container max-w-2xl px-6">
          <blockquote className="text-center">
            <p className="text-lg italic text-gray-700 dark:text-gray-200">
              "I{' '}
              <strong className="text-blue-600 dark:text-blue-400">
                landed a new job
              </strong>{' '}
              thanks to egghead.io!"
            </p>
            <footer className="mt-3 flex items-center justify-center gap-3">
              <img
                src="https://res.cloudinary.com/dg3gyk0gu/image/upload/v1612183242/next.egghead.io/testimonials/ifeanyi-agu_2x.png"
                alt="Ifeanyi Agu"
                className="h-10 w-10 rounded-full"
              />
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Ifeanyi Agu, Software Engineer
              </div>
            </footer>
          </blockquote>
        </div>
      </section>

      {/* Benefits section */}
      <section className="container max-w-2xl px-6 py-12">
        <div className="prose prose-lg dark:prose-invert mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Become the dev your team turns to
          </h2>
          <p>
            With lifetime access to egghead, you'll always have an answer ready.
          </p>
          <ul className="space-y-3 list-none pl-0">
            <li className="flex items-start gap-3">
              <span className="text-blue-500 mt-1">✓</span>
              <span>
                <strong>You'll ship faster</strong> because you're not
                re-learning the same patterns every time
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-blue-500 mt-1">✓</span>
              <span>
                <strong>You'll unblock others</strong> because you'll know the
                gotchas before they hit them
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-blue-500 mt-1">✓</span>
              <span>
                <strong>You'll stay current</strong> because new content is
                included forever, no extra charge
              </span>
            </li>
          </ul>
          <p>
            One purchase. Permanent access. Every course, every lesson, every
            update—for the rest of your career.
          </p>
        </div>
      </section>
    </>
  )
}

export default BodyCopyFull
