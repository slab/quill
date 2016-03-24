## Bug Reports

Search through [Github Issues](https://github.com/quilljs/quill/issues) to see if the bug has already been reported. If so, please comment with any additional information about the bug.

For new issues, create a new issue and tag with the appropriate browser tag. Include as much detail as possible such as:

- Detailed description of faulty behavior
- Affected platforms
- Steps for reproduction
- Failing test case

The more details you provide, the more likely we or someone else will be able to find and fix the bug.


## Feature Requests

We welcome feature requests. Please make sure they are within scope of Quill's goals and submit them in [Github Issues](https://github.com/quilljs/quill/issues) tagged with the 'feature' tag. The more complete and compelling the request, the more likely it will be implemented. Garnering community support will help as well!


## Pull Requests

1. Please check to make sure your plans fall within Quill's scope (likely through Github Issues).
2. Fork Quill
3. Branch off of the 'develop' branch.
4. Implement your changes.
5. Submit a Pull Request.

Pull requests will not be accepted without adhering to the following:

1. Conform to existing coding styles.
2. New functionality are accompanied by tests.
3. Serve a single atomic purpose (add one feature or fix one bug)
4. Introduce only changes that further the PR's singular purpose (ex. do not tweak an unrelated config along with adding your feature).
5. Must not break any existing unit or end to end tests.

**Important:** By issuing a Pull Request you agree to allow the project owners to license your work under the terms of the [License](https://github.com/quilljs/quill/blob/master/LICENSE).


## Local Development

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

A standard workflow involves:

1. `npm start` - to run development services
2. [localhost:9000/standalone/snow](http://localhost:9000/standalone/snow/) - to interactively develop and test an isolated example
3. [localhost:9000/karma/debug.html](http://localhost:9000/karma/debug.html) - to run unit tests
