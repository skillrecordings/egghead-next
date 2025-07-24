import {HorizontalResourceCard} from '../card/horizontal-resource-card'
import {trpc} from '@/app/_trpc/client'

const ArticleTalkCard: React.FC<React.PropsWithChildren<{talk: any}>> = ({
  talk,
}) => {
  const {data} = trpc.lesson.getLessonbySlug.useQuery({slug: talk})

  return data ? (
    <div className="my-32">
      <HorizontalResourceCard
        resource={{
          name: 'check out this talk',
          byline: `${data.instructor.full_name}`,
          slug: data.slug,
          title: data.title,
          path: data.path,
          image: data.thumb_url,
        }}
      />
    </div>
  ) : null
}

export default ArticleTalkCard
