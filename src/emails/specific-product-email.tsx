import * as React from 'react'
import {
  Body,
  Head,
  Html,
  Link,
  Preview,
  Row,
  Section,
  Text,
  Column,
  Img,
} from '@react-email/components'
import {Markdown} from '@react-email/markdown'

export type SpecificProductEmailProps = {
  customerName?: string
  customerEmail: string
  productId: string
  productName: string
  purchaseDate: string
  stripeChargeIdentifier: string
  body?: string
  preview?: string
  messageType?: 'transactional' | 'broadcast'
  unsubscribeLinkUrl?: string
}

export const SpecificProductEmail = ({
  customerName,
  customerEmail,
  productId,
  purchaseDate,
  productName,
  stripeChargeIdentifier,
  body = `Thank you for your purchase of our product!`,
  preview = `Thank you for your purchase`,
  messageType = 'transactional',
  unsubscribeLinkUrl = '{{{ pm:unsubscribe }}}',
}: SpecificProductEmailProps) => {
  const greeting = customerName ? `Hi ${customerName},` : 'Hi there,'

  const productCategory = productName.toLowerCase().includes('claude')
    ? 'claude-code'
    : 'cursor'

  const invoiceUrl = `${process.env.NEXT_PUBLIC_URL}/workshop/${productCategory}/invoice/${stripeChargeIdentifier}`

  return (
    <Html>
      <Head />
      <Preview>{preview}</Preview>
      <Body style={main}>
        <Section style={content}>
          <Row>
            <Column>
              <Text style={paragraph}>{greeting}</Text>
              <Text style={paragraph}>
                Thank you for your purchase of {productName}!
              </Text>
              <Markdown>{body}</Markdown>
              <Text style={paragraph}>
                If you have any questions or need assistance, please don't
                hesitate to contact our support team at{' '}
                <Link href="mailto:support@egghead.io" style={link}>
                  support@egghead.io
                </Link>
              </Text>
              <Text style={paragraph}>
                You can view your purchase details by clicking the link below:
              </Text>
              <Link href={invoiceUrl} style={link}>
                View purchase details
              </Link>
              <Text style={paragraph}>Happy learning!</Text>
              <Text style={paragraph}>The egghead team</Text>
            </Column>
          </Row>
        </Section>
        <Section style={footer}>
          {messageType === 'broadcast' ? (
            <>
              <Row>
                <Link href={unsubscribeLinkUrl} style={footerLink}>
                  unsubscribe
                </Link>
              </Row>
              <Row>
                <Text style={footerText}>
                  12333 Sowden Rd, Ste. B, PMB #97429 Houston, TX 77080-2059
                </Text>
              </Row>
            </>
          ) : null}
        </Section>
      </Body>
    </Html>
  )
}

export default SpecificProductEmail

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

const footer = {
  padding: '32px 24px',
  textAlign: 'center' as const,
}

const footerLink = {
  fontSize: '12px',
  color: '#718096',
}

const footerText = {
  fontSize: '12px',
  color: '#718096',
  lineHeight: '16px',
}
