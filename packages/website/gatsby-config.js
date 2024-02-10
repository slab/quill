const { version, homepage } = require("./package.json");

const cdn = process.env.USE_LOCAL_FILE
  ? `http://localhost:${process.env.npm_package_config_ports_webpack}`
  : `https://cdn.jsdelivr.net/npm/quill@${version}/dist`;

const siteMetadata = {
  version,
  cdn,
  github:
    "https://github.com/quilljs/quill/tree/develop/packages/website/content",
  highlightjs: "//cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0",
  katex: "//cdnjs.cloudflare.com/ajax/libs/KaTeX/0.7.1",
  url: homepage,
  title: "Quill - Your powerful rich text editor",
  shortTitle: "Quill Rich Text Editor",
  description:
    "Quill is a free, open source WYSIWYG editor built for the modern web. Completely customize it for any need with its modular architecture and expressive API.",
  shortDescription:
    "Quill is a free, open source rich text editor built for the modern web.",
};

const config = {
  siteMetadata,
  graphqlTypegen: true,
  plugins: [
    {
      resolve: "gatsby-plugin-google-analytics",
      options: {
        trackingId: "UA-19077541-2",
        head: true,
      },
    },
    "gatsby-plugin-sass",
    {
      resolve: "gatsby-plugin-react-svg",
      options: {
        rule: {
          include: /svg/,
        },
      },
    },
    {
      resolve: "gatsby-source-filesystem",
      options: { name: "content", path: `${__dirname}/content` },
    },
    {
      resolve: "gatsby-plugin-mdx",
      options: {
        gatsbyRemarkPlugins: [
          {
            resolve: "gatsby-remark-find-replace",
            options: {
              replacements: Object.keys(siteMetadata).reduce((acc, key) => {
                acc[`{{site.${key}}}`] = siteMetadata[key];
                return acc;
              }, {}),
              prefix: false,
            },
          },
        ],
      },
    },
  ],
};

module.exports = config;
