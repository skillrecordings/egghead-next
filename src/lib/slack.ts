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
    webClient = new WebClient(process.env.SLACK_API_TOKEN),
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
