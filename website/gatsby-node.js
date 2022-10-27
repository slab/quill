const path = require(`path`);
const { siteMetadata } = require('./gatsby-config');

// https://github.com/gatsbyjs/gatsby/issues/28657
exports.onCreateBabelConfig = ({ actions }) => {
  actions.setBabelPreset({
    name: 'babel-preset-gatsby',
    options: {
      reactRuntime: 'automatic',
    },
  });
};

exports.onCreateNode = ({ node, actions }) => {
  const { createNodeField } = actions;
  if (node.internal.type === `Mdx`) {
    const filePath = node.internal.contentFilePath;
    let pageType = 'unknown';
    if (filePath.startsWith(path.resolve('markdown/guides'))) {
      pageType = 'guide';
    } else if (filePath.startsWith(path.resolve('markdown/docs'))) {
      pageType = 'doc';
    } else if (filePath.startsWith(path.resolve('markdown/blog'))) {
      pageType = 'blog';
    } else if (filePath.startsWith(path.resolve('markdown/standalone'))) {
      pageType = 'standalone';
    }

    const relativePath = path.relative(path.resolve('markdown'), filePath);
    const extension = path.extname(filePath);
    const slug = relativePath.replace(extension, '');
    createNodeField({
      node,
      name: `pageType`,
      value: pageType,
    });
    createNodeField({
      node,
      name: `slug`,
      value: slug,
    });
    createNodeField({
      node,
      name: `permalink`,
      value:
        node.frontmatter.external || `${siteMetadata.url}/${pageType}/${slug}`,
    });
  }
};

exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions;

  const docTemplate = path.resolve(`src/templates/doc.jsx`);
  const templates = {
    blog: path.resolve(`src/templates/post.jsx`),
    standalone: path.resolve(`src/templates/standalone.jsx`),
    guide: docTemplate,
    doc: docTemplate,
  };
  return graphql(
    `
      query loadPagesQuery($limit: Int!) {
        allMdx(limit: $limit) {
          edges {
            node {
              id
              fields {
                pageType
                slug
              }
              frontmatter {
                title
                external
              }
              internal {
                contentFilePath
              }
            }
          }
        }
      }
    `,
    { limit: 1000 },
  ).then(result => {
    if (result.errors) {
      throw result.errors;
    }

    // Create blog post pages.
    result.data.allMdx.edges.forEach(({ node }) => {
      const filePath = node.internal.contentFilePath;
      const { pageType, slug } = node.fields;

      const template = templates[pageType];
      if (template && !node.frontmatter.external) {
        createPage({
          path: `${slug}`,
          component: `${template}?__contentFilePath=${filePath}`,
          context: { id: node.id },
        });
      }
    });
  });
};
