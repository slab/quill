module.exports = {
  siteMetadata: {
    version: '1.3.6',
    cdn: '//cdn.quilljs.com/',
    github: 'https://github.com/quilljs/quill/tree/develop/docs',
    quill: 'quill.min.js',
    highlightjs: '//cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0',
    katex: '//cdnjs.cloudflare.com/ajax/libs/KaTeX/0.7.1',
    url: 'https://quilljs.com',
  },
  graphqlTypegen: true,
  plugins: [
    {
      resolve: 'gatsby-plugin-react-svg',
      options: {
        rule: {
          include: /svg/, // See below to configure properly
        },
      },
    },
    'gatsby-plugin-mdx',
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'pages',
        path: './src/pages/',
      },
      __key: 'pages',
    },
  ],
  // plugins: [
  //   {
  //     resolve: 'gatsby-plugin-mdx',
  //   },
  //   // {
  //   //   resolve: 'gatsby-source-filesystem',
  //   //   options: {
  //   //     name: `markdown-pages`,
  //   //     path: `${__dirname}/src/markdown-pages`,
  //   //   },
  //   // },
  //   // {
  //   //   resolve: 'gatsby-transformer-remark',
  //   //   options: {
  //   //     plugins: [
  //   //       {
  //   //         resolve: 'gatsby-remark-embed-markdown',
  //   //         options: {
  //   //           directory: `${__dirname}/src/markdown-pages`,
  //   //         },
  //   //       },
  //   //     ],
  //   //   },
  //   // },
  // ],
};
