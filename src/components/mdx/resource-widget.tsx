import Grid from 'components/grid'
import {HorizontalResourceCard} from 'components/card/new-horizontal-resource-card'
import {VerticalResourceCard} from 'components/card/new-vertical-resource-card'
import {twMerge} from 'tailwind-merge'

const VerticalResourceCardForWidget: React.FC<{
  resource: any
  location?: string
  className?: string
}> = ({resource, location, className}: any) => {
  return (
    <div className={twMerge('relative group', className)}>
      {resource?.byline && (
        <span className="absolute top-0 left-0 z-10 bg-gray-100 dark:bg-gray-800 rounded-bl-none rounded-tr-none rounded-md px-2 p-1 dark:group-hover:bg-gray-700 dark:group-hover:bg-opacity-50 transition-all ease-in-out duration-200 uppercase font-medium lg:text-[0.65rem] text-[0.55rem] text-gray-700 dark:text-indigo-100">
          {resource.byline}
        </span>
      )}
      <VerticalResourceCard
        location={location}
        key={resource.slug}
        resource={resource}
        className=""
      />
    </div>
  )
}

const HorizontalResourceCardForWidget: React.FC<{
  resource: any
  location?: string
  className?: string
}> = ({resource, location, className}: any) => {
  return (
    <div className={twMerge('relative group', className)}>
      {resource?.byline && (
        <span className="absolute top-0 left-0 z-10 bg-gray-100 dark:bg-gray-800 rounded-bl-none rounded-tr-none rounded-md px-2 p-1 dark:group-hover:bg-gray-700 dark:group-hover:bg-opacity-50 transition-all ease-in-out duration-200 uppercase font-medium lg:text-[0.65rem] text-[0.55rem] text-gray-700 dark:text-indigo-100">
          {resource.byline}
        </span>
      )}
      <HorizontalResourceCard
        location={location}
        key={resource.slug}
        resource={resource}
        className=""
      />
    </div>
  )
}

const ResourceWidget: React.FC<{
  resource: any
  cta?: string
  location?: string
}> = ({resource, location}: any) => {
  const {podcasts, talks, collections, articles} = resource
  return (
    <>
      {articles.length > 0 ? null : (
        <h3 className="prose dark:prose-dark sm:prose-xl lg:prose-2xl max-w-none dark:prose-a:text-blue-300 prose-a:text-blue-500 font-bold mb-4">
          {resource.title}
        </h3>
      )}
      {collections &&
        collections.map((collection: any) => {
          return (
            <div key={collection.slug}>
              <h4 className="prose dark:prose-dark sm:prose-lg lg:prose-xl mt-5 max-w-none dark:prose-a:text-blue-300 prose-a:text-blue-500 font-bold">
                {collection.title}
              </h4>
              <Grid>
                {collection.courses.map((resource: any, i: number) => {
                  switch (collection.courses.length) {
                    case 3:
                      return i === 0 ? (
                        <HorizontalResourceCardForWidget
                          location={location}
                          className="col-span-2"
                          key={resource.slug}
                          resource={resource}
                        />
                      ) : (
                        <VerticalResourceCardForWidget
                          location={location}
                          key={resource.slug}
                          resource={resource}
                        />
                      )
                    case 6:
                      return i === 0 || i === 1 ? (
                        <HorizontalResourceCardForWidget
                          location={location}
                          className="col-span-2"
                          key={resource.slug}
                          resource={resource}
                        />
                      ) : (
                        <VerticalResourceCardForWidget
                          location={location}
                          key={resource.slug}
                          resource={resource}
                        />
                      )
                    case 7:
                      return i === 0 ? (
                        <HorizontalResourceCardForWidget
                          location={location}
                          className="col-span-2"
                          key={resource.slug}
                          resource={resource}
                        />
                      ) : (
                        <VerticalResourceCardForWidget
                          location={location}
                          key={resource.slug}
                          resource={resource}
                        />
                      )
                    default:
                      return (
                        <VerticalResourceCardForWidget
                          location={location}
                          key={resource.slug}
                          resource={resource}
                        />
                      )
                  }
                })}
              </Grid>
            </div>
          )
        })}
      {articles.length > 0 && (
        <div className="bg-gray-100 dark:bg-gray-800 p-8 rounded-md">
          <h3 className="prose dark:prose-dark sm:prose-xl lg:prose-2xl max-w-none dark:prose-a:text-blue-300 prose-a:text-blue-500 font-bold mb-4">
            {resource.title}
          </h3>
          <p className="prose dark:prose-dark sm:prose-lg lg:prose-xl max-w-none dark:prose-a:text-blue-300 prose-a:text-blue-500 mb-4">
            {' '}
            {resource.description}{' '}
          </p>
          <Grid className="hidden sm:grid sm:grid-cols-4 gap-4">
            {articles?.map((article: any, i: number) => {
              switch (articles.length) {
                case 1: {
                  return (
                    <HorizontalResourceCardForWidget
                      location={location}
                      className="col-span-3 md:col-span-4 dark:bg-gray-600 rounded-md"
                      key={article.slug}
                      resource={article}
                    />
                  )
                }
                case 2: {
                  return i === 0 ? (
                    <VerticalResourceCardForWidget
                      location={location}
                      className="col-span-2 dark:bg-gray-600 rounded-md"
                      key={article.slug}
                      resource={article}
                    />
                  ) : (
                    <VerticalResourceCardForWidget
                      location={location}
                      key={article.slug}
                      resource={article}
                      className="col-span-2 dark:bg-gray-600 rounded-md"
                    />
                  )
                }
                default:
                  return (
                    <VerticalResourceCardForWidget
                      location={location}
                      key={article.slug}
                      resource={article}
                      className="dark:bg-gray-600 rounded-md"
                    />
                  )
              }
            })}
          </Grid>
          <Grid className="sm:hidden grid gap-4">
            {articles?.map((article: any, i: number) => {
              return (
                <HorizontalResourceCardForWidget
                  location={location}
                  className="col-span-2 dark:bg-gray-600"
                  key={article.slug}
                  resource={article}
                />
              )
            })}
          </Grid>
        </div>
      )}
      {(podcasts || talks) && (
        <Grid className="grid grid-cols-2 gap-2 md:grid-cols-4 xl:gap-5 sm:gap-3 ">
          {talks.map((talk: any) => {
            return (
              <VerticalResourceCard
                key={talk.slug}
                resource={talk}
                location={location}
              />
            )
          })}
          {podcasts.map((podcast: any) => {
            return (
              <VerticalResourceCard
                key={podcast.slug}
                resource={podcast}
                location={location}
              />
            )
          })}
        </Grid>
      )}
    </>
  )
}

export default ResourceWidget
