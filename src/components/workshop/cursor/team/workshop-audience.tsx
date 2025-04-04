import {Users, UserCog, Code, Laptop} from 'lucide-react'

export function WorkshopAudience() {
  const audienceItems = [
    {
      icon: <Users className="h-5 w-5 text-black dark:text-white" />,
      title: 'Development Teams:',
      description:
        'Seeking practical, shared strategies to boost productivity with AI.',
    },
    {
      icon: <UserCog className="h-5 w-5 text-black dark:text-white" />,
      title: 'Tech Leads & Engineering Managers:',
      description: 'Looking to implement effective AI workflows and standards.',
    },
    {
      icon: <Code className="h-5 w-5 text-black dark:text-white" />,
      title: 'Senior & Mid-Level Engineers:',
      description:
        'Wanting to master AI tools for complex tasks and improve efficiency.',
    },
    {
      icon: <Laptop className="h-5 w-5 text-black dark:text-white" />,
      title: 'Teams using or considering Cursor:',
      description: 'Eager to unlock its full potential reliably.',
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
      {audienceItems.map((item, index) => (
        <div
          key={index}
          className="flex gap-3 bg-gray-50 dark:bg-[#1a1f2e] p-5 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm"
        >
          <div className="mt-1 bg-white dark:bg-[#141823] p-2 rounded-lg h-fit">
            {item.icon}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">
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
