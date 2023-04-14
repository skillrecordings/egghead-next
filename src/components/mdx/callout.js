export default function Callout({children, text, className}) {
  return (
    <div
      className={`p-5 leading-relaxed mx-auto my-3 w-full dark:bg-gray-800 bg-blue-100 border-l-4 border-blue-900 sm:space-x-5 space-x-0 sm:space-y-0 space-y-5 items-center text-left shadow-sm rounded-lg overflow-hidden lg:text-lg sm:text-md ${className}`}
    >
      {text ? text : children}
    </div>
  )
}
