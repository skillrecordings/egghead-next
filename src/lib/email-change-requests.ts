import axios from 'axios'
import {AUTH_DOMAIN} from '@/utils/auth'

export type EmailChangeRequestData = {
  new_email: string
  current_email: string
}

export type ConsumeEmailChangeRequestResponse = {
  success: boolean
  new_email?: string
  message?: string
}

function buildAuthHeaders(eggheadToken?: string) {
  return eggheadToken
    ? {
        Authorization: `Bearer ${eggheadToken}`,
      }
    : undefined
}

export async function getEmailChangeRequest(
  token: string,
  eggheadToken?: string,
) {
  const {data} = await axios.get<EmailChangeRequestData>(
    `${AUTH_DOMAIN}/api/v1/email_change_requests/${token}`,
    {
      headers: buildAuthHeaders(eggheadToken),
    },
  )

  return data
}

export async function consumeEmailChangeRequest(
  token: string,
  eggheadToken?: string,
) {
  const {data} = await axios.patch<ConsumeEmailChangeRequestResponse>(
    `${AUTH_DOMAIN}/api/v1/email_change_requests/${token}`,
    {},
    {
      headers: buildAuthHeaders(eggheadToken),
    },
  )

  return data
}
