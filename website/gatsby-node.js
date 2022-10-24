const runtime = require('react/jsx-runtime');
const { compileMDX } = require('gatsby-plugin-mdx');
const { renderToStaticMarkup } = require('react-dom/server');

exports.onCreateBabelConfig = ({ actions }) => {
  actions.setBabelPreset({
    name: 'babel-preset-gatsby',
    options: {
      reactRuntime: 'automatic',
    },
  });
};

exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions;
  const typeDefs = `
    type Mdx implements Node {
      frontmatter: MdxFrontmatter
    }

    type MdxFrontmatter {
      slug: String
      date: Date @dateformat(formatString: "DD-MM-YYYY")
    }
  `;
  createTypes(typeDefs);
};
