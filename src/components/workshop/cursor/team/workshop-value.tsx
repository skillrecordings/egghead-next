import {Target, Shield, RefreshCw, Hammer, Award} from 'lucide-react'

export function WorkshopValue() {
  const valueItems = [
    {
      icon: <Target className="h-5 w-5 text-black dark:text-white" />,
      title: 'Focus on Practicality:',
      description:
        'No abstract theory – just actionable workflows you can implement immediately.',
    },
    {
      icon: <Shield className="h-5 w-5 text-black dark:text-white" />,
      title: 'Emphasis on Control & Reliability:',
      description: 'Learn to direct the AI, not be frustrated by it.',
    },
    {
      icon: <RefreshCw className="h-5 w-5 text-black dark:text-white" />,
      title: 'Up-to-Date Insights:',
      description:
        'Covers the latest tool updates (Cursor Rules fixes, Gemini 2.5) and best practices.',
    },
    {
      icon: <Hammer className="h-5 w-5 text-black dark:text-white" />,
      title: 'Hands-On Project:',
      description:
        'Solidify learning by building a real-world multi-part application during the workshop.',
    },
    {
      icon: <Award className="h-5 w-5 text-black dark:text-white" />,
      title: 'Expert Instructor:',
      description:
        'Learn directly from John Lindquist, who actively develops AI tools and workflows.',
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
      {valueItems.map((item, index) => (
        <div
          key={index}
          className="flex flex-col gap-3 p-5 bg-gray-50 dark:bg-[#1a1f2e] rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm h-full"
        >
          <div className="bg-white dark:bg-[#141823] p-2 rounded-lg w-fit">
            {item.icon}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              {item.title}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              {item.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
