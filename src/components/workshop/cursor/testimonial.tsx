import Image from 'next/image'

export default function Testimonial({
  name,
  image,
  quote,
  link,
}: {
  name: string
  image: string
  quote: string
  link?: string
}) {
  return (
    <blockquote className="flex flex-col gap-4">
      <p className="text-lg font-semibold tracking-tight italic text-balance max-w-lg w-fit whitespace-pre-wrap">
        {quote}
      </p>
      <div className="flex items-center justify-center gap-2 opacity-80">
        <span className="opacity-80">—</span>
        <Image
          src={image}
          alt={name}
          width={32}
          height={32}
          className="rounded-full"
        />
        <div className="opacity-50 text-md">
          {link ? (
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="underline cursor-pointer"
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
