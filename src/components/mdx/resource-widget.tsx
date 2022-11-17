import Grid from 'components/grid'
import {HorizontalResourceCard} from 'components/card/new-horizontal-resource-card'
import {VerticalResourceCard} from 'components/card/new-vertical-resource-card'
import {CardResource} from 'types'

const ResourceWidget: React.FC<{course: any; cta?: string}> = ({
  resource,
}: any) => {
  const {podcasts, talks, collections} = resource
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
                          className="col-span-2"
                          key={resource.slug}
                          resource={resource}
                        />
                      ) : (
                        <VerticalResourceCard
                          key={resource.slug}
                          resource={resource}
                        />
                      )
                    case 6:
                      return i === 0 || i === 1 ? (
                        <HorizontalResourceCard
                          className="col-span-2"
                          key={resource.slug}
                          resource={resource}
                        />
                      ) : (
                        <VerticalResourceCard
                          key={resource.slug}
                          resource={resource}
                        />
                      )
                    case 7:
                      return i === 0 ? (
                        <HorizontalResourceCard
                          className="col-span-2"
                          key={resource.slug}
                          resource={resource}
                        />
                      ) : (
                        <VerticalResourceCard
                          key={resource.slug}
                          resource={resource}
                        />
                      )
                    default:
                      return (
                        <VerticalResourceCard
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
      {(podcasts || talks) && (
        <Grid className="grid grid-cols-2 gap-2 md:grid-cols-4 xl:gap-5 sm:gap-3">
          {talks.map((talk: any) => {
            return <VerticalResourceCard key={talk.slug} resource={talk} />
          })}
          {podcasts.map((podcast: any) => {
            return (
              <VerticalResourceCard key={podcast.slug} resource={podcast} />
            )
          })}
        </Grid>
      )}
    </>
  )
}

export default ResourceWidget
