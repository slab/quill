const path = require(`path`);
const { siteMetadata } = require('./gatsby-config');
const runtime = require('react/jsx-runtime');
const { compileMDX } = require('gatsby-plugin-mdx');
const { renderToStaticMarkup } = require('react-dom/server');

// https://github.com/gatsbyjs/gatsby/issues/28657
exports.onCreateBabelConfig = ({ actions }) => {
  actions.setBabelPreset({
    name: 'babel-preset-gatsby',
    options: {
      reactRuntime: 'automatic',
    },
  });
};

exports.onCreateNode = async ({ node, actions, getNode, reporter, cache }) => {
  const { createNodeField } = actions;
  if (node.internal.type !== `Mdx`) return;

  const filePath = node.internal.contentFilePath;
  let pageType = 'unknown';
  if (filePath.startsWith(path.resolve('content/guides'))) {
    pageType = 'guide';
  } else if (filePath.startsWith(path.resolve('content/docs'))) {
    pageType = 'doc';
  } else if (filePath.startsWith(path.resolve('content/blog'))) {
    pageType = 'blog';
  } else if (filePath.startsWith(path.resolve('content/standalone'))) {
    pageType = 'standalone';
  }

  const relativePath = path.relative(path.resolve('content'), filePath);
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
    value: node.frontmatter.external || `/${slug}/`,
  });

  const fileNode = getNode(node.parent);
  if (fileNode && pageType === 'blog') {
    const result = await compileMDX(
      {
        source: node.body.split('{/* more */}')[0],
        path: node.internal.contentFilePath,
      },
      {
        // These options are requried to allow rendering to string
        outputFormat: `function-body`,
        useDynamicImport: true,
        // Add any custom options or plugins here
      },
      cache,
      reporter,
    );
    if (result && result.processedMDX) {
      const { run } = await import('@mdx-js/mdx');
      const args = {
        ...runtime,
      };
      const { default: Content } = await run(result.processedMDX, args);
      const value = renderToStaticMarkup(Content(args));
      createNodeField({
        node,
        name: `excerpt`,
        value,
      });
    }
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
  ).then((result) => {
    if (result.errors) {
      throw result.errors;
    }

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
