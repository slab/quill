# Development

Quill's source is in [ES6](http://www.ecma-international.org/ecma-262/6.0/index.html) and utilizes [Webpack](https://webpack.github.io/) to organize its files. The documentation site (hosted at [quilljs.com](https://quilljs.com/)) is built with [Jekyll](http://jekyllrb.com/). [Karma](https://karma-runner.github.io/) and [Protractor](https://angular.github.io/protractor/) are used for testing.

To develop Quill locally, you will want a copy of Quill's codebase, with the build pipeline and documentation site running locally. The documentation site lives in `doc/` but will use your local build instead of the CDN that the public site uses. This allows you to test changes on a local copy of all of the quilljs.com demos, such as the [standalone examples](https://github.com/quilljs/quill/docs/docs/standalone).


### Setup

The local development environment requires both Node.js and Ruby, along with their respective package managers. RVM and NVM are good solutions for installing and keeping Node.js and Ruby up to date. Mac users may need to also `xcode-select --install` to build nokogiri.

After installing Node.js, npm, Ruby, and bundler:

    npm install
    bundle install
    npm run build

You can now try out the unit test suite by running:

    npm run test:unit

Karma also provides a local server so you can just visit a url from any browser to run the test suite, instead of launching one from the command line. Webpack also provides a server to dynamically build and serve the latest copy of the source code. Jekyll does the same for the documentation site.

With three independent servers, it is useful to have a proxy to as a front end single point of access to jekyll, karma and webpack. The documentation site is normally set up to fetch Quill from Quill's CDN, but the local proxy will serve a local build from webpack dev server instead.

All four services can be run with a single command thanks to [foreman](http://ddollar.github.io/foreman/):

    npm start


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
3. [localhost:9000/karma/debug.html](http://localhost:9000/karma/debug.html) - to run unit tests
4. If everything is working, run the webdriver tests.
