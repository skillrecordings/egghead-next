export default function Callout({children, text, className}) {
  return (
    <div
      className={`leading-relaxed mx-auto my-3 w-full dark:bg-gray-800 bg-blue-100 border-l-4 border-blue-900  sm:px-8 px-4 py-6 rounded-sm font-small sm:text-lg text-base tracking-normal shadow-md ${className}`}
    >
      {text ? text : children}
    </div>
  )
}
