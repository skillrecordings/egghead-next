import * as React from 'react'
import {
  Body,
  Head,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components'

export type LifetimePromoEmailProps = {
  customerName?: string
  cursorWorkshopUrl: string
  claudeCodeWorkshopUrl: string
}

export const LifetimePromoEmail = ({
  customerName,
  cursorWorkshopUrl,
  claudeCodeWorkshopUrl,
}: LifetimePromoEmailProps) => {
  const greeting = customerName ? `Hi ${customerName},` : 'Hi there,'

  return (
    <Html>
      <Head />
      <Preview>Your bonus workshop recordings are ready</Preview>
      <Body style={main}>
        <Section style={content}>
          <Text style={paragraph}>{greeting}</Text>
          <Text style={paragraph}>
            Thank you for becoming a lifetime egghead member! As a bonus, we're
            including access to two exclusive workshop recordings:
          </Text>
          <Text style={paragraph}>
            <Link href={cursorWorkshopUrl} style={link}>
              Cursor Workshop Recording
            </Link>
          </Text>
          <Text style={paragraph}>
            <Link href={claudeCodeWorkshopUrl} style={link}>
              Claude Code Workshop Recording
            </Link>
          </Text>
          <Text style={paragraph}>
            These workshops cover AI-powered development workflows to help you
            code faster and smarter.
          </Text>
          <Text style={paragraph}>happy learning,</Text>
          <Text style={paragraph}>egghead</Text>
        </Section>
      </Body>
    </Html>
  )
}

export default LifetimePromoEmail

const fontFamily = 'HelveticaNeue,Helvetica,Arial,sans-serif'

const main = {
  fontFamily,
  backgroundColor: '#ffffff',
}

const paragraph = {
  fontSize: '16px',
  lineHeight: '26px',
}

const link = {
  color: '#2563eb',
  textDecoration: 'underline',
}

const content = {
  padding: '0 24px',
  maxWidth: '600px',
}
