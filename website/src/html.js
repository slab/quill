import React from 'react';
import PropTypes from 'prop-types';
import { Script } from 'gatsby';
import useSite from './utils/useSite';

export default function HTML(props) {
  const site = useSite();
  console.log('====', site, props);

  return (
    <html {...props.htmlAttributes}>
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="x-ua-compatible" content="ie=edge" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
        {props.headComponents}
        <script src={`${site.katex}/katex.min.js`} />
        <script src={`${site.highlightjs}/highlight.min.js`} />
        <script src={`${site.cdn}${site.version}/${site.quill}`} />
        <link
          type="text/css"
          rel="stylesheet"
          href={`${site.katex}/katex.min.css`}
        />
        <link
          type="text/css"
          rel="stylesheet"
          href={`${site.highlightjs}/styles/monokai-sublime.min.css`}
        />
        <link
          type="text/css"
          rel="stylesheet"
          href={`${site.cdn}${site.version}/quill.snow.css`}
        />
        <link
          type="text/css"
          rel="stylesheet"
          href={`${site.cdn}${site.version}/quill.bubble.css`}
        />
        <link
          type="text/css"
          rel="stylesheet"
          href={`${site.highlightjs}/styles/monokai-sublime.min.css`}
        />
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
