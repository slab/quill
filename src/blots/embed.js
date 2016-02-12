import Parchment from 'parchment';
import logger from '../lib/logger';


let debug = logger('quill:embed');


class Embed extends Parchment.Embed {
  format(name, value) {
    debug.warn('Ignoring formatting embed with', name, value);
  }

  formats() {
    return {};
  }
}


export default Embed;
