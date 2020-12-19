import * as React from 'react'
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
          {/* <script async src="/ahoy.js" /> */}
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
                      
                      gtag('config', 'UA-36512724-7');

                      var _cio = _cio || [];
                      (function() {
                        var a,b,c;a=function(f){return function(){_cio.push([f].
                        concat(Array.prototype.slice.call(arguments,0)))}};b=["load","identify",
                        "sidentify","track","page"];for(c=0;c<b.length;c++){_cio[b[c]]=a(b[c])};
                        var t = document.createElement('script'),
                            s = document.getElementsByTagName('script')[0];
                        t.async = true;
                        t.id    = 'cio-tracker';
                        t.setAttribute('data-site-id', '${process.env.NEXT_PUBLIC_CUSTOMER_IO_SITE_ID}');
                        t.src = 'https://assets.customer.io/assets/track.js';
                        s.parentNode.insertBefore(t, s);
                      })();
                        `,
            }}
          ></script>
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
