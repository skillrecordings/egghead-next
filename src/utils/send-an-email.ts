import {render} from '@react-email/render'

export async function sendAnEmail<ComponentPropsType = any>({
  Component,
  componentProps,
  Subject,
  To,
  ReplyTo,
  From = `egghead <team@egghead.io>`,
  type = 'transactional',
}: {
  Component: (props: ComponentPropsType) => React.JSX.Element
  componentProps: ComponentPropsType
  Subject: string
  From?: string
  ReplyTo: string
  To: string
  type?: 'transactional' | 'broadcast'
}) {
  const emailHtml = render(Component(componentProps))

  const MessageStream = type === 'broadcast' ? 'broadcast' : 'outbound'

  const options = {
    From,
    To,
    ReplyTo,
    Subject,
    HtmlBody: emailHtml,
    MessageStream,
  }

  return await fetch(`https://api.postmarkapp.com/email`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'X-Postmark-Server-Token': process.env.POSTMARK_API_KEY ?? '',
    },
    body: JSON.stringify(options),
  }).then((res) => res.json())
}
