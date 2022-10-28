import { graphql } from 'gatsby';
import * as styles from './index.module.scss';
import SEO from '../../components/SEO';
import Default from '../../components/Default';

const Blog = ({ data }) => (
  <Default>
    <div id="blog-container" className="container">
      <div className="post-list">
        {data.allMdx.nodes.map(node => (
          <div className="post-item">
            <h1>
              <a href={node.fields.permalink} title={node.frontmatter.title}>
                {node.frontmatter.title}
              </a>
            </h1>
            <div className="post-meta">
              <time dateTime={node.frontmatter.date}>
                {node.frontmatter.date}
              </time>
              <span>
                {' - '}
                <a href="https://twitter.com/jhchen" title="Jason Chen">
                  {'Jason Chen'}
                </a>
              </span>
            </div>
            <div
              className={styles.excerpt}
              dangerouslySetInnerHTML={{ __html: node.fields.excerpt }}
            />
            <a
              className="more-link"
              title="Read more"
              href={node.frontmatter.permalink}
            >
              Read more
            </a>
            <hr />
          </div>
        ))}
      </div>
    </div>
  </Default>
);

export const query = graphql`
  query {
    allMdx(
      sort: { fields: frontmatter___date, order: DESC }
      filter: { fields: { pageType: { eq: "blog" } } }
    ) {
      nodes {
        fields {
          slug
          permalink
          excerpt
        }
        frontmatter {
          date(formatString: "DD MMM yyyy")
          title
        }
        id
        body
        excerpt
      }
    }
  }
`;

export const Head = () => (
  <>
    <SEO title="Blog" />
    <link rel="stylesheet" href="/assets/css/base.css" />
    <link rel="stylesheet" href="/assets/css/styles.css" />
  </>
);

export default Blog;
