import Quill from './core';

/**
 * Front-End handles the registration of modules. We export Quill here only
 * without registering any formatting modules.
 * 
 * Disabling modules in the `formats` setting of Quill options
 * (client side) does not fully blocks their usage.
 * For example, having background color module registered here will allow
 * pasted content with the background color even if `formats` array
 * does not have BG color formatting enabled.
 *
 * For the full list of modules originally included with Quill
 * please see quill.reg.original.js
 */

export default Quill;
