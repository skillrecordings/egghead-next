import * as React from 'react'

import {ItemWrapper} from 'components/pages/user/components/widget-wrapper'
import {useViewer} from 'context/viewer-context'
import {
  AvatarForm,
  RequestEmailChangeForm,
  // RequestNameChangeForm,
} from '../components'
import {trpc} from 'trpc/trpc.client'
import toast from 'react-hot-toast'

const ProfileTabContent: React.FC<any> = () => {
  const {viewer, authToken} = useViewer()
  const {email: currentEmail, providers} = viewer || {}
  const isConnectedToGithub = providers?.includes('github')

  return (
    <div className="space-y-10 md:space-y-14 xl:space-y-16">
      <ItemWrapper title="Email address">
        <RequestEmailChangeForm originalEmail={currentEmail} />
      </ItemWrapper>
      {/* <ItemWrapper title="Preferred Name">
        <RequestNameChangeForm originalEmail={currentEmail} />
      </ItemWrapper> */}
      <ItemWrapper title="Avatar">
        <AvatarForm avatarUrl={viewer.avatar_url} />
      </ItemWrapper>
      <ConnectGithub
        isConnectedToGithub={isConnectedToGithub}
        authToken={authToken}
      />
    </div>
  )
}

export default ProfileTabContent

const GithubDisConnectButton: React.FunctionComponent<{
  setIsConnected: Function
}> = ({setIsConnected}) => {
  let removeLink = trpc.user.removeGithubLink.useMutation({
    onSuccess: (data) => {
      toast.success('Github account disconnected', {duration: 3000, icon: '✅'})
    },
    onError: (error) => {
      setIsConnected(true)
      toast.error('Error disconnecting Github account', {
        duration: 3000,
        icon: '❌',
      })
    },
  })

  const handleClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    setIsConnected(false)
    removeLink.mutate()
  }

  return (
    <button
      onClick={handleClick}
      className="inline-block px-4 py-3 text-gray-900 hover:text-white dark:text-white border-blue-600 border rounded focus:outline-none hover:bg-blue-700"
    >
      Disconnect Your GitHub Account
    </button>
  )
}

const GithubConnectButton: React.FunctionComponent<{
  authToken: string
}> = ({authToken}) => {
  return (
    <a
      href={`${process.env.NEXT_PUBLIC_AUTH_DOMAIN}/users/github_passthrough?client_id=${process.env.NEXT_PUBLIC_CLIENT_ID}&auth_token=${authToken}`}
      className="inline-block px-4 py-3 text-gray-900 hover:text-white dark:text-white border-blue-600 border rounded focus:outline-none hover:bg-blue-700"
    >
      Connect Your GitHub Account
    </a>
  )
}

const ConnectGithub: React.FunctionComponent<{
  isConnectedToGithub: boolean
  authToken: string
}> = ({isConnectedToGithub, authToken}) => {
  let [isConnected, setIsConnected] = React.useState(isConnectedToGithub)

  return (
    <ItemWrapper
      title={
        isConnected
          ? 'Your Account is Connected to Github'
          : 'Connect to GitHub'
      }
    >
      {isConnected ? (
        <>
          <p className="opacity-80">
            You are able to login to egghead using your Github account.
          </p>
          <div className="mt-4">
            <GithubDisConnectButton setIsConnected={setIsConnected} />
          </div>
        </>
      ) : (
        <>
          <p className="opacity-80">
            Connect your GitHub account to log in with GitHub Oauth.
          </p>
          <div className="mt-2">
            <GithubConnectButton authToken={authToken} />
          </div>
        </>
      )}
    </ItemWrapper>
  )
}
