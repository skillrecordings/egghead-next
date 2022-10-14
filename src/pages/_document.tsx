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

                      var _cio = _cio || [];
                      try {
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
                      } catch(e) { console.error('customer.io error', e); }
                      
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
