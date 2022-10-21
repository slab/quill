import { graphql, useStaticQuery } from 'gatsby';

const useSite = () => {
  const data = useStaticQuery(graphql`
    query {
      site {
        siteMetadata {
          version
          cdn
          github
          quill
          highlightjs
          katex
          url
        }
      }
    }
  `);

  return data?.site?.siteMetadata;
};

export default useSite;
