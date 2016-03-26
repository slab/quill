# Development

Quill's source is in [ES6](http://www.ecma-international.org/ecma-262/6.0/index.html) and utilizes [Webpack](https://webpack.github.io/) to organize its files. The documentation site (hosted at [quilljs.com](https://quilljs.com/)) is built with [Jekyll](http://jekyllrb.com/). [Karma](https://karma-runner.github.io/) and [Protractor](https://angular.github.io/protractor/) are used for testing.

To develop Quill locally, you will want a copy of both Quill's codebase and its documentation site. The latter is included as a proper Node.js dependency, named [quill-docs](https://github.com/quilljs/quilljs.github.io), and contains many useful [standalone examples](https://github.com/quilljs/quilljs.github.io/tree/gh-pages-1/docs/standalone) to test changes in isolation. It may be useful to [`npm link`](https://docs.npmjs.com/cli/link) quill-docs to easily tweak the examples locally to test your changes.


### Setup

The local development environment requires both Node.js and Ruby, along with their respective package managers. RVM and NVM are good solutions for installing and keeping Node.js and Ruby up to date. After installing Node.js, npm, Ruby, and RubyGems:

    npm install
    gem install foreman jekyll kramdown rouge jekyll-sitemap jekyll-redirect-from jekyll-feed
    npm run build

You can now try out the unit test suite by running:

    npm test

Karma also provides a local server so you can just visit a url from any browser to run the test suite, instead of launching one from the command line. Webpack also provides a server to dynamically build and serve the latest copy of the source code. Jekyll does the same for the documentation site.

With three independent servers, it is useful to have a proxy to as a front end single point of access to jekyll, karma and webpack. The documentation site is normally set up to fetch Quill from Quill's CDN, but the proxy will serve a local copy from webpack dev server instead.

All four services can be run with a single command thanks to [foreman](http://ddollar.github.io/foreman/):

    npm start


### Workflow

A standard development workflow involves:

1. `npm start` - to run development services
2. [localhost:9000/standalone/snow](http://localhost:9000/standalone/snow/) - to interactively develop and test an isolated example
3. [localhost:9000/karma/debug.html](http://localhost:9000/karma/debug.html) - to run unit tests
