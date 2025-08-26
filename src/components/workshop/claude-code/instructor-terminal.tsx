import Image from 'next/image'

export default function InstructorTerminal() {
  return (
    <section className="py-16 sm:py-20">
      <div className="max-w-3xl mx-auto px-5">
        <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
          {/* Minimal terminal header */}
          <div className="bg-gray-100 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 py-2">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500/60 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-500/60 rounded-full"></div>
              <div className="w-3 h-3 bg-green-500/60 rounded-full"></div>
            </div>
          </div>

          {/* Terminal content */}
          <div className="p-8 sm:p-10 space-y-6">
            {/* Single command */}
            <div className="flex items-center text-xs font-mono text-gray-500 dark:text-gray-500">
              <span className="text-orange-600 dark:text-orange-400">$</span>
              <span className="ml-2">whoami</span>
            </div>

            {/* Minimal profile */}
            <div className="flex flex-col sm:flex-row gap-8 items-center sm:items-start">
              <Image
                src="https://res.cloudinary.com/dg3gyk0gu/image/upload/v1683164538/assets/john.webp"
                alt="John Lindquist"
                width={200}
                height={200}
                className="rounded-lg opacity-90"
              />

              <div className="flex-1 space-y-6">
                {/* Name and role */}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    John Lindquist
                  </h2>
                  <p className="text-base text-gray-600 dark:text-gray-400 mt-1">
                    Founder @ egghead.io
                  </p>
                </div>

                {/* Mission - most important */}
                <p className="text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                  John Lindquist is your guide through the complexities of
                  AI-driven development. As the founder of egghead.io, he has
                  helped tens of thousands of developers navigate new
                  technologies with clarity and confidence. Now, he's here to
                  show you exactly how to transform frustrating moments into
                  opportunities for deeper learning and success using AI-powered
                  tools like Cursor, Claude Code, and more.
                </p>

                {/* Minimal stats */}
                {/* <div className="flex gap-8 text-sm">
                  <div>
                    <span className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-500">Students</span>
                    <p className="text-xl font-bold text-gray-800 dark:text-gray-200">100k+</p>
                  </div>
                  <div>
                    <span className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-500">Tokens Used</span>
                    <p className="text-xl font-bold text-gray-800 dark:text-gray-200">2B+/week</p>
                  </div>
                  <div>
                    <span className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-500">Rating</span>
                    <p className="text-xl font-bold text-green-600 dark:text-green-400">★★★★★</p>
                  </div>
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
