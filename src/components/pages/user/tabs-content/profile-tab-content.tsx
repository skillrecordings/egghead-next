import * as React from 'react'

import {ItemWrapper} from 'components/pages/user/components/widget-wrapper'
import {useViewer} from 'context/viewer-context'
import {
  AvatarForm,
  RequestEmailChangeForm,
  // RequestNameChangeForm,
} from '../components'

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
      <ItemWrapper
        title={
          isConnectedToGithub
            ? 'Your Account is Connected to Github'
            : 'Connect to GitHub'
        }
      >
        {isConnectedToGithub ? (
          <p>You are able to login to egghead using your Github account!</p>
        ) : (
          <>
            <p>Connect your GitHub account to log in with GitHub Oauth.</p>
            <div className="mt-2">
              <GithubConnectButton authToken={authToken} />
            </div>
          </>
        )}
      </ItemWrapper>
    </div>
  )
}

export default ProfileTabContent

const GithubConnectButton: React.FunctionComponent<{
  authToken: string
}> = ({authToken}) => {
  return (
    <a
      href={`${process.env.NEXT_PUBLIC_AUTH_DOMAIN}/users/github_passthrough?client_id=${process.env.NEXT_PUBLIC_CLIENT_ID}&auth_token=${authToken}`}
      className="inline-block px-4 py-3 text-white bg-blue-600 border-0 rounded focus:outline-none hover:bg-blue-700"
    >
      Connect your GitHub account
    </a>
  )
}
