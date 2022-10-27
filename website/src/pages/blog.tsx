import { graphql, PageProps } from 'gatsby';
import BlogLayout from '../components/Blog';
import { fromMarkdown } from 'mdast-util-from-markdown';
import { toHast } from 'mdast-util-to-hast';
import { toHtml } from 'hast-util-to-html';
import * as styles from './blog.module.scss';

const Blog = ({ data }: PageProps<Queries.BlogQuery>) => (
  <BlogLayout>
    <div className="post-item">
      <h1>
        <a
          href="https://medium.com/@jhchen/the-state-of-quill-and-2-0-fb38db7a59b9"
          title="The State of Quill and 2.0"
        >
          {'The State of Quill and 2.0'}
        </a>
      </h1>
      <div className="post-meta">
        <time dateTime="2017-09-21">21 Sep 2017</time>
        <span>
          {' - '}
          <a href="https://twitter.com/jhchen" title="Jason Chen">
            {'Jason Chen'}
          </a>
        </span>
      </div>
      <p>
        The 2.0 branch of Quill has officially been opened and development
        commenced. One design principle Quill embraces is to first make it
        possible, then make it easy. This allows the technical challenges to be
        proved out and provides clarity around use cases so that the right
        audience is designed for. Quill 1.0 pushed the boundaries on the former,
        and now 2.0 will focus on the latter.
      </p>
      <p>Let’s take a look at how we got here and where Quill is going!</p>
      <a
        className="more-link"
        title="Read more"
        href="https://medium.com/@jhchen/the-state-of-quill-and-2-0-fb38db7a59b9"
      >
        Read more
      </a>
      <hr />
    </div>
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
            <a
              href={`/blog/${node.frontmatter?.slug}/`}
              title={node.frontmatter?.title || ''}
            >
              {node.frontmatter?.title}
            </a>
          </h1>
          <div className="post-meta">
            <time dateTime={node.frontmatter?.date ?? ''}>
              {node.frontmatter?.date}
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
            href={`/blog/${node.frontmatter?.slug}`}
          >
            Read more
          </a>
          <hr />
        </div>
      );
    })}
  </BlogLayout>
);

export const query = graphql`
  query Blog {
    allMdx(
      sort: { fields: frontmatter___date, order: DESC }
      filter: { frontmatter: { layout: { eq: "post" } } }
    ) {
      nodes {
        frontmatter {
          date(formatString: "DD MMM yyyy")
          title
          layout
          slug
        }
        id
        body
        excerpt
      }
    }
  }
`;

export const Head = () => <title>My Blog Posts</title>;

export default Blog;
