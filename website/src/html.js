import React from 'react';
import PropTypes from 'prop-types';
import config from '../gatsby-config';

export default function HTML(props) {
  const site = config.siteMetadata;

  return (
    <html {...props.htmlAttributes}>
      <head>
        <meta charSet="utf-8" />
        <meta name="language" content="english" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />

        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
        <link
          rel="icon"
          type="image/x-icon"
          href="/assets/images/favicon.ico"
        />
        <link
          type="application/atom+xml"
          rel="alternate"
          href={`${site.url}/feed.xml`}
          title={site.title}
        />
        {props.headComponents}
        <script src={`${site.katex}/katex.min.js`} />
        <script src={`${site.highlightjs}/highlight.min.js`} />
        <script src={`${site.cdn}${site.version}/${site.quill}`} />
        <link rel="stylesheet" href={`${site.katex}/katex.min.css`} />
        <link
          rel="stylesheet"
          href={`${site.cdn}${site.version}/quill.snow.css`}
        />
        <link
          rel="stylesheet"
          href={`${site.cdn}${site.version}/quill.bubble.css`}
        />
        <link
          rel="stylesheet"
          href={`${site.highlightjs}/styles/monokai-sublime.min.css`}
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Inconsolata"
        />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/docsearch.js/2/docsearch.min.css"
        />
        <script src="https://cdn.jsdelivr.net/docsearch.js/2/docsearch.min.js" />
      </head>
      <body {...props.bodyAttributes}>
        {props.preBodyComponents}
        <div
          key={`body`}
          id="___gatsby"
          dangerouslySetInnerHTML={{ __html: props.body }}
        />
        {props.postBodyComponents}
      </body>
    </html>
  );
}

HTML.propTypes = {
  htmlAttributes: PropTypes.object,
  headComponents: PropTypes.array,
  bodyAttributes: PropTypes.object,
  preBodyComponents: PropTypes.array,
  body: PropTypes.string,
  postBodyComponents: PropTypes.array,
};
