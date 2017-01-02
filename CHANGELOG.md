# 1.1.9

- Flip tooltips when vertically out of bounds [#851](https://github.com/quilljs/quill/issues/851)
- Fix IE11 autolinking and control backspace [#1028](https://github.com/quilljs/quill/issues/1028)
- Only show tooltip when user initiates selection change [#1193](https://github.com/quilljs/quill/issues/1193)
- Fix bug needing to click twice on align [#1220](https://github.com/quilljs/quill/issues/1220)
- Fix cut + pasting videos [#1222](https://github.com/quilljs/quill/issues/1222)

Thanks to [@amitguptagwl](https://github.com/amitguptagwl), [@antonlabunets](https://github.com/antonlabunets), [@benbro](https://github.com/benbro), [@eamodio](https://github.com/eamodio) and [@ygrishajev](https://github.com/ygrishajev) for your contributions to this release.


# 1.1.8

- Support pasting italics from Google Docs [#1185](https://github.com/quilljs/quill/issues/1185)
- Fix setting dropdown picker back to default [#1191](https://github.com/quilljs/quill/issues/1191)
- Fix code-block formatting on empty first line in Firefox [#1195](https://github.com/quilljs/quill/issues/1195)
- Prevent formatting via keyboard shortcuts when not whitelisted [#1197](https://github.com/quilljs/quill/issues/1197)
- Fix select-all copy and overwrite paste in Firefox [#1202](https://github.com/quilljs/quill/issues/1202)

Thank you [@adfaure](https://github.com/adfaure), [@berndschimmer](https://github.com/berndschimmer), [@CoenWarmer](https://github.com/CoenWarmer), [@montlebalm](https://github.com/montlebalm), and [@TraceyYau](https://github.com/TraceyYau) for contributions to this release!


# 1.1.7

- Fix dropdown values reverting to default [#901](https://github.com/quilljs/quill/issues/901)
- Add config to prevent scroll jumping on paste [#1082](https://github.com/quilljs/quill/issues/1082)
- Prevent scrolling on API source calls [#1152](https://github.com/quilljs/quill/issues/1152)
- Fix tsconfig build error [#1165](https://github.com/quilljs/quill/issues/1165)
- Fix delete and formatting interaction in Firefox [#1171](https://github.com/quilljs/quill/issues/1171)
- Fix cursor jump on formatting in middle of text [#1176](https://github.com/quilljs/quill/issues/1176)

Thanks to [@cutteroid](https://github.com/cutteroid), [@houxg](https://github.com/houxg), [@jasongisstl](https://github.com/jasongisstl), [@nikparo](https://github.com/nikparo), [@sbevels](https://github.com/sbevels), and [sferoze](https://github.com/sferoze) for your contributions to this release.


# 1.1.6

### Features

Checklists [#759](https://github.com/quilljs/quill/issues/759) support has been added to the API. UI and relevant interactions are still forthcoming.

### Bug Fixes

- Fix bug that allowed edits in readOnly mode [#1151](https://github.com/quilljs/quill/issues/1151)
- Fix max call stack bug on large paste [#1123](https://github.com/quilljs/quill/issues/1123)

Thank you [@jgmediadesign](https://github.com/jgmediadesign) and [@julienbmobile](https://github.com/julienbmobile) for contributions to this release!


# 1.1.5

- Remove unnecessary type attribute in documentation [#1087](https://github.com/quilljs/quill/pull/1087)
- Fix chrome 52+ input file label open slow [#1090](https://github.com/quilljs/quill/pull/1090)
- Only query the last op's insertion string if it's actually an insert [#1095](https://github.com/quilljs/quill/pull/1095)

Thank you [@jleen](https://github.com/jleen), [@kaelig](https://github.com/kaelig), and [@YouHan26](https://github.com/YouHan26) for your contributions to this release.


# 1.1.3

- Update quill-delta [delta#2](https://github.com/quilljs/delta/issues/2)
- Fix link creation [#1073](https://github.com/quilljs/quill/issues/1073)

Thanks to [@eamodio](https://github.com/eamodio) and [@metsavir](https://github.com/metsavir) for contributions to this release!


# 1.1.2

- Fix setContents on already formatted text [#1065](https://github.com/quilljs/quill/issues/1065)
- Fix regression [#1067](https://github.com/quilljs/quill/issues/1067)
- Improve documentation [#1069](https://github.com/quilljs/quill/pull/1069) [#1070](https://github.com/quilljs/quill/pull/1070)

Thank you [@benbro](https://github.com/benbro), [@derickruiz](https://github.com/derickruiz), [@eamodio](https://github.com/eamodio), [@hallaathrad](https://github.com/hallaathrad), and [@philly385](https://github.com/philly385) for your contributions to this release.


# 1.1.1

### Bug fixes

- TEXT_CHANGE event now use cursor position to inform change location [#746](https://github.com/quilljs/quill/issues/746)
- Fix inconsistent cursor reporting between browsers [#1007](https://github.com/quilljs/quill/issues/1007)
- Fix tooltip overflow in docs [#1060](https://github.com/quilljs/quill/issues/1060)
- Fix naming [#1063](https://github.com/quilljs/quill/pull/1063)
- Fix Medium example [#1064](https://github.com/quilljs/quill/issues/1064)

Thanks to [@artaommahe](https://github.com/artaommahe), [@benbro](https://github.com/benbro), [@fuffalist](https://github.com/fuffalist), [@sachinrekhi](https://github.com/sachinrekhi), [@sergop321](https://github.com/sergop321), and [@tlg](https://github.com/tlg) for contributions to this release!

Special thanks to [@DadaMonad](https://github.com/DadaMonad) for contributions on [fast-diff](https://github.com/jhchen/fast-diff) that enabled the [#746](https://github.com/quilljs/quill/issues/746) fix.


# 1.1.0

### Additions

Quill has always allowed API calls, even when the editor is in readOnly mode. All API calls also took a `source` parameter to indicate the origin of the change. For example, a click handler in the toolbar would call `formatText` with `source` set to `"user"`. When the editor is in readOnly mode, it would make sense for user initiated actions to be ignored. For example the user cannot focus or type into the editor. However because API calls are allowed, the user could still modify the editor contents [#909](https://github.com/quilljs/quill/issues/909). The natural fix is to ignore user initiated actions, even if it came through an API call, when the editor is in readOnly mode.

However, the documentation never stated API calls with `source` set to `"user"` would be ignored sometimes, so this would be a breaking change under semver. Some could argue this is a bug fix and would only warrant a patch version bump, but this seems disingenuous for this particular case. The fact that almost no one took advantage of the `source` beyond default values is irrelevant under the eyes of semver.

So a `strict` configuration option has been added. It is true by default so the above behavior is unchanged, and [#909](https://github.com/quilljs/quill/issues/909) is unfixed. Changing this to `false`, will use new behavior of ignoring user initiated changes on a disabled editor, even if through an API call.

### Fixes

- Fix undo when preformatted text inserted before plain text [#1019](https://github.com/quilljs/quill/issues/1019)
- Add focus indicator on toolbar buttons [#1020](https://github.com/quilljs/quill/issues/1020)
- Do not steal focus on API calls [#1029](https://github.com/quilljs/quill/issues/1029)
- Disable paste when Quill is disabled [#1038](https://github.com/quilljs/quill/issues/1038)
- Fix blank detection [#1043](https://github.com/quilljs/quill/issues/1043)
- Enable yarn [#1041](https://github.com/quilljs/quill/issues/1041)
- Documentation fixes [#1026](https://github.com/quilljs/quill/pull/1026), [#1027](https://github.com/quilljs/quill/pull/1027), [#1032](https://github.com/quilljs/quill/pull/1032)

Thank you [@benbro](https://github.com/benbro), [@cutteroid](https://github.com/cutteroid), [@evansolomon](https://github.com/evansolomon), [@felipeochoa](https://github.com/felipeochoa), [jackmu95](https://github.com/jackmu95), [@joedynamite](https://github.com/joedynamite), [@lance13c](https://github.com/lance13c), [@leebenson](https://github.com/leebenson), [@maartenvanvliet](https://github.com/maartenvanvliet), [@sarbbottam](https://github.com/sarbbottam), [@viljark](https://github.com/viljark), [@w00fz](https://github.com/w00fz) for their contributions to this release.


# 1.0.6

Documentation clarifications and bug fixes.

- Fix attaching toolbar to `<select>` without themes [#997](https://github.com/quilljs/quill/issues/997)
- Link `code` icon to `code-block` [#998](https://github.com/quilljs/quill/issues/998)
- Fix undo stack when at size limit [#1001](https://github.com/quilljs/quill/pull/1001)
- Fix bug where `formatLine` did not ignore inline formats [8a7190](https://github.com/quilljs/parchment/commit/8a71905b2dd02d003edb02a15fdc727b26914e49)

Thanks to [@dropfen](https://github.com/dropfen), [@evansolomon](https://github.com/evansolomon), [@hallaathrad](https://github.com/hallaathrad), [@janyksteenbeek](https://github.com/janyksteenbeek), [@jackmu95](https://github.com/jackmu95), [@marktron](https://github.com/marktron), [@mcat-ee](https://github.com/mcat-ee), [@unhammer](https://github.com/unhammer), and [@zeke](https://github.com/zeke) for contributions to this release!


# 1.0.5

Became 1.0.6 with a build/deploy fix.


# 1.0.4

- Fix bubble theme defaults [#963](https://github.com/quilljs/quill/issues/963)
- Fix browsers modifying inline nesting order [#971](https://github.com/quilljs/quill/issues/971)
- Do not fire selection-change event on paste [#974](https://github.com/quilljs/quill/issues/974)
- Support alt attribute in images [#975](https://github.com/quilljs/quill/issues/975)
- Deprecate `pasteHTML` for removal in Quill 2.0 [#981](https://github.com/quilljs/quill/issues/981)

Thank you [jackmu95](https://github.com/jackmu95), [kristeehan](https://github.com/kristeehan), [ruffle1986](https://github.com/ruffle1986), [sergop321](https://github.com/sergop321), [sferoze](https://github.com/sferoze), and [sijad](https://github.com/sijad) for contributions to this release.


# 1.0.3

- Fix [#928](https://github.com/quilljs/quill/issues/928)

Thank you [@scottmessinger](https://github.com/scottmessinger) for the bug report.


# 1.0.2

- Fix building quill.core.js [docs #11](https://github.com/quilljs/quilljs.github.io/issues/11)
- Fix regression of [#793](https://github.com/quilljs/quill/issues/793)

Thanks to [@eamodio](https://github.com/eamodio) and [@neandrake](https://github.com/neandrake) for their contributions to this release.


# 1.0.0

Quill 1.0 is released! Read the [official announcement](https://quilljs.com/blog/announcing-quill-1-0/).


# 1.0.0-rc.4

Fix one important bug [fdd920](https://github.com/quilljs/quill/commit/fdd920250c05403ed9e5d6d86826a00167ba0b09)


# 1.0.0-rc.3

A few bug fixes, one with with possibly significant implications. See the [issue #889](https://github.com/quilljs/quill/issues/889) and [commit fix](https://github.com/quilljs/quill/commit/be24c62a6234818548658fcb5e1935a0c07b4eb7) for more details.

### Bug Fixes

- Fix indenting beyond first level with toolbar [#882](https://github.com/quilljs/quill/issues/882)
- Fix toolbar font/size display on Safari [#884](https://github.com/quilljs/quill/issues/884)
- Fix pasting from Gmail from on different browser [#886](https://github.com/quilljs/quill/issues/886)
- Fix undo/redo consistency [#889](https://github.com/quilljs/quill/issues/889)
- Fix null error when selecting all on Firefox [#891](https://github.com/quilljs/quill/issues/891)
- Fix merging keyboard options twice [#897](https://github.com/quilljs/quill/issues/897)

Thank you [@benbro](https://github.com/benbro), [@cgilboy](https://github.com/cgilboy), [@cutteroid](https://github.com/cutteroid), and [@routman](https://github.com/routman) for contributions to this release!


# 1.0.0-rc.2

A few bug fixes, including one significant [one](https://github.com/quilljs/quill/issues/883)

### Bug Fixes

- Fix icon picker rendering in MS Edge [#877](https://github.com/quilljs/quill/issues/877)
- Add back minified build to release [#881](https://github.com/quilljs/quill/issues/881)
- Fix optimized change calculation with preformatted text [#883](https://github.com/quilljs/quill/issues/883)

Thanks to [benbro](https://github.com/benbro), [cutteroid](https://github.com/cutteroid), and [CapTec](https://github.com/CapTec) for their contributions to this release.


# 1.0.0-rc.1

A few bug fixes and performance improvements.

### Features

- Source maps now available from CDN for minified build

### Bug Fixes

- Fix scroll interaction between two Quill editors [#855](https://github.com/quilljs/quill/issues/855)
- Fix scroll on paste [#856](https://github.com/quilljs/quill/issues/856)
- Fix native iOS tooltip formatting [#862](https://github.com/quilljs/quill/issues/862)
- Remove comments from pasting from Word [#872](https://github.com/quilljs/quill/issues/872)
- Fix indent at all supported indent levels [#873](https://github.com/quilljs/quill/issues/873)
- Fix indent interaction with text direction [#874](https://github.com/quilljs/quill/issues/874)

Thank you [@benbro](https://github.com/benbro), [@fernandogmar](https://github.com/fernandogmar), [@sachinrekhi](https://github.com/sachinrekhi), [@sferoze](https://github.com/sferoze), and [@stalniy](https://github.com/stalniy) for contributions to this release!


# 1.0.0-rc.0

Take a look at [Quill 1.0 Release Candidate](https://quilljs.com/blog/quill-1-0-release-candidate-released/) for more details.

### Updates

- Going forward the minimal stylesheet build will be named quill.core.css, instead of quill.css

### Bug Fixes

- Fix identifying ordered and bulletd lists [#846](https://github.com/quilljs/quill/issues/846) [#847](https://github.com/quilljs/quill/issues/847)
- Fix bullet interaction with text direction [#848](https://github.com/quilljs/quill/issues/848)

A huge thank you to all contributors to through the beta! Special thanks goes to [@benbro](https://github.com/benbro) and [@sachinrekhi](https://github.com/sachinrekhi) who together submitted submitted almost 50 Issues and Pull Requests!

- [@abejdaniels](https://github.com/abejdaniels)
- [@anovi](https://github.com/anovi)
- [@benbro](https://github.com/benbro)
- [@bram2w](https://github.com/bram2w)
- [@brynjagr](https://github.com/brynjagr)
- [@CapTec](https://github.com/CapTec)
- [@Cinamonas](https://github.com/Cinamonas)
- [@clemmy](https://github.com/clemmy)
- [@crisbeto](https://github.com/crisbeto)
- [@cutteroid](https://github.com/cutteroid)
- [@DadaMonad](https://github.com/DadaMonad)
- [@davelozier](https://github.com/davelozier)
- [@emanuelbsilva](https://github.com/emanuelbsilva)
- [@ersommer](https://github.com/ersommer)
- [@fernandogmar](https://github.com/fernandogmar)
- [@george-norris-salesforce](https://github.com/george-norris-salesforce)
- [@jackmu95](https://github.com/jackmu95)
- [@jasonmng](https://github.com/jasonmng)
- [@jbrowning](https://github.com/jbrowning)
- [@jonnolen](https://github.com/jonnolen)
- [@KameSama](https://github.com/KameSama)
- [@kei-ito](https://github.com/kei-ito)
- [@kylebragger](https://github.com/kylebragger)
- [@LucVanPelt](https://github.com/LucVanPelt)
- [@lukechapman](https://github.com/lukechapman)
- [@micimize](https://github.com/micimize)
- [@mmorearty](https://github.com/mmorearty)
- [@mshamaiev-intel471](https://github.com/mshamaiev-intel471)
- [@quentez](https://github.com/quentez)
- [@sachinrekhi](https://github.com/sachinrekhi)
- [@sagacitysite](https://github.com/sagacitysite)
- [@saw](https://github.com/saw)
- [@stalniy](https://github.com/stalniy)
- [@tOgg1](https://github.com/tOgg1)
- [@u9520107](https://github.com/u9520107)
- [@WriterStat](https://github.com/WriterStat)


# 1.0.0-beta.11

Fixed some regressive bugs from previous release.

### Bug Fixes

- Fix activating more than one format before typing [#841](https://github.com/quilljs/quill/issues/841)
- Run default matchers before before user defined ones [#843](https://github.com/quilljs/quill/issues/843)
- Fix merging theme configurations [#844](https://github.com/quilljs/quill/issues/844), [#845](845)

Thanks [benbro](https://github.com/benbro), [jackmu95](https://github.com/jackmu95), and [george-norris-salesforce](https://github.com/george-norris-salesforce) for the bug reports.


# 1.0.0-beta.10

Lots of bug fixes and performance improvements.

### Breaking Changes

- Keyboard handler format in initial [configuration](beta.quilljs.com/docs/modules/keyboard/) has changed. `addBinding` is overloaded to be backwards compatible.

### Bug Fixes

- Preserve last bullet on paste [#696](https://github.com/quilljs/quill/issues/696)
- Fix getBounds calculation for lists [#765](https://github.com/quilljs/quill/issues/765)
- Escape quotes in font value [#769](https://github.com/quilljs/quill/issues/769)
- Fix spacing calculation on paste [#797](https://github.com/quilljs/quill/issues/797)
- Fix Snow tooltip label [#798](https://github.com/quilljs/quill/issues/798)
- Fix link tooltip showing up on long click [#799](https://github.com/quilljs/quill/issues/799)
- Fix entering code block in IE and Firefox [#803](https://github.com/quilljs/quill/issues/803)
- Fix opening image dialog on Firefox [#805](https://github.com/quilljs/quill/issues/805)
- Fix focus loss on updateContents [#809](https://github.com/quilljs/quill/issues/809)
- Reset toolbar of blur [#810](https://github.com/quilljs/quill/issues/810)
- Fix cursor position calculation on delete [#811](https://github.com/quilljs/quill/issues/811)
- Fix highlighting across different alignment values [#815](https://github.com/quilljs/quill/issues/815)
- Allow default active button [#816](https://github.com/quilljs/quill/issues/816)
- Fix deleting last character of formatted text on Firefox [#824](https://github.com/quilljs/quill/issues/824)
- Fix Youtube regex [#826](https://github.com/quilljs/quill/pull/826)
- Fix missing imports when Quill not global [#836](https://github.com/quilljs/quill/pull/836)

Thanks to [benbro](https://github.com/benbro), [clemmy](https://github.com/clemmy), [crisbeto](https://github.com/crisbeto), [cutteroid](https://github.com/cutteroid), [jackmu95](https://github.com/jackmu95), [kylebragger](https://github.com/kylebragger), [sachinrekhi](https://github.com/sachinrekhi), [stalniy](https://github.com/stalniy), and [tOgg1](https://github.com/tOgg1) for their contributions to this release.


# 1.0.0-beta.9

Potentially the final beta before a release candidate, if no major issues are discovered.

### Breaking Changes

- No longer expose `ui/link-tooltip` through `import` as implementation is now Snow specific
- Significant refactoring of `ui/tooltip`
- Syntax module now autodetects language, instead of defaulting to Javascript

### Features

- Formula and video insertion UI added to Snow and Bubble themes

### Bug Fixes

- Fix toolbar active state after backspacing to previous line [#730](https://github.com/quilljs/quill/issues/730)
- User selection is now preserved various API calls [#731](https://github.com/quilljs/quill/issues/731)
- Fix long click on link-tooltip [#747](https://github.com/quilljs/quill/issues/747)
- Fix ordered list and text-align right interaction [#784](https://github.com/quilljs/quill/issues/784)
- Fix toggling code block off [#789](https://github.com/quilljs/quill/issues/789)
- Scroll position is now automatically preserved between editor blur and focus

Thank you [@benbro](https://github.com/benbro), [@KameSama](https://github.com/KameSama), and [@sachinrekhi](https://github.com/sachinrekhi) for contributions to this release!


# 1.0.0-beta.8

Weekly beta preview release. The editor is almost ready for release candidacy but a couple cycles will be spent on the Snow and Bubble interfaces.

### Work in Progress

Image insertion is being reworked in the provided Snow and Bubble themes. The old image-tooltip has been removed in favor of a simpler and native interaction. By default clicking the image icon on the toolbar will open the OS file picker to convert and that into a base64 image. This will allow for a more natural hook to upload to a remote server instead. Some changes to the link tooltip is also being made to accommodate formula and video insertion, currently only available through the API.

### Breaking Changes

- Image tooltip UI has been removed, see above
- Code blocks now use a single `<pre>` tag, instead of one per line [#723](https://github.com/quilljs/quill/issues/723)

### Bug Fixes

- Fix multiline syntax highlighting [#723](https://github.com/quilljs/quill/issues/723)
- Keep pickers open on api text-change [#734](https://github.com/quilljs/quill/issues/734)
- Emit correct source for text-change [#760](https://github.com/quilljs/quill/issues/760)
- Emit correct parameters in selection-change [#762](https://github.com/quilljs/quill/issues/762)
- Fix error redoing line insertion [#767](https://github.com/quilljs/quill/issues/767)
- Better emitted Deltas for text-change [#768](https://github.com/quilljs/quill/issues/768)
- Better Array.prototype.find polyfill for IE11 [#776](https://github.com/quilljs/quill/issues/776)
- Fix Parchment errors in replacing text [#779](https://github.com/quilljs/quill/issues/779) [#783](https://github.com/quilljs/quill/issues/783)
- Fix align button active state [#780](https://github.com/quilljs/quill/issues/780)
- Fix format text on falsy value [#782](https://github.com/quilljs/quill/issues/782)
- Use native cut [#785](https://github.com/quilljs/quill/issues/785)
- Fix initializing document where last line is formatted [#786](https://github.com/quilljs/quill/issues/786)

Thanks to [benbro](https://github.com/benbro), [bram2w](https://github.com/bram2w), [clemmy](https://github.com/clemmy), [DadaMonad](https://github.com/DadaMonad), [ersommer](https://github.com/ersommer), [michaeljosephrosenthal](https://github.com/michaeljosephrosenthal), [mmorearty](https://github.com/mmorearty), [mshamaiev-intel471](https://github.com/mshamaiev-intel471), and [sachinrekhi](https://github.com/sachinrekhi) for their contributions to this release.


# 1.0.0-beta.7

Became 1.0.0-beta.8 with a fix.


# 1.0.0-beta.6

Weekly beta preview release.

### Features

- Pickers can now be used and is styled in Bubble theme

### Bug Fixes

- Fix editing within formula [#702](https://github.com/quilljs/quill/issues/702)
- Fix adding new line when deleting across lists [#741](https://github.com/quilljs/quill/issues/741)
- Fix placeholder when default block tag is changed [#743](https://github.com/quilljs/quill/issues/743)
- Keep Bubble tooltip open on format [#744](https://github.com/quilljs/quill/issues/744)
- Fix format loss when copying from Quill [#748](https://github.com/quilljs/quill/issues/748) [#750](https://github.com/quilljs/quill/issues/750)
- Break long lines in Firefox [#751](https://github.com/quilljs/quill/issues/751)
- Fix cursor position being off after formatting and typing quickly [#752](https://github.com/quilljs/quill/issues/752)
- Remove image resizing handles on Firefox [#753](https://github.com/quilljs/quill/issues/753)
- Fix removing blockquote on initialization [#754](https://github.com/quilljs/quill/issues/754)
- Fix adding blank lines on initialization [#756](https://github.com/quilljs/quill/issues/756)

Thank you [abejdaniels](https://github.com/abejdaniels), [benbro](https://github.com/benbro), [davelozier](https://github.com/davelozier), [fernandogmar](https://github.com/fernandogmar), [KameSama](https://github.com/KameSama), and [WriterStat](https://github.com/WriterStat) for contributions to this release.


# 1.0.0-beta.5

Weekly beta preview release.

### Features

- Add blur() [#726](https://github.com/quilljs/quill/pull/726)

### Bug Fixes

- Fix null error [#728](https://github.com/quilljs/quill/issues/728)
- Fix building with Node v6 [#732](https://github.com/quilljs/quill/issues/732)
- Ensure button type for supplied buttons [#733](https://github.com/quilljs/quill/issues/733)
- Fix line break pasting on Firefox [#735](https://github.com/quilljs/quill/issues/735)
- Fix 'user' source on API calls [#739](https://github.com/quilljs/quill/issues/739)

Thanks to [benbro](https://github.com/benbro), [lukechapman](https://github.com/lukechapman), [sachinrekhi](https://github.com/sachinrekhi), and [saw](https://github.com/saw) for their contributions to this release.


# 1.0.0-beta.4

Weekly beta preview release.

### Breaking Changes

- Headers no longer generates id attribute [#700](https://github.com/quilljs/quill/issues/700)
- Add Control+Y hotkey on Windows [#705](https://github.com/quilljs/quill/issues/705)
- BlockEmbed Blots are now length 1 and represented in a Delta the same as an inline embed
  - value() used to return object and newline, newline is now removed
  - formats used to be attributed on the newline character, it is now attributed on the object

### Features

- Enter on empty and indented list removes indent [#707](https://github.com/quilljs/quill/issues/707)
- Allow base64 images to be inserted via APIs [#721](https://github.com/quilljs/quill/issues/721)

### Bug Fixes

- Fix typing after clearing inline format [#703](https://github.com/quilljs/quill/issues/703)
- Correctly position Bubble tooltip when selecting multiple lines [#706](https://github.com/quilljs/quill/issues/706)
- Fix typing after link format [#708](https://github.com/quilljs/quill/issues/708)
- Fix loss of selection on using link tooltip [#709](https://github.com/quilljs/quill/issues/709)
- Fix `setSelection(null)` [#722](https://github.com/quilljs/quill/issues/722)

Thank you [@benbro](https://github.com/benbro), [@brynjagr](https://github.com/brynjagr), and [@sachinrekhi](https://github.com/sachinrekhi) for contributions to this release.


# 1.0.0-beta.3

Weekly beta preview release.

### Breaking Changes

- Keyboard was incorrectly using `metaKey` to refer to the control key on Windows. It now correctly refers to the Window key and `shortKey` has been added to refer the common platform specific modifier for hotkeys (metaKey for Mac, ctrlKey for Windows/Linux)
- Formula is now a module, since it uses KaTeX

### Features

- Picker now uses text from original `<option>` if available
- Tabbing inside code blocks inserts tab to each line

### Bug Fixes

- Enter preserves inline formats [#666](https://github.com/quilljs/quill/issues/666)
- Fix resetting format button with no selection [#667](https://github.com/quilljs/quill/issues/667)
- Fix paste interpretation from Word [#668](https://github.com/quilljs/quill/issues/668)
- Focus scrolls to correct cursor position [#669](https://github.com/quilljs/quill/issues/669)
- Fix deleting image on otherwise empty document [#670](https://github.com/quilljs/quill/issues/670)
- Fix bubble toolbar formatting [#679](https://github.com/quilljs/quill/issues/679)
- Fix pasting ql-indent lines [#681](https://github.com/quilljs/quill/issues/681)
- Fix getting into state with double underline tag [#695](https://github.com/quilljs/quill/issues/695)
- Fix source type on delete [#697](https://github.com/quilljs/quill/issues/697)
- Fix indent becoming NaN [#698](https://github.com/quilljs/quill/issues/698)

Thanks to [@benbro](https://github.com/benbro), [@Cinamonas](https://github.com/Cinamonas), [@emanuelbsilva](https://github.com/emanuelbsilva), [@jasonmng](https://github.com/jasonmng), [@jonnolen](https://github.com/jonnolen), [@LucVanPelt](https://github.com/LucVanPelt), [@sachinrekhi](https://github.com/sachinrekhi), [@sagacitysite](https://github.com/sagacitysite), [@WriterStat](https://github.com/WriterStat) for their contributions to this release.


# 1.0.0-beta.2

Weekly beta preview release. Major emphasis on keyboard API and customization.

### Breaking Changes

- Rename code highlighter module to syntax
- Clipboard matchers specified in configuration appends to instead of replaces default matchers
- Change video embed to use `<iframe>` instead of `<video>` enabling Youtube/Vimeo links

### Features

- Add contextual keyboard listeners
- Allow indent format to take +1/-1 in addition to target indent level
- Shortcuts for creating ordered or bulleted lists
- Autofill mailto for email links [#278](https://github.com/quilljs/quill/issues/278)
- Enter does not continue header format [#540](https://github.com/quilljs/quill/issues/540)

### Bug Fixes

- Allow native handling of backspace [#473](https://github.com/quilljs/quill/issues/473) [#548](https://github.com/quilljs/quill/issues/548) [#565](https://github.com/quilljs/quill/issues/565)
- removeFormat() removes last line block formats [#649](https://github.com/quilljs/quill/issues/649)
- Fix text direction icon direction [#654](https://github.com/quilljs/quill/issues/654)
- Fix text insertion into root scroll [#655](https://github.com/quilljs/quill/issues/655)
- Fix focusing on placeholder text in FF [#656](https://github.com/quilljs/quill/issues/656)
- Hide placeholder on formatted line [#657](https://github.com/quilljs/quill/issues/657)
- Fix selection handling on focus and blur [#664](https://github.com/quilljs/quill/issues/664)

Thanks to [@anovi](https://github.com/anovi), [@benbro](https://github.com/benbro), [@jbrowning](https://github.com/jbrowning), [@kei-ito](https://github.com/kei-ito), [@quentez](https://github.com/quentez), [@u9520107](https://github.com/u9520107) for their contributions to this release!


# 1.0.0-beta.1

Weekly beta preview release.

### Breaking Changes

- Toolbar only attaches to `<button>` and `<select>` elements
- Toolbar uses button `value` attribute, instead of `data-value`
- Toolbar handlers overwrite default handlers instead of possibly cascading
- Deprecate keyboard `removeBinding` and `removeAllBindings`

### Features

- Expose default keyboard bindings in configuration
- Add context listener to keyboard bindings

### Bug Fixes

- Error when cursor places next to video embed [#644](https://github.com/quilljs/quill/issues/644)
- Selection removed when clicking on a menu button in the toolbar [#645](https://github.com/quilljs/quill/issues/645)
- Editor looses focus in FF after typing two bold characters [#646](https://github.com/quilljs/quill/issues/646)
- Get rid of resize boxes in code in IE11 [0ad636](https://github.com/quilljs/quill/commit/0ad6363c9fcd70c52ca667d39a393760eeb646b5)
- Text direction icon should flip the arrow when pressed [#651](https://github.com/quilljs/quill/issues/651)
- Not possible to combine direction:rtl with text-align:left [#652](https://github.com/quilljs/quill/issues/652)

Thanks to [@benbro](https://github.com/benbro) for the bug reports for this release!


# 1.0.0-beta.0

Please see the [Upgrading to 1.0](http://beta.quilljs.com/guides/upgrading-to-1-0/) guide.


# 0.20.1

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


# 0.20.0

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
