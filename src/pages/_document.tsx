import Document, {
  Html,
  Head,
  Main,
  NextScript,
  DocumentContext,
} from 'next/document'
import {extractCritical} from 'emotion-server'

export default class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx)
    const styles = extractCritical(initialProps.html)
    return {
      ...initialProps,
      styles: (
        <>
          {initialProps.styles}
          <style
            data-emotion-css={styles.ids.join(' ')}
            dangerouslySetInnerHTML={{__html: styles.css}}
          />
        </>
      ),
    }
  }

  render() {
    return (
      <Html>
        <Head>
          <link
            rel="icon"
            href="https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/320/apple/237/fisted-hand-sign_1f44a.png"
          />
          <script async src="/ahoy.js" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
