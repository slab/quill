import Picker from './picker';


class ColorPicker extends Picker {
  constructor(select) {
    super(select);
    this.container.classList.add('ql-color-picker');
  }

  buildItem(picker, option, index) {
    let item = super.buildItem(picker, option, index);
    item.style.backgoundColor = option.value;
    return item;
  }
}


export { ColorPicker as default };
