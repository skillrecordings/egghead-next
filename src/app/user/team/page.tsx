import {loadTeams} from '@/lib/teams'
import Team, {TeamData} from '@/components/app/team'
import find from 'lodash/find'
import {ACCESS_TOKEN_KEY} from '@/utils/auth'
import {cookies} from 'next/headers'
import {redirect} from 'next/navigation'

const TeamPage = async () => {
  const cookieStore = cookies()
  const eggheadToken = cookieStore?.get(ACCESS_TOKEN_KEY ?? '')?.value ?? ''

  const {data: teams = []} = await loadTeams(eggheadToken)

  const fetchedTeam = find(teams, (team) => team.capacity > 0)

  if (!fetchedTeam) {
    return redirect('/user/membership')
  }

  const team: TeamData = {
    accountId: fetchedTeam.id,
    name: fetchedTeam.name,
    inviteUrl: `${process.env.NEXT_PUBLIC_DEPLOYMENT_URL}/team-invite/${fetchedTeam.invite_token}`,
    members: fetchedTeam.members,
    numberOfMembers: fetchedTeam.number_of_members,
    capacity: fetchedTeam.capacity,
    isFull: fetchedTeam.is_full,
    accountSlug: fetchedTeam.slug,
    stripeCustomerId: fetchedTeam.stripe_customer_id,
  }

  return (
    <div className="w-full">
      <Team team={team} />
    </div>
  )
}

export default TeamPage
