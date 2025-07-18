/**
 * This is entry point for UMD.
 */

import Quill from './main.js';
import registerDefaultThemes from '@/helpers/registerDefaultThemes';

registerDefaultThemes();

export * from './main.js';
export default Quill;
