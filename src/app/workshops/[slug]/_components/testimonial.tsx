import Image from 'next/image'

export default function Testimonial({
  name,
  image,
  quote,
  link,
}: {
  name: string
  quote: string
  image?: string
  link?: string
}) {
  return (
    <blockquote className="not-prose flex flex-col items-center my-12 sm:my-16 lg:my-20 px-6 sm:px-8 py-8 sm:py-10 relative bg-gradient-to-b from-primary/[0.02] to-transparent rounded-xl">
      {/* <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-5xl sm:text-6xl lg:text-7xl text-primary/[0.06] font-serif select-none pointer-events-none" aria-hidden="true">"</div> */}
      <p className="prose-base md:prose-xl font-semibold leading-relaxed tracking-normal text-balance max-w-3xl mx-auto text-center whitespace-pre-wrap relative z-10 text-gray-800 dark:text-gray-200 italic">
        {quote}
      </p>
      <div className="flex items-center justify-center gap-3 mt-6">
        <span className="text-gray-400 text-base">—</span>
        {image && (
          <Image
            src={image}
            alt={name}
            width={36}
            height={36}
            className="rounded-full ring-1 ring-gray-200 dark:ring-gray-700"
          />
        )}
        <div className="text-sm sm:text-base font-medium text-gray-600 dark:text-gray-400">
          {link ? (
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-800 dark:hover:text-gray-200 transition-colors underline decoration-gray-300 dark:decoration-gray-600 underline-offset-2 hover:decoration-gray-500 dark:hover:decoration-gray-400"
            >
              {name}
            </a>
          ) : (
            name
          )}
        </div>
      </div>
    </blockquote>
  )
}
