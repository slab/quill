import { graphql } from 'gatsby';
import SEO from '../components/SEO';

const Standalone = ({ data, children }) => children;

export const query = graphql`
  query ($id: String) {
    site {
      siteMetadata {
        cdn
        version
      }
    }
    mdx(id: { eq: $id }) {
      fields {
        permalink
      }
      frontmatter {
        title
      }
    }
  }
`;

export const Head = ({ data }) => (
  <>
    <SEO
      title={data.mdx.frontmatter.title}
      permalink={data.mdx.fields.permalink}
    />
    <link
      rel="stylesheet"
      href={`${data.site.siteMetadata.cdn}${data.site.siteMetadata.version}/quill.core.css`}
    />
  </>
);

export default Standalone;
