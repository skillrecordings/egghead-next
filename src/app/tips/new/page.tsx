import TipCreationForm from '@/components/tips/tip-uploader'
import {cookies} from 'next/headers'
import {ACCESS_TOKEN_KEY} from '@/utils/auth'
import {getAbilityFromToken} from '@/server/ability'
import {redirect} from 'next/navigation'

const NewTip = async () => {
  const cookieStore = cookies()
  const userToken = cookieStore?.get(ACCESS_TOKEN_KEY ?? '')?.value
  const ability = await getAbilityFromToken(userToken)

  if (!ability.can('create', 'Content')) {
    redirect('/')
  }

  return (
    <div className="max-w-2xl mx-auto mt-24">
      <h1 className="mx-auto text-4xl font-semibold text-center">New Tips</h1>
      <TipCreationForm />
    </div>
  )
}

export default NewTip
