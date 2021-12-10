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
                `https://og-image-react-egghead.now.sh/topic/${topic.name}?orientation=landscape&v=20201104`,
            },
          ],
        }}
      />
      <header className="dark:bg-gray-1000 dark:bg-opacity-50 bg-white bg-opacity-100">
        <div className="relative">
          <div className="flex sm:flex-row flex-col items-center justify-between sm:py-10 py-5 sm:px-12 px-5 gap-5">
            <div className="h-full flex flex-col justify-center">
              <h1 className="md:text-7xl sm:text-6xl text-4xl font-bold tracking-tight flex items-center flex-wrap space-x-2">
                <Image
                  src={image}
                  alt={`${title} logo`}
                  width={50}
                  height={50}
                  priority
                />
                <span>{title}</span>
              </h1>
              <ReactMarkdown className="prose dark:prose-dark sm:prose sm:dark:prose-dark dark:prose-sm prose-sm max-w-md sm:pt-8 pt-5 opacity-80">
                {description}
              </ReactMarkdown>
            </div>
            {jumbotron.resource ? (
              <div className="max-w-xs w-full">
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
          <div className="relative sm:pt-16 pt-8 sm:pb-28 pb-10">
            <h2 className="sm:text-sm text-xs font-mono text-medium tracking-wide uppercase opacity-80 sm:pl-12 sm:text-left text-center sm:pb-0 pb-8">
              {levels.subTitle}
            </h2>
            <div className="sm:grid sm:space-y-0 space-y-5 lg:grid-cols-3 grid-cols-2 xl:gap-8 sm:gap-5 gap-3 sm:px-5 px-3">
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
                      <h2 className="lg:text-2xl sm:text-xl text-lg dark:text-white font-semibold leading-tight">
                        {section.title}
                      </h2>
                      <h3 className="opacity-80">{section.subTitle}</h3>
                    </div>
                    <div className="grid xl:gap-5 gap-3">
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
        <div className="sm:px-5 px-3">
          {sections.map((section: any) => {
            return (
              <section className="pb-16" key={section.id}>
                {!section.image && !section.description ? (
                  // simple section
                  <div className="flex w-full pb-6 items-center justify-between">
                    <h2 className="lg:text-2xl sm:text-xl text-lg dark:text-white font-semibold leading-tight">
                      {section.title}
                    </h2>
                  </div>
                ) : (
                  // section with image and description
                  <div className="flex md:flex-row flex-col md:items-start items-center justify-center w-full mb-5 pb-8 md:space-x-10">
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
                      <h2 className="w-full lg:text-2xl sm:text-xl text-lg dark:text-white font-semibold leading-tight pb-4">
                        {section.title}
                      </h2>
                      {section.description && (
                        <ReactMarkdown className="prose sm:prose prose-sm dark:prose-dark dark:text-gray-300 text-gray-700">
                          {section.description}
                        </ReactMarkdown>
                      )}
                    </div>
                  </div>
                )}
                <Grid className="grid grid-cols-2 lg:grid-cols-4 md:grid-cols-3 sm:gap-3 gap-2">
                  {section.resources.map((resource: any, i: number) => {
                    // if there are only 3 resources, the first one will use HorizontalResourceCard
                    return section.resources.length === 3 && i === 0 ? (
                      <HorizontalResourceCard
                        className="col-span-2"
                        key={resource.id}
                        resource={resource}
                        location={location}
                      />
                    ) : (
                      <VerticalResourceCard
                        small
                        key={resource.id}
                        resource={resource}
                        location={location}
                      />
                    )
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
