import * as React from 'react'
import Document, {
  Html,
  Head,
  Main,
  NextScript,
  DocumentContext,
} from 'next/document'

export default class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx)
    return {...initialProps}
  }

  render() {
    return (
      <Html lang="en">
        <Head>
          <link rel="shortcut icon" href="/favicon.ico" />
          <script
            async
            src="https://www.googletagmanager.com/gtag/js?id=UA-36512724-7"
          />
          <script
            dangerouslySetInnerHTML={{
              __html: `
                      window.dataLayer = window.dataLayer || [];
                      function gtag(){dataLayer.push(arguments)}
                      gtag('js', new Date());
                      
                      gtag('config', 'UA-36512724-7', {
                        'link_attribution': true
                      });


                      
                        `,
            }}
          ></script>
        </Head>
        <body className="dark:bg-gray-900 bg-white dark:text-gray-200 text-black">
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
