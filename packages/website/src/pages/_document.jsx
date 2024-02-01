import { Html, Head, Main, NextScript } from 'next/document';
import Script from 'next/script';
import { getSandpackCssText } from '@codesandbox/sandpack-react';

export default function Document() {
  return (
    <Html>
      <Head>
        <Script
          strategy="beforeInteractive"
          src={`${process.env.katex}/katex.min.js`}
        />
        <Script
          strategy="beforeInteractive"
          src={`${process.env.highlightjs}/highlight.min.js`}
        />
        <Script
          strategy="beforeInteractive"
          src={`${process.env.cdn}/quill.js`}
        />
        <link
          rel="icon"
          type="image/x-icon"
          href="/assets/images/favicon.ico"
        />
        <link rel="stylesheet" href={`${process.env.katex}/katex.min.css`} />
        <link rel="stylesheet" href={`${process.env.cdn}/quill.snow.css`} />
        <link rel="stylesheet" href={`${process.env.cdn}/quill.bubble.css`} />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/@docsearch/css@3"
        />
        <link
          rel="stylesheet"
          href={`${process.env.highlightjs}/styles/atom-one-dark.min.css`}
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Inconsolata&display=optional"
        />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/docsearch.js/2/docsearch.min.css"
        />
        <style
          dangerouslySetInnerHTML={{ __html: getSandpackCssText() }}
          id="sandpack"
          key="sandpack-css"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
