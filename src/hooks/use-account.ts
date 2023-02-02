import {isPast} from 'date-fns'
import {useViewer} from '../context/viewer-context'
import {trpc} from '../trpc/trpc.client'

export const useAccount = () => {
  const {viewer} = useViewer()
  const {data: userAccounts, status: accountLoadingStatus} =
    trpc.user.accountsForCurrent.useQuery()

  const isInstructor = viewer?.is_instructor

  console.log({isInstructor})

  const isActiveAccountMember = userAccounts?.some(
    (account: {members: {id: number}[]}) => {
      return account.members?.find((member: {id: number}) => {
        return member.id === viewer.id
      })
    },
  )
  const isAccountOwner = userAccounts?.some(
    (account: {owner: {id: number}}) => {
      return account.owner?.id === viewer.id
    },
  )

  const isTeamAccountOwner = userAccounts?.some(
    (account: {owner: {id: number}; capacity: number}) => {
      return account.owner?.id === viewer.id && account.capacity > 1
    },
  )

  const account =
    isAccountOwner &&
    userAccounts?.find((account: {owner: {id: number}}) => {
      return account.owner?.id === viewer.id
    })

  const giftExpiration = account?.subscriptions?.[0]?.current_period_end
  const isGiftExpired = isPast(new Date(giftExpiration))
  const isGiftMembership =
    account?.subscriptions?.[0]?.type === 'gift' &&
    (account?.subscriptions?.[0]?.status === 'active' ||
      account?.subscriptions?.[0]?.status === 'past_due' ||
      account?.subscriptions?.[0]?.status === 'trialing') &&
    !isGiftExpired

  const isTeamMember = isActiveAccountMember && !isAccountOwner
  const hasStripeAccount = Boolean(account?.stripe_customer_id)

  let isDisabled = [
    'incomplete',
    'canceled',
    'incomplete_expired',
    'unpaid',
  ].includes(account?.subscriptions?.[0]?.status)

  console.debug()
  console.debug('useAccount', {
    account,
    isActiveAccountMember,
    isTeamAccountOwner,
    isAccountOwner,
    isGiftMembership,
    giftExpiration,
    isTeamMember,
    hasStripeAccount,

    accountLoading: accountLoadingStatus === 'loading',
    accountOwner: userAccounts?.find((account: any) => account?.owner)?.owner,
  })
  console.debug()

  return {
    account,
    isActiveAccountMember,
    isTeamAccountOwner,
    isAccountOwner,
    isGiftMembership,
    giftExpiration,
    isTeamMember,
    hasStripeAccount,
    isDisabled,
    isInstructor,
    accountLoading: accountLoadingStatus === 'loading',
    accountOwner: userAccounts?.find((account: any) => account?.owner)?.owner,
  }
}
