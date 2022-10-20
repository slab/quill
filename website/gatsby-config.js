module.exports = {
  siteMetadata: {
    version: '1.3.6',
  },
  plugins: [
    {
      resolve: 'gatsby-plugin-react-svg',
      options: {
        rule: {
          include: /svg/, // See below to configure properly
        },
      },
    },
    {
      resolve: 'gatsby-plugin-mdx',
      options: {
        extensions: [`.md`, `.mdx`],
      },
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: `markdown-pages`,
        path: `${__dirname}/src/markdown-pages`,
      },
    },
    {
      resolve: 'gatsby-transformer-remark',
      options: {
        plugins: [
          {
            resolve: 'gatsby-remark-embed-markdown',
            options: {
              directory: `${__dirname}/src/markdown-pages`,
            },
          },
        ],
      },
    },
  ],
};
