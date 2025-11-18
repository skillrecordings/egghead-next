interface WorkshopData {
  date: string
  attendees: number
}

const workshops: WorkshopData[] = [
  {date: 'Aug 01, 2025', attendees: 43},
  {date: 'Aug 08, 2025', attendees: 69},
  {date: 'Aug 15, 2025', attendees: 46},
  {date: 'Sep 12, 2025', attendees: 33},
  {date: 'Oct 03, 2025', attendees: 45},
  {date: 'Nov 07, 2025', attendees: 52},
]

export default function WorkshopHistory() {
  const totalAttendees = workshops.reduce(
    (sum, workshop) => sum + workshop.attendees,
    0,
  )

  return (
    <section className="py-16 sm:py-20">
      <div className="max-w-4xl mx-auto px-5">
        <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 shadow-xl shadow-gray-900/5 dark:shadow-orange-500/5 rounded-lg overflow-hidden">
          {/* Terminal header */}
          <div className="flex items-center justify-between bg-gray-100 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 py-2">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500/80 rounded-full border border-red-600/50"></div>
              <div className="w-3 h-3 bg-yellow-500/80 rounded-full border border-yellow-600/50"></div>
              <div className="w-3 h-3 bg-green-500/80 rounded-full border border-green-600/50"></div>
            </div>
            <div className="text-orange-600 dark:text-orange-400 text-sm font-mono">
              workshop-history.log
            </div>
            <div className="w-12"></div>
          </div>

          {/* Terminal content */}
          <div className="p-6 sm:p-8 font-mono text-gray-700 dark:text-gray-300 space-y-4">
            {/* Command prompt */}
            <div className="flex items-center text-sm sm:text-base">
              <span className="text-orange-600 dark:text-orange-400">$</span>
              <span className="ml-2">cat workshop-history.txt</span>
              <span className="animate-pulse ml-1 text-orange-600 dark:text-orange-400">
                _
              </span>
            </div>

            {/* Status output */}
            <div className="space-y-1 text-sm sm:text-base">
              <p className="text-gray-600 dark:text-gray-400">
                Loading previous workshop data...
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                Status:{' '}
                <span className="text-green-600 dark:text-green-400 font-semibold">
                  ALL WORKSHOPS SOLD OUT ✓
                </span>
              </p>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-800 my-4"></div>

            {/* Workshop list */}
            <div className="space-y-3">
              {workshops.map((workshop, index) => (
                <div
                  key={index}
                  className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-4 text-sm sm:text-base"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-cyan-600 dark:text-cyan-400">
                      [{String(index + 1).padStart(2, '0')}]
                    </span>
                    <span className="text-gray-700 dark:text-gray-300">
                      {workshop.date}
                    </span>
                    <span className="bg-red-600 dark:bg-red-600 text-white dark:text-gray-900 px-2 py-0.5 text-xs font-bold uppercase tracking-wide">
                      SOLD OUT
                    </span>
                  </div>
                  <span className="text-gray-600 dark:text-gray-400 ml-12 sm:ml-0">
                    avg. 45+ developers
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-200 dark:border-gray-800 my-4"></div>

            {/* Summary */}
            <div className="space-y-2 text-sm sm:text-base">
              <div className="flex items-center">
                <span className="text-orange-600 dark:text-orange-400">$</span>
                <p className="ml-2 text-gray-700 dark:text-gray-300">
                  Total workshops: {workshops.length}
                </p>
              </div>
              <div className="flex items-center">
                <span className="text-orange-600 dark:text-orange-400">$</span>
                <p className="ml-2 text-gray-700 dark:text-gray-300">
                  Total developers trained: {totalAttendees}
                </p>
              </div>
              <div className="flex items-center">
                <span className="text-orange-600 dark:text-orange-400">$</span>
                <p className="ml-2 text-gray-700 dark:text-gray-300">
                  Average satisfaction:{' '}
                  <span className="text-green-600 dark:text-green-400">
                    ★★★★★
                  </span>
                </p>
              </div>
            </div>

            {/* Closing prompt */}
            <div className="flex items-center text-sm sm:text-base pt-2">
              <span className="text-orange-600 dark:text-orange-400">$</span>
              <span className="ml-2 animate-pulse text-orange-600 dark:text-orange-400">
                _
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
