#1.0.0-beta.0

Please see the [Upgrading to 1.0](http://beta.quilljs.com/guides/upgrading-to-1-0/) guide.


#0.20.1

Patch release for everything prior to Parchment's integration into Quill.

### Features

- API for hotkey removal [#110](https://github.com/quilljs/quill/issues/110), [#453](https://github.com/quilljs/quill/pull/453)

### Bug Fixes

- Editor jumps to top when clicking formatting buttons [#288](https://github.com/quilljs/quill/issues/288)
- Editor does not preserve bold text when pasted from itself [#306](https://github.com/quilljs/quill/issues/306)
- Focus issues when scrolled down in IE10+ [#415](https://github.com/quilljs/quill/issues/415)
- Error if keyboard shortcut used for unavailable format [#432](https://github.com/quilljs/quill/issues/432)
- Scrolls to cursor if not visible after enter/deletion/paste [#433](https://github.com/quilljs/quill/issues/433)

Thanks to [@devtimi](https://github.com/devtimi), [@emannes](https://github.com/emannes), [@ivan-i](https://github.com/ivan-i), [@magus](https://github.com/magus), [@Nick-The-Uncharted](https://github.com/Nick-The-Uncharted), [@rlivsey](https://github.com/rlivsey), [@thomsbg](https://github.com/thomsbg), [@wallylawless](https://github.com/wallylawless) for their bug reports and pull requests!


#0.20.0

### Breaking Changes
- `getBounds` now returns `null` instead of throwing an error [#412](https://github.com/quilljs/quill/pull/412)

### Features
- Allow `Document` module to be `Quill.require`'d [#400](https://github.com/quilljs/quill/pull/400)
- Paste manager can optionally accept a custom conversion function [#401](https://github.com/quilljs/quill/pull/401)
- Undo manager can optionally only affect user initiated changes [#413](https://github.com/quilljs/quill/pull/413)

### Bug Fixes
- Retain formats between lines [#403](https://github.com/quilljs/quill/pull/403)
- Fix bug that allows nested format tags [#406](https://github.com/quilljs/quill/pull/406)
- Flatten nested list instead of truncating on paste [#421](https://github.com/quilljs/quill/issues/421)
- Fix handling Chrome's usage of font-weight instead of tags [#423](https://github.com/quilljs/quill/issues/423)
- Fix bug that allows nested parent tags [#426](https://github.com/quilljs/quill/pull/426)

Thank you [@thomsbg](https://github.com/thomsbg), [@yyjhao](https://github.com/yyjhao), [@willrowe](https://github.com/willrowe), [@hryanjones](https://github.com/hryanjones), [@nickretallack](https://github.com/nickretallack) for your contributions to this release!
