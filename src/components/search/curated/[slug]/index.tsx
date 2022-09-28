import * as React from 'react'
import Grid from 'components/grid'
import {HorizontalResourceCard} from 'components/card/new-horizontal-resource-card'
import {VerticalResourceCard} from 'components/card/new-vertical-resource-card'
import Image from 'next/image'
import ReactMarkdown from 'react-markdown'
import isEmpty from 'lodash/isEmpty'
import cx from 'classnames'
import {NextSeo} from 'next-seo'
import {CARD_TYPES} from 'components/search/curated/curated-essential'

type CuratedTopicProps = {
  topicData: any
  topic: any
}

const CuratedTopic: React.FC<CuratedTopicProps> = ({topic, topicData}) => {
  const {title, description, image, ogImage, sections, levels, jumbotron} =
    topicData
  const location = `${topic.name} landing`
  const pageDescription = `Life is too short for long boring videos. Learn ${topic.label} using the best screencast tutorial videos online.`
  const pageTitle = `In-Depth ${
    topic.label
  } Tutorials for ${new Date().getFullYear()}`

  return (
    <>
      <NextSeo
        title={pageTitle}
        description={pageDescription}
        titleTemplate={'%s | egghead.io'}
        twitter={{
          site: `@eggheadio`,
          cardType: CARD_TYPES.SUMMARY_LARGE_IMAGE,
        }}
        openGraph={{
          title,
          description: pageDescription,
          site_name: 'egghead',
          images: [
            {
              url:
                ogImage ||
                `https://og-image-react-egghead.now.sh/topic/${topic.name}?orientation=landscape&v=20201105`,
            },
          ],
        }}
      />
      <header className="bg-white bg-opacity-100 dark:bg-gray-1000 dark:bg-opacity-50">
        <div className="relative">
          <div className="flex flex-col items-center justify-between gap-5 px-5 py-5 sm:flex-row sm:py-10 sm:px-12">
            <div className="flex flex-col justify-center h-full">
              <h1 className="flex flex-wrap items-center space-x-2 text-4xl font-bold tracking-tight md:text-7xl sm:text-6xl">
                <Image
                  src={image}
                  alt={`${title} logo`}
                  width={50}
                  height={50}
                  priority
                />
                <span>{title}</span>
              </h1>
              <ReactMarkdown className="max-w-md pt-5 prose-sm prose dark:prose-dark sm:prose sm:dark:prose-dark dark:prose-a:text-blue-300 prose-a:text-blue-500 dark:prose-sm sm:pt-8 opacity-80">
                {description}
              </ReactMarkdown>
            </div>
            {jumbotron.resource ? (
              <div className="w-full max-w-xs">
                <VerticalResourceCard
                  describe={true}
                  resource={jumbotron.resource}
                  location={location}
                />
              </div>
            ) : jumbotron.image ? (
              <Image
                src={jumbotron.image}
                width={460}
                height={460}
                alt=""
                aria-hidden
                priority
                quality={100}
              />
            ) : null}
          </div>
        </div>
      </header>
      <div>
        {!isEmpty(levels) && (
          <div className="relative pt-8 pb-10 sm:pt-16 sm:pb-28">
            <h2 className="pb-8 font-mono text-xs tracking-wide text-center uppercase sm:text-sm text-medium opacity-80 sm:pl-12 sm:text-left sm:pb-0">
              {levels.subTitle}
            </h2>
            <div className="grid-cols-2 gap-3 px-3 space-y-5 sm:grid sm:space-y-0 lg:grid-cols-3 xl:gap-8 sm:gap-5 sm:px-5">
              {levels.resources.map((section: any, i: number) => {
                return (
                  <section
                    className={cx({
                      'sm:pt-24': i === 1,
                      'sm:pt-48': i === 0,
                    })}
                    key={section.id}
                  >
                    <div className="flex flex-col w-full pb-6">
                      <h2 className="text-lg font-semibold leading-tight lg:text-2xl sm:text-xl dark:text-white">
                        {section.title}
                      </h2>
                      <h3 className="opacity-80">{section.subTitle}</h3>
                    </div>
                    <div className="grid gap-3 xl:gap-5">
                      {section.resources.map((resource: any) => {
                        return (
                          <HorizontalResourceCard
                            key={resource.id}
                            resource={resource}
                            location={location}
                          />
                        )
                      })}
                    </div>
                  </section>
                )
              })}
            </div>
          </div>
        )}
        <div className="px-3 sm:px-5">
          {sections.map((section: any) => {
            return (
              <section className="pb-16" key={section.id}>
                {!section.image && !section.description ? (
                  // simple section
                  <div className="flex items-center justify-between w-full pb-6">
                    <h2 className="text-lg font-semibold leading-tight lg:text-2xl sm:text-xl dark:text-white">
                      {section.title}
                    </h2>
                  </div>
                ) : (
                  // section with image and description
                  <div className="flex flex-col items-center justify-center w-full pb-8 mb-5 md:flex-row md:items-start md:space-x-10">
                    {section.image && (
                      <div className="flex-shrink-0 md:max-w-none max-w-[200px]">
                        <Image
                          aria-hidden
                          src={section.image}
                          quality={100}
                          width={240}
                          height={240}
                          alt=""
                        />
                      </div>
                    )}
                    <div>
                      <h2 className="w-full pb-4 text-lg font-semibold leading-tight lg:text-2xl sm:text-xl dark:text-white">
                        {section.title}
                      </h2>
                      {section.description && (
                        <ReactMarkdown className="prose-sm prose text-gray-700 sm:prose dark:prose-dark dark:text-gray-300">
                          {section.description}
                        </ReactMarkdown>
                      )}
                    </div>
                  </div>
                )}
                <Grid className="grid grid-cols-2 gap-2 lg:grid-cols-4 md:grid-cols-3 sm:gap-3">
                  {section.resources.map((resource: any, i: number) => {
                    switch (section.resources.length) {
                      case 2:
                        return (
                          <HorizontalResourceCard
                            className="col-span-2"
                            key={resource.id}
                            resource={resource}
                            location={location}
                          />
                        )
                      case 3:
                        return i === 0 ? (
                          <HorizontalResourceCard
                            className="col-span-2"
                            key={resource.id}
                            resource={resource}
                            location={location}
                          />
                        ) : (
                          <VerticalResourceCard
                            key={resource.id}
                            resource={resource}
                            location={location}
                          />
                        )
                      case 6:
                        return i === 0 || i === 1 ? (
                          <HorizontalResourceCard
                            className="col-span-2"
                            key={resource.id}
                            resource={resource}
                            location={location}
                          />
                        ) : (
                          <VerticalResourceCard
                            key={resource.id}
                            resource={resource}
                            location={location}
                          />
                        )
                      case 7:
                        return i === 0 ? (
                          <HorizontalResourceCard
                            className="col-span-2"
                            key={resource.id}
                            resource={resource}
                            location={location}
                          />
                        ) : (
                          <VerticalResourceCard
                            key={resource.id}
                            resource={resource}
                            location={location}
                          />
                        )
                      default:
                        return (
                          <VerticalResourceCard
                            key={resource.id}
                            resource={resource}
                            location={location}
                          />
                        )
                    }
                  })}
                </Grid>
              </section>
            )
          })}
        </div>
      </div>
    </>
  )
}

export default CuratedTopic
