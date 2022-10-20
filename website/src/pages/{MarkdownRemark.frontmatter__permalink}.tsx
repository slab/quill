import { graphql, HeadFC } from 'gatsby';
import Docs from '../components/Docs';

export default function Template({ data }) {
  const { markdownRemark } = data; // data.markdownRemark holds your post data
  const { frontmatter, html } = markdownRemark;
  return (
    <Docs {...frontmatter}>
      <div className="blog-post">
        <div
          className="blog-post-content"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    </Docs>
  );
}

export const pageQuery = graphql`
  query ($id: String!) {
    markdownRemark(id: { eq: $id }) {
      html
      frontmatter {
        permalink
        title
      }
    }
  }
`;

export const Head: HeadFC = () => <title>Home Page</title>;
