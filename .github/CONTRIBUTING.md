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

You will want a local copy of both Quill and its documentation site, which contains useful [standalone examples](https://github.com/quilljs/quilljs.github.io/tree/gh-pages-1/docs/standalone) to test changes in isolation. It may be useful to `npm link` [quill-docs](https://github.com/quilljs/quilljs.github.io).

Quill's source is in [ES6](http://www.ecma-international.org/ecma-262/6.0/index.html) and utilizes [Webpack](https://webpack.github.io/) to organize its files. The documentation site is built with [Jekyll](http://jekyllrb.com/). Thus, both Node.js and Ruby along with their respective package managers are dependencies for local development. To install other dependencies:

A proxy is also provided for a single point of access to jekyll, karma, and webpack. Requests normally destined to Quill's CDN will then be routed to webpack. All four services can be run with a single command thanks to [foreman](http://ddollar.github.io/foreman/):

    npm start

### Setup

    npm install
    gem install foreman jekyll kramdown rouge jekyll-sitemap jekyll-redirect-from jekyll-feed
    npm run build

Note: While built files in dist/ are not normally used/served for development, karma still requires their existence.

### Workflow

A standard workflow involves:

- `npm start` - to run development services
- [localhost:9000/standalone/snow](http://localhost:9000/standalone/snow/) - to interactively develop and test
- [localhost:9000/karma/debug.html](http://localhost:9000/karma/debug.html) - to unit test
