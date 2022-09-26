import * as React from 'react'

import {ItemWrapper} from 'components/pages/user/components/widget-wrapper'

import {useViewer} from 'context/viewer-context'
import {
  AvatarForm,
  RequestEmailChangeForm,
  RequestNameChangeForm,
} from '../components'

const AccountInfoTabContent: React.FC<any> = () => {
  const {viewer, loading} = useViewer()
  const {email: currentEmail, accounts, providers} = viewer || {}
  return (
    <div className="space-y-10">
      <ItemWrapper title="Email address">
        <RequestEmailChangeForm originalEmail={currentEmail} />
      </ItemWrapper>
      <ItemWrapper title="Preferred Name">
        <RequestNameChangeForm originalEmail={currentEmail} />
      </ItemWrapper>
      <ItemWrapper title="Avatar">
        <AvatarForm avatarUrl={viewer.avatar_url} />
      </ItemWrapper>
    </div>
  )
}

export default AccountInfoTabContent
