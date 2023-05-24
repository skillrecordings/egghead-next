import Grid from 'components/grid'
import {HorizontalResourceCard} from 'components/card/new-horizontal-resource-card'
import {VerticalResourceCard} from 'components/card/new-vertical-resource-card'
import analytics from 'utils/analytics'

const ResourceWidget: React.FC<{
  resource: any
  cta?: string
  location?: string
}> = ({resource, location}: any) => {
  const {podcasts, talks, collections, articles} = resource
  return (
    <>
      {collections &&
        collections.map((collection: any) => {
          return (
            <div>
              <h4 className="prose dark:prose-dark sm:prose-lg lg:prose-xl mt-5 max-w-none dark:prose-a:text-blue-300 prose-a:text-blue-500 font-bold">
                {collection.title}
              </h4>
              <Grid>
                {collection.courses.map((resource: any, i: number) => {
                  switch (collection.courses.length) {
                    case 3:
                      return i === 0 ? (
                        <HorizontalResourceCard
                          location={location}
                          className="col-span-2"
                          key={resource.slug}
                          resource={resource}
                        />
                      ) : (
                        <VerticalResourceCard
                          location={location}
                          key={resource.slug}
                          resource={resource}
                        />
                      )
                    case 6:
                      return i === 0 || i === 1 ? (
                        <HorizontalResourceCard
                          location={location}
                          className="col-span-2"
                          key={resource.slug}
                          resource={resource}
                        />
                      ) : (
                        <VerticalResourceCard
                          location={location}
                          key={resource.slug}
                          resource={resource}
                        />
                      )
                    case 7:
                      return i === 0 ? (
                        <HorizontalResourceCard
                          location={location}
                          className="col-span-2"
                          key={resource.slug}
                          resource={resource}
                        />
                      ) : (
                        <VerticalResourceCard
                          location={location}
                          key={resource.slug}
                          resource={resource}
                        />
                      )
                    default:
                      return (
                        <VerticalResourceCard
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
      {articles && (
        <div className="bg-gray-100 dark:bg-gray-800 p-8">
          <h3 className="prose dark:prose-dark sm:prose-xl lg:prose-2xl max-w-none dark:prose-a:text-blue-300 prose-a:text-blue-500 font-bold mb-4">
            {resource.title}
          </h3>
          <p className="prose dark:prose-dark sm:prose-lg lg:prose-xl max-w-none dark:prose-a:text-blue-300 prose-a:text-blue-500 mb-4">
            {' '}
            {resource.description}{' '}
          </p>
          <Grid>
            {articles?.map((article: any, i: number) => {
              switch (articles.length) {
                case 1: {
                  return (
                    <HorizontalResourceCard
                      location={location}
                      className="col-span-2 md:col-span-4 dark:bg-gray-600"
                      key={article.slug}
                      resource={article}
                    />
                  )
                }
                case 3:
                  return i === 0 ? (
                    <HorizontalResourceCard
                      location={location}
                      className="col-span-2 dark:bg-gray-600"
                      key={article.slug}
                      resource={article}
                    />
                  ) : (
                    <VerticalResourceCard
                      location={location}
                      key={article.slug}
                      resource={article}
                      className="dark:bg-gray-600"
                    />
                  )
                case 6:
                  return i === 0 || i === 1 ? (
                    <HorizontalResourceCard
                      location={location}
                      className="col-span-2 dark:bg-gray-600"
                      key={article.slug}
                      resource={article}
                    />
                  ) : (
                    <VerticalResourceCard
                      location={location}
                      key={article.slug}
                      resource={article}
                      className="dark:bg-gray-600"
                    />
                  )
                case 7:
                  return i === 0 ? (
                    <HorizontalResourceCard
                      location={location}
                      className="col-span-2 dark:bg-gray-600"
                      key={article.slug}
                      resource={article}
                    />
                  ) : (
                    <VerticalResourceCard
                      location={location}
                      key={article.slug}
                      resource={article}
                      className="dark:bg-gray-600"
                    />
                  )
                default:
                  return (
                    <VerticalResourceCard
                      location={location}
                      key={article.slug}
                      resource={article}
                      className="dark:bg-gray-600 text-xs"
                    />
                  )
              }
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
