import * as React from 'react';
import { graphql, useStaticQuery } from 'gatsby';

const SEO = ({ title, permalink }) => {
  const data = useStaticQuery(graphql`
    query {
      site {
        siteMetadata {
          url
          title
          shortTitle
          description
          shortDescription
        }
      }
    }
  `);

  const pageTitle = title
    ? `${title} - ${data.site.siteMetadata.shortTitle}`
    : data.site.siteMetadata.title;

  return (
    <>
      <meta name="twitter:site" content="@quilljs" />
      <meta name="twitter:title" content={pageTitle} />
      <meta
        name="twitter:description"
        content={data.site.siteMetadata.shortDescription}
      />
      <meta
        name="twitter:image"
        content="https://quilljs.com/assets/images/brand-asset.png"
      />
      <meta property="og:type" content="website" />
      <meta
        property="og:url"
        content={
          permalink
            ? data.site.siteMetadata.url + permalink
            : data.site.siteMetadata.url
        }
      />
      <meta
        property="og:image"
        content="https://quilljs.com/assets/images/brand-asset.png"
      />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:site_name" content="Quill" />
      <title>{pageTitle}</title>
      <meta name="description" content={data.site.siteMetadata.description} />
    </>
  );
};

export default SEO;
