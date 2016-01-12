import EventEmitter from 'eventemitter3';

class Emitter extends EventEmitter {
}

Emitter.events = {
  DEBUG             : 'debug',
  FORMAT_INIT       : 'format-init',
  MODULE_INIT       : 'module-init',
  POST_EVENT        : 'post-event',
  PRE_EVENT         : 'pre-event',
  SELECTION_CHANGE  : 'selection-change',
  TEXT_CHANGE       : 'text-change'
};
Emitter.sources = {
  API    : 'api',
  SILENT : 'silent',
  USER   : 'user'
};


export { Emitter as default };
