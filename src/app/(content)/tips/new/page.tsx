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

  redirect('https://builder.egghead.io/posts')

  return null
}

export default NewTip
