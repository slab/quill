# Development

This repo is a monorepo powered by npm's official [workspace feature](https://docs.npmjs.com/cli/v10/using-npm/workspaces). It contains the following packages:

### quill

This is the Quill library. It's written in [TypeScript](https://www.typescriptlang.org/), and use [Webpack](https://webpack.js.org/) as the bundler.
It uses [Vitest](https://vitest.dev) for unit testing, and [Playwright](https://playwright.dev/) for E2E testing.

### website

It's Quill's website (hosted at [quilljs.com](https://quilljs.com/)). It's built with [Next.js](https://nextjs.org/).

## Setup

To prepare your local environment for development, ensure you have Node.js installed. The repo uses npm, and doesn't support Yarn and pnpm.

Install the necessary dependencies with the command below:

```shell
npm install
```

Start the development environment using:

```shell
npm start
```

This command starts two services:

- Quill's webpack dev server
- Website's Next.js dev server

These servers dynamically build and serve the latest copy of the source code.

Access the running website at [localhost:9000](http://localhost:9000/). By default, the website will use your local Quill build, that includes all the examples in the website. This convenient setup allows for seamless development and ensures changes to Quill do not disrupt the website's content.

If you need to modify only the website's code, start the website with `npm start -w website``. This makes the website use the latest CDN version.

## Testing

To run the unit tests in watch mode, run:

    npm run test:unit -w quill

To execute the E2E tests, run:

    npm run test:e2e -w quill

## Workflow

A standard development workflow involves:

1. `npm start` - to run development services
2. [localhost:9000/standalone/snow](http://localhost:9000/standalone/snow) - to interactively develop and test an isolated example
3. `npm run test:unit -w quill` - to run unit tests
4. If everything is working, run the E2E tests
