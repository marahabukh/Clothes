import { Html, Head, Main, NextScript } from "next/document"

export default function Document() {
  return (
    <Html lang="ar" dir="">
      <Head />
      <body>
        <Main />
        <NextScript />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // This script helps with iOS standalone mode detection
              (function() {
                if (window.navigator.standalone) {
                  document.documentElement.classList.add('standalone');
                }
              })();
            `,
          }}
        />
      </body>
    </Html>
  )
}

