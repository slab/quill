import Emitter from './emitter';


class Theme {
  constructor(quill) {
    this.quill = quill;
    this.quill.on(Emitter.events.MODULE_LOAD, (name, module) => {
      let capitalCase = name.split('-').map(function(word) {
        return word.charAt(0).toUpperCase() + word.slice(1);
      }).join('');
      if (typeof this['extend' + capitalCase] === 'function') {
        this['extend' + capitalCase](module);
      }
    });
  }
}


export default Theme;
