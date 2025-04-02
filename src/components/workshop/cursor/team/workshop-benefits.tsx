import {AlertTriangle, Clock, Repeat, Search} from 'lucide-react'

export function WorkshopBenefits() {
  const benefits = [
    {
      icon: (
        <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
      ),
      text: 'Are AI coding suggestions often unreliable, outdated, or lacking context?',
    },
    {
      icon: <Clock className="h-5 w-5 text-red-600 dark:text-red-400" />,
      text: 'Do developers waste time wrestling with unpredictable AI behavior instead of shipping features?',
    },
    {
      icon: <Repeat className="h-5 w-5 text-blue-600 dark:text-blue-400" />,
      text: 'Are you looking for repeatable, structured ways to leverage AI speed without sacrificing control or quality?',
    },
    {
      icon: <Search className="h-5 w-5 text-green-600 dark:text-green-400" />,
      text: "Do you need practical strategies to ensure consistency and harness AI's power across your entire team?",
    },
  ]

  return (
    <ul className="space-y-4">
      {benefits.map((benefit, index) => (
        <li key={index} className="flex items-start gap-3">
          <div className="mt-1">{benefit.icon}</div>
          <span className="text-gray-700 dark:text-gray-300">
            {benefit.text}
          </span>
        </li>
      ))}
    </ul>
  )
}
