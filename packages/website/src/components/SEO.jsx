import * as React from 'react';
import Head from 'next/head';

const SEO = ({ title, permalink }) => {
  const pageTitle = title
    ? `${title} - ${process.env.shortTitle}`
    : process.env.title;

  return (
    <Head>
      <meta name="twitter:site" content="@quilljs" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={process.env.shortDescription} />
      <meta
        name="twitter:image"
        content="https://quilljs.com/assets/images/brand-asset.png"
      />
      <meta property="og:type" content="website" />
      <meta
        property="og:url"
        content={permalink ? process.env.url + permalink : process.env.url}
      />
      <meta
        property="og:image"
        content="https://quilljs.com/assets/images/brand-asset.png"
      />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:site_name" content="Quill" />
      <title>{pageTitle}</title>
      <meta name="description" content={process.env.description} />
    </Head>
  );
};

export default SEO;
