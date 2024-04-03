import {
  ChatPostMessageResponse,
  MessageAttachment,
  WebClient,
} from '@slack/web-api'

export type PostToSlackOptions = {
  attachments: MessageAttachment[]
  channel: string
  webClient?: WebClient
  username?: string
  text?: string
}

export async function postToSlack(
  options: PostToSlackOptions,
): Promise<ChatPostMessageResponse> {
  const {
    webClient = new WebClient(process.env.SLACK_ADMIN_API_KEY),
    attachments,
    channel,
    text,
    username = 'Announce Bot',
  } = options
  try {
    return await webClient.chat.postMessage({
      username,
      attachments,
      channel,
      text,
    })
  } catch (e) {
    console.log(e)
    return Promise.reject(e)
  }
}

export type PostFeedbackToSlackOptions = {
  attachments: MessageAttachment[]
  webhookUrl: string
  username?: string
  text?: string
}

export async function postFeedbackToSlack(
  options: PostFeedbackToSlackOptions,
): Promise<ChatPostMessageResponse> {
  const {webhookUrl, text, attachments, username = 'Eggo'} = options
  try {
    await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        text,
        attachments,
        username,
      }),
    })
  } catch (e) {
    throw new Error('error occured, feedback not sent')
  }
  return new Response('feedback sent', {
    status: 200,
  })
}
