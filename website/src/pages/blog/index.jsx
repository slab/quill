import { graphql } from 'gatsby';
import { fromMarkdown } from 'mdast-util-from-markdown';
import { toHast } from 'mdast-util-to-hast';
import { toHtml } from 'hast-util-to-html';
import * as styles from './index.module.scss';
import SEO from '../../components/SEO';
import Default from '../../components/Default';

const Blog = ({ data }) => (
  <Default>
    <div id="blog-container" className="container">
      <div className="post-list">
        {data.allMdx.nodes.map(node => {
          let excerpt = node.excerpt;
          if (node.body?.includes('<More />')) {
            const mdast = fromMarkdown(node.body.split('<More />')[0]);
            const hast = toHast(mdast);
            const html = hast && toHtml(hast);
            if (html) excerpt = html;
          }
          return (
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
              {excerpt && (
                <div
                  className={styles.excerpt}
                  dangerouslySetInnerHTML={{ __html: excerpt }}
                />
              )}
              <a
                className="more-link"
                title="Read more"
                href={node.frontmatter.permalink}
              >
                Read more
              </a>
              <hr />
            </div>
          );
        })}
      </div>
    </div>
  </Default>
);

export const query = graphql`
  query Blog {
    allMdx(
      sort: { fields: frontmatter___date, order: DESC }
      filter: { fields: { pageType: { eq: "blog" } } }
    ) {
      nodes {
        fields {
          slug
          permalink
        }
        frontmatter {
          date(formatString: "DD MMM yyyy")
          title
          layout
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
