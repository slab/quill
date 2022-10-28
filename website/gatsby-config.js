const siteMetadata = {
  version: '1.3.6',
  cdn: process.env.USE_LOCAL_FILE ? '/' : '//cdn.quilljs.com/',
  github: 'https://github.com/quilljs/quill/tree/develop/website/content',
  quill: process.env.USE_LOCAL_FILE ? 'quill.js' : 'quill.min.js',
  highlightjs: '//cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0',
  katex: '//cdnjs.cloudflare.com/ajax/libs/KaTeX/0.7.1',
  url: 'https://quilljs.com',
  title: 'Quill - Your powerful rich text editor',
  shortTitle: 'Quill Rich Text Editor',
  description:
    'Quill is a free, open source WYSIWYG editor built for the modern web. Completely customize it for any need with its modular architecture and expressive API.',
  shortDescription:
    'Quill is a free, open source rich text editor built for the modern web.',
};

module.exports = {
  siteMetadata,
  graphqlTypegen: true,
  plugins: [
    {
      resolve: 'gatsby-plugin-google-analytics',
      options: {
        trackingId: 'UA-19077541-2',
        head: true,
      },
    },
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
      resolve: 'gatsby-source-filesystem',
      options: { name: 'content', path: `${__dirname}/content` },
    },
    {
      resolve: 'gatsby-plugin-mdx',
      options: {
        gatsbyRemarkPlugins: [
          {
            resolve: 'gatsby-remark-find-replace',
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
    {
      resolve: `gatsby-plugin-feed`,
      options: {
        query: `
          {
            site {
              siteMetadata {
                url
              }
            }
          }
        `,
        feeds: [
          {
            serialize: ({ query: { site, allMdx } }) => {
              return allMdx.nodes.map(node => {
                return Object.assign({}, node.frontmatter, {
                  description: node.excerpt,
                  date: node.frontmatter.date,
                  url: site.siteMetadata.url + node.fields.permalink,
                  guid: site.siteMetadata.url + node.fields.permalink,
                });
              });
            },
            query: `
              {
                allMdx(
                  sort: { fields: frontmatter___date, order: DESC }
                  filter: { fields: { pageType: { eq: "blog" } } }
                ) {
                  nodes {
                    frontmatter {
                      date(formatString: "DD MMM yyyy")
                      title
                    }
                    fields {
                      permalink
                    }
                    id
                    body
                    excerpt
                  }
                }
              }
            `,
            output: '/feed.xml',
            title: siteMetadata.title,
            match: '^/blog/',
          },
        ],
      },
    },
  ],
};
