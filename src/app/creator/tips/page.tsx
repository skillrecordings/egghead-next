import {Tip} from 'lib/tips'
import TipCard from 'components/tips/tip-card'
import Balancer from 'react-wrap-balancer'

import {serverClient} from 'app/_trpc/serverClient'
import {cookies} from 'next/headers'
import {getAbilityFromToken} from 'server/ability'
import {redirect} from 'next/navigation'

type TipsIndex = {
  tips: Tip[]
}

const TipsIndex: React.FC<any> = async () => {
  const cookieStore = cookies()
  const eghUserToken = cookieStore.get('eh_token_2020_11_22')?.value
  const ability = await getAbilityFromToken(eghUserToken)
  if (!ability.can('upload', 'Video')) redirect('/tips')

  const eghCookie = cookieStore.get('eh_user')?.value
  const eghUser = JSON.parse(eghCookie ?? '{}')
  const allTips =
    ((await serverClient.tips.byInstructor({
      id: String(eghUser?.instructor_id),
    })) as Tip[]) ?? []

  return (
    <>
      <header className="mx-auto flex w-full max-w-4xl flex-col items-center space-y-3 px-5 py-16 text-center">
        <h1 className="mx-auto text-center text-4xl font-semibold">
          Tips Creator Dashboard
        </h1>
        <h2 className="w-full max-w-md text-base text-gray-600 dark:text-gray-500">
          <Balancer>
            You can create and update your tips here in this dashboard
          </Balancer>
        </h2>
        <button className="mt-4 transition-all duration-150 ease-in-out bg-blue-600 hover:bg-blue-700 active:bg-blue-800 hover:scale-105 hover:shadow-xl text-white font-semibold py-3 px-5 rounded-md">
          Create New Tip
        </button>
      </header>
      <main className="w-full">
        <div className="flex w-full h-screen max-w-screen-2xl mx-auto">
          <aside className="w-1/3 h-full overflow-y-auto p-4 bg-white bg-opacity-10 rounded-sm">
            <h2 className="text-xl font-bold mb-4">Current Tips</h2>
            <div className="flex flex-col gap-4">
              {allTips &&
                allTips.map((tip: Tip) => {
                  return (
                    <div className="flex justify-between p-4 w-full hover:dark:bg-gray-900 cursor-pointer">
                      <div className=" font-medium">{tip.title}</div>
                      <span className="">{tip.state}</span>
                    </div>
                  )
                })}
            </div>
          </aside>
          <div className="w-2/3 h-full p-4">
            <h2 className="text-xl font-bold mb-4">Tip Details</h2>
            {allTips &&
              allTips.map((tip: Tip) => {
                return <div>{tip.title}</div>
              })}
          </div>
        </div>
      </main>
    </>
  )
}

export default TipsIndex
