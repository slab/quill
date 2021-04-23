import Quill from './core';

import Bold from './formats/bold';
import Italic from './formats/italic';
import Underline from './formats/underline';

/**
 * This file defines which formatting modules should be included
 * into the final build of Quill.
 * Currently only Bold, Italic and Underline are allowed
 * Disabling modules in the `formats` setting of Quill options
 * (client side) does not fully blocks their usage.
 * For example, having background color module registered here will allow
 * pasted content with the background color even if `formats` array
 * does not have BG color formatting enabled.
 *
 * For the full list of modules originally included with Quill
 * please see quill.reg.original.js
 */

Quill.register(
  {
    'formats/bold': Bold,
    'formats/italic': Italic,
    'formats/underline': Underline,
  },
  true,
);

export default Quill;
