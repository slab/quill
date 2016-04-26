#0.20.1

Patch release for everything prior to Parchment's integration into Quill.

### Features

- API for hotkey removal #110, #453

### Bug Fixes

- Editor jumps to top when clicking formatting buttons #288
- Editor does not preserve bold text when pasted from itself #306
- Focus issues when scrolled down in IE10+ #415
- Error if keyboard shortcut used for unavailable format #432
- Scrolls to cursor if not visible after enter/deletion/paste #433

Thanks to @devtimi, @emannes, @ivan-i, @magus, @Nick-The-Uncharted, @rlivsey, @thomsbg, @wallylawless for their bug reports and pull requests.


#0.20.0

### Breaking Changes
- `getBounds` now returns `null` instead of throwing an error #412

### Features
- Allow `Document` module to be `Quill.require`'d #400
- Paste manager can optionally accept a custom conversion function #401
- Undo manager can optionally only affect user initiated changes #413

### Bug Fixes
- Retain formats between lines #403
- Fix bug that allows nested format tags #406
- Flatten nested list instead of truncating on paste #421
- Fix handling Chrome's usage of font-weight instead of tags #423
- Fix bug that allows nested parent tags #426

Thank you @thomsbg, @yyjhao, @willrowe, @hryanjones, @nickretallack for your contributions to this release!
