import { graphql } from 'gatsby';
import Default from '../components/Default';
import SEO from '../components/SEO';

const Post = ({ data, children }) => (
  <Default>
    <div id="blog-container" className="container">
      <div className="post">
        <h1>{data.mdx?.frontmatter?.title}</h1>
        <div className="post-meta">
          <time>{data.mdx.frontmatter.date}</time>
          <span>
            {' - '}
            <a href="https://twitter.com/jhchen" title="Jason Chen">
              Jason Chen
            </a>
          </span>
        </div>
        {children}
      </div>
    </div>
  </Default>
);

export const query = graphql`
  query ($id: String) {
    mdx(id: { eq: $id }) {
      fields {
        permalink
      }
      frontmatter {
        title
        date(formatString: "DD MMM yyyy")
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
    <link rel="stylesheet" href="/assets/css/base.css" />
    <link rel="stylesheet" href="/assets/css/styles.css" />
  </>
);

export default Post;
