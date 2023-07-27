# Development

Quill's source is in [ES6](http://www.ecma-international.org/ecma-262/6.0/index.html) and utilizes [Webpack](https://webpack.github.io/) to organize its files. The documentation site (hosted at [quilljs.com](https://quilljs.com/)) is built with [Gatsby](https://www.gatsbyjs.com/). [Vitest](https://vitest.dev/) and [Playwright](https://playwright.dev/) are used for testing.

To develop Quill locally, you will want a copy of Quill's codebase, with the build pipeline and documentation site running locally. The documentation site lives in `doc/` but will use your local build instead of the CDN that the public site uses. This allows you to test changes on a local copy of all of the quilljs.com demos, such as the [standalone examples](https://github.com/quilljs/quill/blob/develop/docs/docs/standalone).

### Setup

The local development environment requires Node.js.

After installing Node.js:

    npm install
    npm run build

You can now try out the unit test suite by running:

    npm run test:unit

Webpack provides a server to dynamically build and serve the latest copy of the source code. Gatsby does the same for the documentation site.

With two independent servers, it is useful to have a proxy to as a front end single point of access to Gatsby and Webpack. The documentation site is normally set up to fetch Quill from Quill's CDN, but the local proxy will serve a local build from webpack dev server instead.

All four services can be run with a single command thanks to [foreman](http://ddollar.github.io/foreman/):

    npm start

Once the terminal settles (with messages indicating success from `jekyll`, `karma`, `proxy`, and `webpack`), you may access the different services as follows:

| Service                      | URL                                                                          |
| :--------------------------- | :--------------------------------------------------------------------------- |
| Jekyll Documentation Site    | [localhost:9000](http://localhost:9000)                                      |
| Standalone Editor (Full)     | [localhost:9000/standalone/full](http://localhost:9000/standalone/full/)     |
| Standalone Editor (Snow)     | [localhost:9000/standalone/snow](http://localhost:9000/standalone/snow/)     |
| Standalone Editor (Bubble)   | [localhost:9000/standalone/bubble](http://localhost:9000/standalone/bubble/) |
| Webpack Locally Hosted Build | [localhost:9080](http://localhost:9080)                                      |

### Testing

While Quill features an extensive javascript test suite, which you can run with:

    npm run test:unit

However some functionality can only be tested with webdriver. To set up or update webdriver run:

    npm run webdriver:update

Once webdriver is installed, you can run the test suite with

    npm run test:functional

### Workflow

A standard development workflow involves:

1. `npm start` - to run development services
2. [localhost:9000/standalone/snow](http://localhost:9000/standalone/snow/) - to interactively develop and test an isolated example
3. `npm run test:unit` - to run unit tests
4. If everything is working, run the webdriver tests.
