# Contributing

The best way to contribute is to help others in the Quill community. This includes:

- Reporting new [bugs](https://github.com/quilljs/quill/labels/bug) or adding details to existing ones
- Reproducing [unconfirmed bugs](https://github.com/quilljs/quill/labels/needs%20reproduction)
- Quick typo fix or documentation improvement [Pull Requests](#pull-requests)
- Participating in [discussions](https://github.com/quilljs/quill/labels/discussion)
- Answering questions on [StackOverflow](http://stackoverflow.com/questions/tagged/quill)

After becoming familiar with Quill and the codebase, likely through using Quill yourself and making some of the above contributions, you may choose to take on a bigger commitment by:

- Helping fix [bugs](https://github.com/quilljs/quill/labels/bug)
- Implementing new [features](https://github.com/quilljs/quill/labels/feature)
- Publishing guides, tutorials, and examples
- Supporting Quill in other ecosystems (Angular, React, etc)

## Questions

If you have a question, it is best to ask on StackOverflow and tag with [quill](http://stackoverflow.com/questions/tagged/quill). This tag is monitored by Quill maintainers and community members.

## Bug Reports

Search through [Github Issues](https://github.com/quilljs/quill/issues) to see if the bug has already been reported. If so, please comment with any additional information.

New bug reports must include:

1. Detailed description of faulty behavior
2. Steps for reproduction or failing test case
3. Expected and actual behaviors
4. Platforms (OS **and** browser combination) affected
5. Version of Quill

Lacking reports it may be autoclosed with a link to these instructions.

## Feature Requests

Search through [Github Issues](https://github.com/quilljs/quill/labels/feature) to see if someone has already suggested the feature. If so, please provide support with a [reaction](https://github.com/blog/2119-add-reactions-to-pull-requests-issues-and-comments) and add your own use case.

To open a new feature request, please include:

1. A detailed description of the feature
2. Why this feature belongs in Quill core, instead of your own application logic
3. Background of where and how you are using Quill
4. The use case that would be enabled or improved for your product, if the feature was implemented

Features are prioritized based on real world users and use cases, not theoretically useful additions for other unknown users. Lacking feature requests may be autoclosed with a link to this section.

The more complete and compelling the request, the more likely it will ultimately be implemented. Garnering community support will help as well!

## Pull Requests

Please check to make sure your plans fall within Quill's scope. This often means opening up a [discussion](https://github.com/quilljs/quill/labels/discussion).

Non-code Pull Requests such as typo fixes or documentation improvements are highly encouraged and are often accepted immediately.

Pull Requests modifying public facing interfaces or APIs, including backwards compatible additions, will undergo the most scrutiny, and will almost certainly require a proper discussion of the motivation and merits beforehand. Simply increasing code complexity is a cost not to be taken lightly.

Pull requests must:

1. Be forked off the [main](https://github.com/quilljs/quill/tree/main) branch.
2. Pass the linter and conform to existing coding styles.
3. Commits are [squashed](https://git-scm.com/book/en/v2/Git-Tools-Rewriting-History#Squashing-Commits) to minimally coherent units of changes.
4. Are accompanied by tests covering the new feature or demonstrating the bug for fixes.
5. Serve a single atomic purpose (add one feature or fix one bug).
6. Introduce only changes that further the PR's singular purpose (ex. do not tweak an unrelated config along with adding your feature).
7. Not break any existing unit or end to end tests.

**Important:** By issuing a Pull Request you agree to allow the project owners to license your work under the terms of the [License](https://github.com/quilljs/quill/blob/master/LICENSE).
