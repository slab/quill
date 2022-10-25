const siteMetadata = {
  version: '1.3.6',
  cdn: process.env.USE_LOCAL_FILE ? '/' : '//cdn.quilljs.com/',
  github: 'https://github.com/quilljs/quill/tree/develop/docs',
  quill: process.env.USE_LOCAL_FILE ? 'quill.js' : 'quill.min.js',
  highlightjs: '//cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0',
  katex: '//cdnjs.cloudflare.com/ajax/libs/KaTeX/0.7.1',
  url: 'https://quilljs.com',
};

const config = {
  siteMetadata,
  graphqlTypegen: true,
  plugins: [
    'gatsby-plugin-sass',
    {
      resolve: 'gatsby-plugin-react-svg',
      options: {
        rule: {
          include: /svg/,
        },
      },
    },
    {
      resolve: 'gatsby-plugin-mdx',
      options: {
        gatsbyRemarkPlugins: [
          {
            resolve: 'gatsby-remark-find-replace',
            options: {
              replacements: Object.keys(siteMetadata).reduce(
                (acc: Record<string, string>, key) => {
                  acc[`{{site.${key}}}`] =
                    siteMetadata[key as keyof typeof siteMetadata];
                  return acc;
                },
                {},
              ),
              prefix: false,
            },
          },
        ],
      },
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'pages',
        path: './src/pages/',
      },
      __key: 'pages',
    },
  ],
};

export default config;
