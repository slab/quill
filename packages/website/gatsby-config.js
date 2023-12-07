const { version, homepage } = require("./package.json");

// https://cdn.jsdelivr.net/npm/quill@1.0.0/umd/quill.js
const siteMetadata = {
  version,
  cdn: process.env.USE_LOCAL_FILE
    ? "/"
    : `//cdn.jsdelivr.net/npm/quill@${version}/umd/`,
  github:
    "https://github.com/quilljs/quill/tree/develop/packages/website/content",
  quill: process.env.USE_LOCAL_FILE ? "quill.js" : "quill.js",
  highlightjs: "//cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0",
  katex: "//cdnjs.cloudflare.com/ajax/libs/KaTeX/0.7.1",
  url: pkg.homepage,
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
              return allMdx.nodes.map((node) => {
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
            output: "/feed.xml",
            title: siteMetadata.title,
            match: "^/blog/",
          },
        ],
      },
    },
  ],
};

if (process.env.USE_LOCAL_FILE) {
  config.developMiddleware = (app) => {
    const httpProxy = require("http-proxy");
    const proxy = httpProxy.createProxyServer({});

    if (!process.env.npm_package_config_ports_webpack) {
      throw new Error(
        "config.ports.webpack should be provided when USE_LOCAL_FILE is enabled."
      );
    }

    app.use((req, res, next) => {
      if (/\/\d+\.\d+\.\d+/.test(req.url)) {
        const target = `http://localhost:${
          process.env.npm_package_config_ports_webpack
        }/${req.url.split("/").pop()}`;
        proxy.web(req, res, {
          ignorePath: true,
          target,
        });
      } else {
        next();
      }
    });
  };
}

module.exports = config;
