import * as React from 'react'
import Markdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import rehypeSanitize from 'rehype-sanitize'
import Image from 'next/image'

type TestimonialsProps = {
  testimonials: {
    praise: string
    author: {
      name: string
      description?: string
      image: string
    }
  }[]
}

const Testimonials: React.FunctionComponent<TestimonialsProps> = ({
  testimonials,
}) => {
  return (
    <div className="max-w-screen-lg grid md:grid-cols-2 gap-10 py-24 border-t dark:border-gray-800 border-gray-100">
      {testimonials.map((testimonial: any) => {
        const {praise, author} = testimonial
        return (
          <div className="flex flex-col items-center" key={author.name}>
            <div className="text-lg font-medium leading-tight text-center">
              <Markdown rehypePlugins={[rehypeRaw, rehypeSanitize]}>
                {praise}
              </Markdown>
            </div>
            <div className="flex items-center space-x-2 pt-4">
              <Image
                src={author.image}
                alt={author.name}
                width={48}
                height={48}
                quality={100}
              />
              <div className="flex flex-col justify-center">
                <span className="leading-none">{author.name}</span>
                <span className="text-sm opacity-70">{author.description}</span>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default Testimonials
