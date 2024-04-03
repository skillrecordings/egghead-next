import * as React from 'react'
import {
  Body,
  Head,
  Html,
  Link,
  Preview,
  Row,
  Section,
} from '@react-email/components'
import {Markdown} from '@react-email/markdown'

export type BasicEmailProps = {
  body: string
  preview?: string
  messageType?: 'transactional' | 'broadcast'
  unsubscribeLinkUrl?: string
}

export const BasicEmail = ({
  body = `Hi there,\n\nJust checking in.\n\nHappy learning,\negghead`,
  preview = ``,
  messageType = 'broadcast',
  unsubscribeLinkUrl = '{{{ pm:unsubscribe }}}',
}: BasicEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>{preview}</Preview>
      <Body style={main}>
        <Section style={content}>
          <Markdown>{body}</Markdown>
        </Section>
        <Section style={footer}>
          {messageType === 'broadcast' ? (
            <>
              <Row>
                <Link href={unsubscribeLinkUrl}>unsubscribe</Link>
              </Row>
              <Row>
                12333 Sowden Rd, Ste. B, PMB #97429 Houston, TX 77080-2059
              </Row>
            </>
          ) : null}
        </Section>
      </Body>
    </Html>
  )
}

export default BasicEmail

const fontFamily = 'HelveticaNeue,Helvetica,Arial,sans-serif'

const main = {
  fontFamily,
}

const footer = {
  padding: '70px 8px',
  lineHeight: 1.5,
  fontSize: 12,
}

const content = {
  padding: '0 8px',
}
