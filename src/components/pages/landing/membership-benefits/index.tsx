import * as React from 'react'
import Image from 'next/image'

const features = [
  {
    icon: 'cc',
    description: 'Transcripts and closed captions on every video',
  },
  {
    icon: 'support',
    description: 'Priority customer support and assistance',
  },
  {
    icon: 'offline',
    description: 'Downloadable videos to watch offline',
  },
  {
    icon: 'code',
    description: 'Code examples for every lesson',
  },
  {
    title: '5,500+',
    description: 'Bite-size video lessons',
  },
  {
    title: '250+',
    description: 'Comprehensive courses',
  },
  {
    icon: 'bookmark',
    description: 'Bookmarks to create learning plans and stay organised',
  },
  {
    icon: 'exercises',
    description: 'Practice projects to apply your knowledge',
  },
  {
    icon: 'rss',
    description: 'RSS feeds for your favourite podcasting app',
  },
  {
    icon: 'player',
    description: 'Speed controls to watch at your own pace',
  },
]

const FeatureBox: React.FC<{
  title: React.ReactElement | string
  description: string
}> = ({title, description}) => {
  return (
    <div className="dark:bg-gradient-to-b dark:from-gray-800 dark:to-gray-900 bg-white shadow-smooth dark:shadow-none p-10 rounded-md flex flex-col items-center justify-center">
      <div className="text-2xl font-bold">{title}</div>
      <div className="text-center leading-tight text-sm dark:text-gray-200 text-gray-800">
        {description}
      </div>
    </div>
  )
}

const Column: React.FC<{features: any; className?: string}> = ({
  features,
  className,
}) => {
  return (
    <div className={className}>
      {features.map((feature: any) => {
        return (
          <FeatureBox
            title={
              feature.icon ? (
                <Image
                  src={require(`./icons/${feature.icon}.svg`)}
                  alt={feature.icon}
                />
              ) : (
                feature.title
              )
            }
            description={feature.description}
          />
        )
      })}
    </div>
  )
}

const MembershipBenefits: React.FC = () => {
  return (
    <section className="px-5 grid md:grid-cols-3 gap-5 max-w-screen-lg mx-auto w-full">
      <Column
        features={features.slice(0, 3)}
        className="grid md:grid-rows-4 gap-5 md:translate-y-[88px]"
      />
      <Column
        features={features.slice(3, 7)}
        className="grid md:grid-rows-4 md:row-start-auto row-start-1 gap-5"
      />
      <Column
        features={features.slice(7, 10)}
        className="grid md:grid-rows-4 gap-5 md:translate-y-[88px]"
      />
    </section>
  )
}

export default MembershipBenefits
