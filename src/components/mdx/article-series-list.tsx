import Link from 'next/link'
import {useRouter} from 'next/router'
import cx from 'classnames'

const ArticleSeriesList: React.FC<{
  resource: any
  cta?: string
  location?: string
}> = ({resource, location}: any) => {
  const {articles} = resource
  const router = useRouter()

  return (
    <div className="border dark:border-gray-700 border-gray-200  rounded p-8">
      <h2 className=" text-2xl">{resource.title}</h2>
      <p className="prose my-2 dark:prose-dark ">{resource.description}</p>
      <hr className="dark:border-gray-700 border-gray-200"></hr>
      <ul className="flex flex-col mt-2">
        {articles.map((article: any, i: number) => {
          return (
            <Link href={article.path}>
              <a
                className={cx('flex gap-4 group hover:text-blue-500 w-fit', {
                  'font-bold underline': article.path === router.asPath,
                })}
              >
                <span
                  className={cx(
                    'text-2xl self-center font-mono group-hover:underline',
                    {
                      'font-black': article.path === router.asPath,
                    },
                  )}
                >
                  {i + 1}
                </span>
                <h3 className="text-xl self-center">{article.title}</h3>
              </a>
            </Link>
          )
        })}
      </ul>
    </div>
  )
}

export default ArticleSeriesList
